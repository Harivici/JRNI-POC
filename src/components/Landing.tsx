import "../App.css";
import { Spinner } from "./Spinner";
interface Props {
  companyId: string | undefined;
  companyName: string | undefined;
  getServices: () => void;
  serviceLoading: boolean;
}

export const Landing: React.FC<Props> = ({
  companyId,
  companyName,
  getServices,
  serviceLoading,
}) => {
  return (
    <div className="ButtonsContainer">
      <h5>
        1. Display all {companyName}(JRNI Id: {companyId}) services
      </h5>
      {serviceLoading && <Spinner message="...Loading services" />}
      <button onClick={getServices} className="Btn">
        1.Display services
      </button>
    </div>
  );
};
