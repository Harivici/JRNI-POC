import "../App.css";
interface Props {
  email: string;
  checkoutResp: any;
  clearState: () => void;
}
export const Confirmation: React.FC<Props> = ({
  email,
  clearState,
  checkoutResp,
}) => {
  return (
    <div className="ConfirmContainer">
      <h1 className="ConfirmTitle">Well done.</h1>
      <h5>Booking reference: {checkoutResp._embedded.bookings[0].id}</h5>
      <h5 className="TextCenter">
        Please check your <span className="ConfirmEmail">{email}</span> for
        booking confirmation.
      </h5>
      <br />
      <button className="DisplayServices Btn" onClick={clearState}>
        Back to service bookings page
      </button>
    </div>
  );
};
