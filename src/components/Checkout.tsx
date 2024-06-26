import "../App.css";
import { Spinner } from "./Spinner";

interface Props {
  bookingInfo: any;
  checkout: () => void;
  serviceLoading: boolean;
}

export const Checkout: React.FC<Props> = ({
  bookingInfo,
  checkout,
  serviceLoading,
}) => {
  return (
    <div className="ClientContainer">
      {serviceLoading && <Spinner message="...Booking service" />}
      <h5 className="TextCenter">
        6.Please verify your selected service bookings.
      </h5>
      <div className="CheckoutVerifyContainer">
        <div className="CheckoutVerifyWrapper">
          <p>Service: {bookingInfo.selectedService.name}</p>
          <p>
            Method of Appointment:{" "}
            {bookingInfo.selectedService.method_of_appointment}
          </p>
          <p>
            price:{" "}
            {bookingInfo.selectedService.prices[0] === 0
              ? "Free"
              : `$${(bookingInfo.selectedService.prices[0] / 100).toFixed(2)}`}
          </p>
          <p>
            Selected Date:{" "}
            {new Date(bookingInfo.selectedTimeSlot).toLocaleDateString()}
          </p>
          <p>
            Time slot:{" "}
            {new Date(bookingInfo.selectedTimeSlot).toLocaleTimeString()}
          </p>
          <p>Email: {bookingInfo.clientData.email}</p>

          <p>First name: {bookingInfo.clientData.first_name}</p>

          <p>Last name: {bookingInfo.clientData.last_name}</p>

          <p>
            Phone:{" "}
            {`+${bookingInfo.clientData.mobile_prefix} ${bookingInfo.clientData.mobile}`}
          </p>
        </div>
        <button onClick={checkout} className="DisplayServices Btn">
          6.Book Now
        </button>
      </div>
    </div>
  );
};
