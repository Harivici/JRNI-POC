import { useState, useEffect } from "react";
import { Landing } from "./components/Landing";
import { Services } from "./components/Services";
import { ServiceTimes } from "./components/ServiceTimes";
import { ClientDetails } from "./components/Client";
import { Checkout } from "./components/Checkout";
import { Confirmation } from "./components/Confirmation";

import "./App.css";
// import Vcxlogo from "./assets/Vicinity_Centres_Logo_Large.webp";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const API_URL = process.env.REACT_APP_JRNI_API_URL;
const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;
const COMPANY_NAME = process.env.REACT_APP_COMPANY_NAME;
const APP_ID = process.env.REACT_APP_APP_ID;

const headers = {
  "Content-Type": "application/json",
  "App-Id": `${APP_ID}`,
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const UserInitialInfo = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
};

const App = () => {
  const [services, setServices] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceTimes, setServiceTimes] = useState<any>(null);
  const [basketInfo, setBasketInfo] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any>(null);
  const [basketServiceItem, setBasketServiceItem] = useState<any>(null);
  const [authToken, setAuthToken] = useState<any>(null);
  const [clientData, setClientDataResp] = useState<any>(null);
  const [checkoutResp, setCheckoutResp] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>(UserInitialInfo);
  const [step, setStep] = useState("");
  const [staff, setStaff] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [serviceLoading, setServiceLoading] = useState(false);

  useEffect(() => {
    setStep("welcome");
  }, []);

  const timeSlots =
    serviceTimes?.times &&
    DAYS.map((day, index) => {
      const slots = serviceTimes.times.filter((time: any) => {
        const currentDate = new Date(time.start);
        const currentDay = currentDate.getDay() || DAYS.length;
        return currentDay === index + 1 ? time : "";
      });
      const dateTime = new Date();
      const currentDay = dateTime.getDay() || DAYS.length;
      const currentDate = dateTime.getDate();
      const date = new Date(
        dateTime.setDate(currentDate - (currentDay - (index + 1)))
      );
      return { day, date, slots };
    });

  const getServices = async () => {
    setServiceLoading(true);
    setServices(null);
    setCheckoutResp(null);
    const url = `${API_URL}/api/v5/${COMPANY_ID}/services/?exclude_links[]=child_services&availability[]=0`;
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const serviceResp = await res.json();
    setServices(serviceResp);
    setStep("services");
    setSelectedService(null);
    setServiceLoading(false);
  };

  const getServiceDetails = async (item: any) => {
    setServiceLoading(true);
    const url = `${API_URL}/api/v5/${COMPANY_ID}/services/${item.id}`;
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    await res.json();
    setServiceLoading(true);
  };

  const getServicePeopleItemDetails = async (item: any) => {
    const url = `${API_URL}/api/v5/${COMPANY_ID}/items?service_id=${item.global_id}`;
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const servicePeopleItemDetailsResp = await res.json();
    const staffResp =
      servicePeopleItemDetailsResp &&
      (await Promise.all(
        servicePeopleItemDetailsResp?._embedded?.items?.map(
          async (item: any) => {
            return getServicePeopleDetails(item.person_item_id);
          }
        )
      ));
    staffResp && setStaff(staffResp);
  };

  const getServicePeopleDetails = async (pepoleId: number) => {
    const url = `${API_URL}/api/v5/${COMPANY_ID}/people/${pepoleId}`;
    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const servicePeopleDetailsResp = await res.json();
    return servicePeopleDetailsResp;
  };

  const getServiceTimes = async (item: any, staff?: any) => {
    setServiceLoading(true);
    serviceTimes && setServiceTimes(null);
    checkoutResp && setCheckoutResp(null);
    !staff && getServiceDetails(item);
    !staff && getServicePeopleItemDetails(item);
    !staff && setSelectedService(item);
    const date = new Date();
    let day = DAYS[date.getDay()];
    date.setDate(date.getDate() + (DAYS.length - DAYS.indexOf(day)));

    let url = `${API_URL}/api/v5/${COMPANY_ID}/times?service_id=${
      item.id
    }&start_date=${new Date().toISOString()}&end_date=${
      date.toISOString().split("T")[0]
    }&time_zone=${timeZone}&only_available=true&duration=${
      item.queue_duration
    }`;

    if (staff) {
      url = url + "&person_id=" + staff.id;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const serviceTimesResp = await res.json();
    setServiceTimes(serviceTimesResp);
    setStep("service times");
    !staff && createABasket();
    setServiceLoading(false);
  };

  const createABasket = async () => {
    const url = `${API_URL}/api/v5/baskets`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ company_id: COMPANY_ID }),
    });
    const basketInfoResp = await res.json();
    setBasketInfo(basketInfoResp);
    setAuthToken(res.headers.get("Auth-Token"));
  };

  const addItemIntoBasket = async () => {
    setServiceLoading(true);
    let settings: { person?: number } = {};
    if (selectedStaff) {
      settings.person = selectedStaff.id;
    }
    const time = selectedTimeSlot;
    const url = `${API_URL}/api/v5/baskets/${basketInfo.id}/service_items`;
    const data = {
      price: selectedService.prices[0],
      company_id: `${COMPANY_ID}`,
      duration: selectedService.queue_duration,
      settings,
      service_id: selectedService.id,
      time_zone: timeZone,
      start: time,
      questions: [],
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        "Auth-Token": authToken,
      },
      body: JSON.stringify(data),
    });
    const addItemBasketResp = await res.json();
    setBasketServiceItem(addItemBasketResp);
    setServiceLoading(false);
  };

  const deleteItemInBasket = async () => {
    const url = `${API_URL}/api/v5/baskets/${basketInfo.id}/service_items/${basketServiceItem.id}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        ...headers,
        "Auth-Token": authToken,
      },
    });
    await res.json();
    setBasketServiceItem(null);
    setSelectedTimeSlot(null);
  };

  const clientInfoApi = async () => {
    setServiceLoading(true);
    clientData && setClientDataResp(null);
    const clientInfo = {
      consent: true,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      country: "Australia",
      email: userInfo.email,
      default_company_id: `${COMPANY_ID}`,
      time_zone: "Australia/Sydney",
      mobile: userInfo.phone,
      mobile_prefix: "+61",
      telephone: "",
      mobile_prefix_country_code: "AU",
      questions: [],
      extra_info: {
        locale: "en",
      },
    };

    const res = await fetch(`${API_URL}/api/v5/${COMPANY_ID}/client`, {
      method: "POST",
      headers,
      body: JSON.stringify(clientInfo),
    });
    const clientResp = await res.json();
    setClientDataResp(clientResp);
    setStep("verify");
    setServiceLoading(false);
  };

  const checkout = async () => {
    setServiceLoading(true);
    const url = `${API_URL}/api/v5/baskets/${basketInfo.id}/checkout`;
    const checkoutData = {
      client: clientData,
      is_admin: false,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        "Auth-Token": authToken,
      },
      body: JSON.stringify(checkoutData),
    });
    const checkoutResp = await res.json();
    setCheckoutResp(checkoutResp);
    setStep("confirmation");
    setServiceLoading(false);
  };

  const clearState = () => {
    setServices(null);
    setSelectedService(null);
    setServiceTimes(null);
    setBasketInfo(null);
    setSelectedTimeSlot(null);
    setBasketServiceItem(null);
    setAuthToken(null);
    setClientDataResp(null);
    setCheckoutResp(null);
    setUserInfo(UserInitialInfo);
    setStaff(null);
    setSelectedStaff(null);
    setStep("welcome");
  };

  return (
    <div className="App">
      {/* <img src={Vcxlogo} alt="Vcx Logo" /> <br /> */}
      <h1 className="H1">{`${
        services ? "" : "Welcome to"
      } ${COMPANY_NAME}(${COMPANY_ID}) JRNI appointments/services`}</h1>
      <br />
      {step === "welcome" && (
        <Landing
          companyId={COMPANY_ID}
          companyName={COMPANY_NAME}
          getServices={getServices}
          serviceLoading={serviceLoading}
        />
      )}
      {step === "services" && (
        <Services
          services={services}
          serviceTimes={serviceTimes}
          getServiceTimes={getServiceTimes}
          selectedService={selectedService}
          serviceLoading={serviceLoading}
        />
      )}
      {step === "service times" && (
        <ServiceTimes
          timeSlots={timeSlots}
          setSelectedTimeSlot={setSelectedTimeSlot}
          addItemIntoBasket={addItemIntoBasket}
          selectedService={selectedService}
          selectedTimeSlot={selectedTimeSlot}
          basketServiceItem={basketServiceItem}
          deleteItemInBasket={deleteItemInBasket}
          setStep={setStep}
          setServiceTimes={setServiceTimes}
          setServices={setServices}
          staffInfo={{
            staff,
            selectedStaff,
            setBasketServiceItem,
            setSelectedStaff,
          }}
          getServiceTimes={getServiceTimes}
          serviceLoading={serviceLoading}
        />
      )}
      {step === "client details" && (
        <ClientDetails
          userInfo={userInfo}
          clientInfoApi={clientInfoApi}
          setUserInfo={setUserInfo}
          serviceLoading={serviceLoading}
        />
      )}
      {step === "verify" && (
        <Checkout
          checkout={checkout}
          bookingInfo={{ clientData, selectedService, selectedTimeSlot }}
          serviceLoading={serviceLoading}
        />
      )}
      {step === "confirmation" && (
        <Confirmation
          email={userInfo.email}
          clearState={clearState}
          checkoutResp={checkoutResp}
        />
      )}
      <br />
    </div>
  );
};

export default App;
