import { useState } from "react";
import "../App.css";
import { Staff } from "./Staff";
import { Spinner } from "./Spinner";

interface Props {
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
}

export const ServiceTimes: React.FC<Props> = ({
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
}) => {
  const [message, setMessage] = useState("");
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
      <h5>
        3.Choose a time slot for
        <span className="ServiceColor">{` ${selectedService.name} `}</span>
        service to add into basket:
      </h5>

      {timeSlots &&
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
        })}
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
          onClick={deleteItemInBasket}
          className="ServiceTimeButton Btn"
          disabled={!selectedTimeSlot || !basketServiceItem}
        >
          Delete time slot from Basket
        </button>
        <button
          onClick={() => {
            setStep("client details");
          }}
          className="ServiceTimeButton Btn"
          disabled={!basketServiceItem}
        >
          Proceed to Client Details
        </button>
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
      </div>
    </div>
  );
};
