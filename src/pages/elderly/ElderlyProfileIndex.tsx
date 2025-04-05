
import React from "react";
import { Navigate } from "react-router-dom";

// This component just redirects to the personal info page
const ElderlyProfileIndex = () => {
  return <Navigate to="/elderly-profile/personal" replace />;
};

export default ElderlyProfileIndex;
