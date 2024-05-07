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
  staffInfo: any;
  setSelectedTimeSlot: (val: string) => void;
  addItemIntoBasket: () => void;
  selectedService: any;
  selectedTimeSlot: any;
  basketServiceItem: any;
  deleteItemInBasket: () => void;
  setStep: (val: string) => void;
  getServiceTimes: (val: any, staff: any) => void;
  serviceLoading: boolean;
  setServiceLoading: (val: any) => void;
  serviceDetails: any;
  clearState: () => void;
  basketInfo: any;
}

export const ServiceTimes: React.FC<Props> = ({
  serviceTimes,
  setSelectedTimeSlot,
  selectedService,
  addItemIntoBasket,
  selectedTimeSlot,
  basketServiceItem,
  deleteItemInBasket,
  setStep,
  staffInfo,
  getServiceTimes,
  serviceLoading,
  setServiceLoading,
  serviceDetails,
  clearState,
  basketInfo,
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
    if (staff && staff !== "anyone") {
      url = url + "&person_id=" + staff.id;
    } else {
      if (staffInfo?.selectedStaff && !staff) {
        url = url + "&person_id=" + staffInfo.selectedStaff.id;
      }
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
      {serviceLoading && !basketInfo && <Spinner message={message} />}
      {staffInfo.staff?.length > 0 && (
        <Staff
          selectedService={selectedService}
          selectedDate={selectedDate}
          staffInfo={staffInfo}
          getServiceTimes={getServiceTimes}
          setSelectedTimeSlot={setSelectedTimeSlot}
          setMessage={setMessage}
          getDayServiceTimes={getDayServiceTimes}
        />
      )}
      <SelectDate
        selectedDate={selectedDate}
        onChange={(date: Moment) => {
          setSelectedDate(date);
          getDayServiceTimes(date);
        }}
        selectedService={selectedService}
        serviceTimes={serviceTimes}
        setSelectedDate={setSelectedDate}
        setSelectedDayTimeSlots={setSelectedDayTimeSlots}
        getServiceTimes={getServiceTimes}
      />

      {selectedDate && selectedDayTimeSlots?.times?.length > 0 ? (
        <>
          <hr className="StaffSection" />
          <h3>
            Select a time slot for
            <span className="ServiceColor">{` ${selectedService.name} `}</span>
            service
          </h3>

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
        </>
      ) : (
        selectedDayTimeSlots?.times?.length === 0 && (
          <div>
            {" "}
            Sorry no time slots for{" "}
            {staffInfo?.selectedStaff?.name || "Any one"}
          </div>
        )
      )}
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
            clearState();
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
