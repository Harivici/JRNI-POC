import "../App.css";
import { Spinner } from "./Spinner";
import { Service } from "./Service";
interface Props {
  services: any;
  serviceTimes: any;
  getServiceTimes: (item: any) => void;
  selectedService: any;
  serviceLoading: boolean;
}

export const Services: React.FC<Props> = ({
  services,
  getServiceTimes,
  selectedService,
  serviceTimes,
  serviceLoading,
}) => {
  return (
    <div className="ServicesContainer">
      {serviceLoading && <Spinner message="...Loading staff and time slots" />}
      <div className="ServiceTitle">
        <h5>2.What service would you like to book?</h5>
      </div>
      {!serviceTimes &&
        services?._embedded.services.map((item: any) => {
          return (
            <Service key={item.id} service={item}  selectedService={selectedService} getServiceTimes={getServiceTimes}/>
          );
        })}
    </div>
  );
};
