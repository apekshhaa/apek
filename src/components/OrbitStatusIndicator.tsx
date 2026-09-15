import React from "react";
import "./OrbitStatusIndicator.css";

interface OrbitStatusIndicatorProps {
  isDarkMode?: boolean;
}

export const OrbitStatusIndicator: React.FC<OrbitStatusIndicatorProps> = ({
  isDarkMode = false,
}) => {
  return (
    <span
      className={`orbit-status ${isDarkMode ? "orbit-status--dark" : "orbit-status--light"}`}
      aria-hidden="true"
    >
      <span className="orbit-status__ring">
        <span className="orbit-status__dot orbit-status__dot--bright" />
        <span className="orbit-status__dot" />
        <span className="orbit-status__dot" />
      </span>
    </span>
  );
};
