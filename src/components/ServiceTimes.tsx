import { useState } from "react";
import moment, { Moment } from "moment-timezone";
import "../App.css";
import { Staff } from "./Staff";
import { Spinner } from "./Spinner";
import { SelectDate } from "./SelectDate";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const API_URL = process.env.REACT_APP_JRNI_API_URL;
const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;
const APP_ID = process.env.REACT_APP_APP_ID;

const headers = {
  "Content-Type": "application/json",
  "App-Id": `${APP_ID}`,
};
interface Props {
  serviceTimes: any;
  timeSlots: any;
  staffInfo: any;
  setSelectedTimeSlot: (val: string) => void;
  addItemIntoBasket: () => void;
  selectedService: any;
  selectedTimeSlot: any;
  basketServiceItem: any;
  deleteItemInBasket: () => void;
  setStep: (val: string) => void;
  setServiceTimes: (val: any) => void;
  setServices: (val: any) => void;
  getServiceTimes: (val: any, staff: any) => void;
  serviceLoading: boolean;
  setServiceLoading: (val: any) => void;
  serviceDetails: any;
}

export const ServiceTimes: React.FC<Props> = ({
  serviceTimes,
  timeSlots,
  setSelectedTimeSlot,
  selectedService,
  addItemIntoBasket,
  selectedTimeSlot,
  basketServiceItem,
  deleteItemInBasket,
  setStep,
  setServiceTimes,
  setServices,
  staffInfo,
  getServiceTimes,
  serviceLoading,
  setServiceLoading,
  serviceDetails,
}) => {
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedDayTimeSlots, setSelectedDayTimeSlots] = useState<any>(null);

  const getDayServiceTimes = async (selectedDate: Moment, staff?: any) => {
    setServiceLoading(true);
    setSelectedDayTimeSlots(null);

    let url = `${API_URL}/api/v5/${COMPANY_ID}/times?service_id=${
      serviceDetails.id
    }&start_date=${selectedDate.format(
      "YYYY-MM-DD"
    )}T00:00:00.999Z&end_date=${selectedDate.format(
      "YYYY-MM-DD"
    )}T23:59:59.999Z&time_zone=${timeZone}&only_available=true&duration=${
      serviceDetails.queue_duration
    }`;

    if (staff) {
      url = url + "&person_id=" + staff.id;
    }

    const res = await fetch(url, {
      method: "GET",
      headers,
    });

    const serviceTimesResp = await res.json();
    setSelectedDayTimeSlots(serviceTimesResp);
    setServiceLoading(false);
  };
  return (
    <div className="ServiceTimesContainer">
      {serviceLoading && <Spinner message={message} />}
      {staffInfo.staff?.length > 0 && (
        <Staff
          selectedService={selectedService}
          staffInfo={staffInfo}
          getServiceTimes={getServiceTimes}
          setSelectedTimeSlot={setSelectedTimeSlot}
          setMessage={setMessage}
        />
      )}
      <SelectDate
        selectedDate={selectedDate}
        onChange={(date: Moment) => {
          setSelectedDate(date);
          getDayServiceTimes(date);
        }}
        serviceTimes={serviceTimes}
      />
      <h5>
        3.Choose a time slot for
        <span className="ServiceColor">{` ${selectedService.name} `}</span>
        service to add into basket:
      </h5>
      {selectedDayTimeSlots && (
        <div className="timeslotsContiner">
          {selectedDayTimeSlots.times.map((item: any) => {
            return (
              <div
                key={item.start}
                className={`timeslot ${
                  item.start === selectedTimeSlot?.start ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedTimeSlot(item);
                }}
              >
                {moment(item.start).format("h:mma")}
              </div>
            );
          })}
        </div>
      )}
      {/* {timeSlots &&
        timeSlots.map((slot: any) => {
          const localDateVal = slot.date.toLocaleDateString();
          return (
            <div key={slot.day} className="SlotContainer">
              <div className="LabelContainer">
                <label htmlFor="time-select" className="DayLabel">
                  Choose{" "}
                  <span className="DayColor">{`${slot.day} on ${localDateVal}`}</span>{" "}
                  time:
                </label>
              </div>
              <div className="SelectionContainer">
                <select
                  name="times"
                  id={slot.day}
                  className="SelectionTimes"
                  onChange={(e) => {
                    setSelectedTimeSlot(e.target.value);
                  }}
                >
                  <option value="">--Please choose an option--</option>
                  {slot.slots.map((dayTime: any) => {
                    const dateTime = new Date(dayTime.start);
                    const timeSlot = dateTime.toLocaleTimeString();
                    return (
                      <option key={dayTime.start} value={dayTime.start}>
                        {timeSlot}
                      </option>
                    );
                  })}
                </select>
                <svg
                  id="svg"
                  onClick={() => {
                    console.log("on change event");
                  }}
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fal"
                  data-icon="chevron-down"
                  className="svg-inline--fa fa-chevron-down fa-w-14 f1ngfyag f19cwxkv f1276t1q"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="currentColor"
                    d="M443.5 162.6l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0L224 351 28.5 155.5c-4.7-4.7-12.3-4.7-17 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17l211 211.1c4.7 4.7 12.3 4.7 17 0l211-211.1c4.8-4.7 4.8-12.3.1-17z"
                  ></path>
                </svg>
              </div>
            </div>
          );
        })} */}
      <button
        onClick={() => {
          setMessage("... Adding time slot into Basket");
          addItemIntoBasket();
        }}
        className="ServiceTimeButton Btn"
        disabled={!selectedTimeSlot || basketServiceItem}
      >
        4.Add time slot into Basket
      </button>
      <div className="DeleteTimeSlotBasket">
        <button
          className="ServiceTimeButton Btn"
          onClick={() => {
            setServiceTimes(null);
            setServices(null);
            setStep("welcome");
          }}
        >
          Back to services
        </button>
        {/* <button
          onClick={deleteItemInBasket}
          className="ServiceTimeButton Btn"
          disabled={!selectedTimeSlot || !basketServiceItem}
        >
          Delete time slot from Basket
        </button> */}
        <button
          onClick={() => {
            setStep("client details");
          }}
          className="ServiceTimeButton Btn"
          disabled={!basketServiceItem}
        >
          Proceed to Client Details
        </button>
      </div>
    </div>
  );
};
