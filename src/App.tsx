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
  };

  const getServiceTimes = async (item: any) => {
    serviceTimes && setServiceTimes(null);
    checkoutResp && setCheckoutResp(null);
    setSelectedService(item);
    const date = new Date();
    let day = DAYS[date.getDay()];
    date.setDate(date.getDate() + (DAYS.length - DAYS.indexOf(day)));

    const url = `${API_URL}/api/v5/${COMPANY_ID}/times?service_id=${
      item.id
    }&start_date=${new Date().toISOString()}&end_date=${
      date.toISOString().split("T")[0]
    }&time_zone=${timeZone}&only_available=true&duration=${
      item.queue_duration
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers,
    });
    const serviceTimesResp = await res.json();
    setServiceTimes(serviceTimesResp);
    setStep("service times");
    createABasket();
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
    const time = selectedTimeSlot;
    const url = `${API_URL}/api/v5/baskets/${basketInfo.id}/service_items`;
    const data = {
      price: selectedService.prices[0],
      company_id: `${COMPANY_ID}`,
      duration: selectedService.queue_duration,
      settings: {},
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
  };

  const checkout = async () => {
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
        />
      )}
      {step === "services" && (
        <Services
          services={services}
          serviceTimes={serviceTimes}
          getServiceTimes={getServiceTimes}
          selectedService={selectedService}
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
        />
      )}
      {step === "client details" && (
        <ClientDetails
          userInfo={userInfo}
          clientInfoApi={clientInfoApi}
          setUserInfo={setUserInfo}
        />
      )}
      {step === "verify" && (
        <Checkout
          checkout={checkout}
          bookingInfo={{ clientData, selectedService, selectedTimeSlot }}
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
