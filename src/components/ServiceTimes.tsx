import "../App.css";

interface Props {
  timeSlots: any;
  setSelectedTimeSlot: (val: string) => void;
  addItemIntoBasket: () => void;
  selectedService: any;
  selectedTimeSlot: any;
  basketServiceItem: any;
  deleteItemInBasket: () => void;
  setStep: (val: string) => void;
  setServiceTimes: (val: any) => void;
  setServices: (val: any) => void;
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
}) => {
  return (
    <div className="ServiceTimesContainer">
      <h1>
        3.Choose a time slot for
        <span className="ServiceColor">{` ${selectedService.name} `}</span>
        service to add into basket:
      </h1>

      {timeSlots.map((slot: any) => {
        const localDateVal = slot.date.toLocaleDateString();
        return (
          <div
            key={slot.day}
            className="SlotContainer"
          >
            <div className="LabelContainer">
              <label
                htmlFor="time-select"
                className="DayLabel"
              >
                Choose{" "}
                <span
                  className="DayColor"
                >{`${slot.day} on ${localDateVal}`}</span>{" "}
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
            </div>
          </div>
        );
      })}
      <button
        onClick={addItemIntoBasket}
        className="ServiceTimeButton"
        disabled={!selectedTimeSlot || basketServiceItem}
      >
        4.Add time slot into Basket
      </button>
      <div className='DeleteTimeSlotBasket'
        style={{
          
        }}
      >
        <button
          onClick={deleteItemInBasket}
          className="ServiceTimeButton"
          disabled={!selectedTimeSlot || !basketServiceItem}
        >
          Delete time slot from Basket
        </button>
        <button
          onClick={() => {
            setStep("client details");
          }}
          className="ServiceTimeButton"
          disabled={!basketServiceItem}
        >
          Proceed to Client Details
        </button>
        <button
          className="ServiceTimeButton"
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
