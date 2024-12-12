import {useState, useEffect } from "react";
import { headers } from '../App'
import "../App.css";

interface Props {
  service: any;
  selectedService: any;
  getServiceTimes: (item: any) => void;
}

export const Service: React.FC<Props> = ({
  service,
  selectedService,
  getServiceTimes
}) => {
  const [image, setImage] = useState(null)
  useEffect(() => {
    const url = service._links?.images?.href
    const getImage = async () => {
    const res = await fetch(url, {
      method: "GET",
      headers
    });
    const imagesResp = await res.json();
    setImage(imagesResp?._embedded?.images[0]?.url);
  }
  if (!image) {
   getImage()
  }
  },[])
  
  return (
    <div
      className="ServiceDiv"
      style={{
        background:
          selectedService && service.name === selectedService.name
            ? "#a48d53"
            : "",
      }}
      key={service.name}
      onClick={() => getServiceTimes(service)}
    >
      <img
        src={image || "https://a.storyblok.com/f/133553/652x481/8a372130e0/aje__freshabake__lny_kokocapture.jpg/m/520x340"}
        alt="service"
        height={170}
      />
      <h4 className="ServiceDuration">
        {service.queue_duration / 60} hour
      </h4>
      <div
        className="ServiceItem"
        style={{
          color:
            selectedService && service.name === selectedService.name
              ? "white"
              : "",
        }}
      >
        {service.name}
      </div>
    </div>
  );
       
    
 
};
