import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./createcampaign.css";
function HomePage() {
  const navigate = useNavigate();
  const navigateToCreateCampaign = () => {
    navigate("/bulk-sms/send-message"); // Assuming your route to the campaign creation page is '/create-campaign'
  };

  return (
    
    <Container
    className="d-flex justify-content-center align-items-center"
    style={{ height: '100vh' }} // Adjust the height as needed
  >
        <div className="custom-home-containerc">
          <div className="greeting-message">
            Hi Siddhant ! , Let's create another campaign
          </div>
          <button
            className="btn btn-primary create-campaign-button"
            onClick={navigateToCreateCampaign}
          >
            Create Campaign
          </button>
        </div>
      </Container>
   
  );
}

export default HomePage;
