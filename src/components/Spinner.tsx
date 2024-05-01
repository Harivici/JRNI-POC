import React from "react";
import "../App.css";

interface Props {
  className?: string;
  size?: "small" | "large";
  message?: string;
}

export const Spinner: React.FC<Props> = ({ message }) => (
  <div className="SpinnerContainer">
    <div className="Spinner" />
    <div className="Message">{message}</div>
  </div>
);
