import "../App.css";
import { Spinner } from "./Spinner";
import { useEffect } from "react";
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
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])

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
