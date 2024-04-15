import "../App.css";

interface Props {
  services: any;
  serviceTimes: any;
  getServiceTimes: (item: any) => void;
  selectedService: any;
}

export const Services: React.FC<Props> = ({
  services,
  getServiceTimes,
  selectedService,
  serviceTimes,
}) => {
  return (
    <div className="ServicesContainer">
      <div className="ServiceTitle">
        <h1>2.What service would you like to book?</h1>
      </div>

      {!serviceTimes &&
        services?._embedded.services.map((item: any) => {
          return (
            <div
              className="ServiceDiv"
              style={{
                background:
                  selectedService && item.name === selectedService.name
                    ? "#a48d53" 
                    : "",
              }}
              key={item.name}
              onClick={() => getServiceTimes(item)}
            >
              <span className="ServiceDuration">
                {item.queue_duration / 60} hour
              </span>
              <div className="ServiceItem">{item.name}</div>
            </div>
          );
        })}
    </div>
  );
};
