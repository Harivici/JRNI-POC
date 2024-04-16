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
        <h5>2.What service would you like to book?</h5>
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
              <img
                src="https://a.storyblok.com/f/133553/652x481/8a372130e0/aje__freshabake__lny_kokocapture.jpg/m/520x340"
                alt="service"
                height={170}
              />
              <h4 className="ServiceDuration">
                {item.queue_duration / 60} hour
              </h4>
              <div
                className="ServiceItem"
                style={{
                  color:
                    selectedService && item.name === selectedService.name
                      ? "white"
                      : "",
                }}
              >
                {item.name}
              </div>
            </div>
          );
        })}
    </div>
  );
};
