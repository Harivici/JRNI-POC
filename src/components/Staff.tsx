import "../App.css";
import userIcon from "../assets/user-icon.jpg";
interface Props {
  staffInfo: any;
  selectedService: any;
  getServiceTimes: (val: any, staff: any) => void;
  setSelectedTimeSlot: (val: any) => void;
  setMessage: (val: string) => void;
}

export const Staff: React.FC<Props> = ({
  selectedService,
  staffInfo,
  getServiceTimes,
  setSelectedTimeSlot,
  setMessage,
}) => {
  return (
    <>
      <hr className="StaffSection" />
      <h5>Already work with someone you like?</h5>
      <div className="StaffContainer">
        {staffInfo.staff.map((item: any) => {
          return (
            <div
              className="StaffItem"
              style={{
                background:
                  item.id === staffInfo.selectedStaff?.id ? "#a48d53" : "",
              }}
              key={item.id}
              onClick={() => {
                staffInfo.setSelectedStaff(item);
                setMessage(`... Loading ${item.name} time slots`);
                getServiceTimes(selectedService, item);
                staffInfo.setBasketServiceItem(null);
                setSelectedTimeSlot(null);
              }}
            >
              <img src={userIcon} alt="user Icon" />
              <span>
                <strong>{item.name}</strong>
              </span>
            </div>
          );
        })}
        <div
          className="StaffItem"
          style={{
            background: !staffInfo.selectedStaff?.id ? "#a48d53" : "",
          }}
          onClick={() => {
            staffInfo.setSelectedStaff(null);
            setMessage(`... Loading Any one time slots`);
            getServiceTimes(selectedService, null);
          }}
        >
          <img src={userIcon} alt="user Icon" />
          <span>
            <strong>Any one</strong>
          </span>
        </div>
      </div>
      <hr className="StaffSection" />
    </>
  );
};
