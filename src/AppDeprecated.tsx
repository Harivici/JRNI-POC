import { useState } from "react";
import "./App.css";

const AppDeprecated = () => {
  const [services, setServices] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [times, setTimes] = useState<any>(null);
  const [authToken, setAuthToken] = useState<any>(null);
  const [clientData, setClientDataResp] = useState<any>(null);
  const [checkoutResp, setCheckoutResp] = useState<any>(null);
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]
  const getServices = async () => {
    setServices(null);
    setCheckoutResp(null)
    const res = await fetch(
      "https://vicinity-demo.jrni.com/api/v5/37009/services/?exclude_links[]=child_services&availability[]=0",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "App-Id": "78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2",
        },
      }
    );
    const serviceResp = await res.json();
    setServices(serviceResp);
  };

  const getServiceTimes = async (item: any) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("item", item);
    times && setTimes(null);
    checkoutResp && setCheckoutResp(null)
    setSelectedService(item);
    
    const d = new Date();
    let day = DAYS[d.getDay()];
    d.setDate(d.getDate() + (DAYS.length - DAYS.indexOf(day)));

    const url = `https://vicinity-demo.jrni.com/api/v5/37009/times?service_id=${
      item.id
    }&start_date=${new Date().toISOString()}&end_date=${d.toISOString().split('T')[0]}&time_zone=${timeZone}&only_available=true&duration=${
      item.queue_duration
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "App-Id": "78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2",
      },
    });
    const serviceTimesResp = await res.json();
    setTimes(serviceTimesResp);
  };

  const addItemIntoBasket = async (time: any) => {
    console.log("time", time);
    setAuthToken(null);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const data = {
      entire_basket: true,
      items: [
        {
          price: selectedService.prices[0],
          book: `https://vicinity-demo.jrni.com/api/v5/37009/basket/add_item?service_id=${selectedService.id}`,
          duration: selectedService.queue_duration,
          settings: {},
          service_id: selectedService.id,
          // "ref": 1402615076,
          time_zone: timeZone,
          datetime: time,
        },
      ],
    };
    const res = await fetch(
      "https://vicinity-demo.jrni.com/api/v5/37009/basket/add_item?service_id=48427",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "App-Id": "78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2",
        },
        body: JSON.stringify(data),
      }
    );
    // const addItemBasketResp = await res.json()

    setAuthToken(res.headers.get("Auth-Token"));
  };

  const client = async () => {
    clientData && setClientDataResp(null);
    const clientInfo = {
      consent: true,
      first_name: "Hari",
      last_name: "Suddapalli",
      country: null,
      email: "harikrishna.suddapalli@vicinity.com.au", //"hk.sudda@gmail.com",
      default_company_id: 37009,
      time_zone: "Australia/Sydney",
      mobile: "432023177",
      mobile_prefix: "+61",
      telephone: "",
      mobile_prefix_country_code: "AU",
      questions: [],
      extra_info: {
        locale: "en",
      },
    };
    const res = await fetch(
      "https://vicinity-demo.jrni.com/api/v5/37009/client",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "App-Id": "78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2",
        },
        body: JSON.stringify(clientInfo),
      }
    );
    const clientResp = await res.json();
    console.log("clientResp", clientResp);
    setClientDataResp(clientResp);
  };
  const checkout = async () => {
    // const url = `https://vicinity-demo.jrni.com/api/v5/baskets/${basketResp.id}/checkout`
    // const url = 'https://vicinity-demo.jrni.com/api/v5/37009/basket/checkout?member_id='+'14'
    const url = "https://vicinity-demo.jrni.com/api/v5/37009/basket/checkout";
    const checkoutData = {
      client: clientData,
      is_admin: false,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "App-Id": "78c3c238a140b36865ea53bebbf483d8c60a7dcd57b2",
        "Auth-Token": authToken,
      },
      body: JSON.stringify(checkoutData),
    });
    const checkoutResp = await res.json();
    setCheckoutResp(checkoutResp);
  };
  return (
    <div className="App">
      <h1>Welcome to QVB(37009) JRNI appointments/services</h1>
      <br />
      <div style={{ display: "flex", gap: "100px", justifyContent: "center" }}>
        <button
          onClick={getServices}
          style={{ padding: "20px", fontSize: "18px" }}
        >
          1.Display services
        </button>
        <button onClick={client} style={{ padding: "20px", fontSize: "18px" }}>
          4.Add Client
        </button>
        <button
          onClick={checkout}
          style={{ padding: "20px", fontSize: "18px" }}
        >
          5.Checkout
        </button>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "50px",
          margin: "auto",
          // flexDirection: "column",
        }}
      > <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        margin: "auto",
        flexDirection: "column",
      }}
      >
        {services && <h2>2.What service would you like to book?</h2>}
        {services?._embedded.services.map((item: any) => {
          return (
            <div
              style={{
                display: "flex",
                border: "1px solid gold",
                boxShadow: "0 3px 4px 0 blue",
                cursor: "pointer",
                padding: "16px",
                width: "200px",
                margin: "auto",
                justifyContent: "center",
                flexDirection: "column",
                background:
                  selectedService && item.name === selectedService.name
                    ? "gold"
                    : "",
              }}
              key={item.name}
              onClick={() => getServiceTimes(item)}
            >
              <span style={{ textAlign: "left" }}>
                {item.queue_duration / 60} hour
              </span>
              <div
                style={{ display: "flex", fontSize: "20px", fontWeight: "700" }}
              >
                {item.name}
              </div>
            </div>
          );
        })}
        </div>
        <div
      style={{
        display: "flex",
        gap: "20px",
        margin: "auto",
        flexDirection: "column",
        justifyContent: 'flex-start'
      }}
      >
        {times && (
          <>
            <label
              htmlFor="time-select"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              3.Choose a time slot for <span style={{color: 'red'}}>{selectedService.name}</span> to add into basket:
            </label>

            <select
              name="times"
              id="time-select"
              style={{ margin: "auto", fontSize: "20px" }}
              onChange={(e) => {
                addItemIntoBasket(e.target.value);
              }}
            >
              <option value="">--Please choose an option--</option>

              {times.times.map((time: any) => {
                return (
                  <option key={time.start} value={time.start}>
                    {time.start}
                  </option>
                )
              })}
            </select>
            {DAYS.map((day, index) => {
              const dayFilters = times.times.filter((time: any) => {
                const da = new Date(time.start)
                let d = da.getDay()
                if (d === 0) {
                  d = 7
                }
                if (d === index + 1) {
                  return  time
                }
              })
              console.log('dayFilters', dayFilters)
              return  (<div key={day}>
              <label
              htmlFor="time-select"
              style={{ fontSize: "20px", fontWeight: 700 }}
            >
              Choose <span style={{color: 'green'}}>{day}</span> time:
            </label>
              <select name="times"
              id="time-select"
              style={{ margin: "auto", fontSize: "20px" }}
              onChange={(e) => {
                addItemIntoBasket(e.target.value);
              }}
              >
               <option value="">--Please choose an option--</option>
              {dayFilters.map((stime: any) => {
                return (<option key={stime.start} value={stime.start}>
                  {stime.start}
                </option>)
                })}
              </select>
              </div>
            )})}
          </>
        )}
      </div>
      </div>
      {checkoutResp && (
        <h1>Well done. Please check your email for booking confirmation.</h1>
      )}
    </div>
  );
};

export default AppDeprecated;
