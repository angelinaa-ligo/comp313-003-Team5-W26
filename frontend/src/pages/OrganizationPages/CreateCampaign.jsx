import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrgNavBar from "../../components/OrgNavBar";

export default function CreateCampaign() {
  const navigate = useNavigate();

  return (
    <div className="campaign-wrapper">
      <OrgNavBar />
    </div>
  );
}