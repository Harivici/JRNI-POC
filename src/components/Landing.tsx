import "../App.css";

interface Props {
  companyId: string | undefined;
  companyName: string | undefined;
  getServices: () => void;
}

export const Landing: React.FC<Props> = ({
  companyId,
  companyName,
  getServices,
}) => {
  return (
    <div className="ButtonsContainer">
      <h5>
        1. Display all {companyName}(JRNI Id: {companyId}) services
      </h5>
      <button onClick={getServices} className="Btn">
        1.Display services
      </button>
    </div>
  );
};
