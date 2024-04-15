import '../App.css'

interface Props {
  companyId: string | undefined
  companyName: string | undefined
  getServices: () => void
}

export const Landing: React.FC<Props> = ({companyId, companyName, getServices}) => {
  return (
      <div className="ButtonsContainer">
          <h1>1. Display all {companyName}(JRNI Id: {companyId}) services</h1>
          <button onClick={getServices} className="DisplayServices">
            1.Display services
          </button>
        </div>
  )
}