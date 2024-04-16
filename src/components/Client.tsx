import "../App.css";
import { UserInfo } from "../App";

interface Props {
  userInfo: UserInfo;
  clientInfoApi: () => void;
  setUserInfo: (info: UserInfo) => void;
}

export const ClientDetails: React.FC<Props> = ({
  userInfo,
  clientInfoApi,
  setUserInfo,
}) => {
  return (
    <div className="ClientContainer">
      <h5 className="TextCenter">5.Please enter User details.</h5>
      <div className="ClientFormContainer">
        <div className="ClientFormWrapper">
          <div className="ClientInputWrapper">
            <label htmlFor="First name">First name:</label>
            <input
              id="firstName"
              placeholder="Enter First name"
              onChange={(e) =>
                setUserInfo({ ...userInfo, firstName: e.target.value })
              }
              value={userInfo.firstName}
              className="ClientInput"
            />
          </div>

          <br />
          <div className="ClientInputWrapper">
            <label htmlFor="Last name">Last name:</label>
            <input
              id="lastName"
              placeholder="Enter Last name"
              onChange={(e) =>
                setUserInfo({ ...userInfo, lastName: e.target.value })
              }
              value={userInfo.lastName}
              className="ClientInput"
            />
          </div>
          <br />
          <div className="ClientInputWrapper">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              placeholder="Enter Email"
              onChange={(e) =>
                setUserInfo({ ...userInfo, email: e.target.value })
              }
              value={userInfo.email}
              className="ClientInput"
            />
          </div>
          <br />
          <div className="ClientInputWrapper">
            <label htmlFor="phone">Mobile Phone No:</label>

            <input
              id="mobile"
              placeholder="Enter Mobile Phone"
              autoComplete="off"
              onChange={(e) =>
                setUserInfo({ ...userInfo, phone: e.target.value })
              }
              value={userInfo.phone}
              className="ClientInput"
            />
          </div>
        </div>
        <br />
        <br />
        <button onClick={clientInfoApi} className="DisplayServices Btn">
          5.Add Client Details to Basket
        </button>
      </div>
    </div>
  );
};
