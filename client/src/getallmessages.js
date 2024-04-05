import React, { useEffect, useState } from "react";

import { Container, Form } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import SendIcon from "@mui/icons-material/Send";
import "./getallmessages.css"; // Assuming your custom styles are here
import 'bootstrap/dist/css/bootstrap.min.css';
import './campaignsallinfo.css';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import url from './resource/constants';

function App() {
  const [campaignNumber, setCampaignNumber] = useState(null);
  const [GtallmsgCurrentPage, setGtallmsgCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [listOfAllMessages, setListOfAllMessages] = useState([]);

  const status = [
    { value: "failed", label: "Failed" },
    { value: "sent", label: "Sent" },
    { value: "delivered", label: "Delivered" },
  ];
  const handleGtallmsgPageChange = (event) => {
    const page = parseInt(event.target.value, 10);
    if (page >= 1) { // Ensure the page number is 1 or greater
      setGtallmsgCurrentPage(page);
    }
  };
  useEffect(() => {
    fetch(`https://localhost:5000/api/getallmessages/${GtallmsgCurrentPage}`) // Adjusted for pagination
      .then(response => response.json())
      .then(data => setListOfAllMessages(data.data))
      .catch(error => console.error("Error fetching data:", error));
  }, [GtallmsgCurrentPage]); // Depend on GtallmsgCurrentPage to refetch when it changes

  const updateStatus = async (e) => {
    e.preventDefault();
    const response = await fetch(`${url}/twilio/update-status`);
    if (response.ok) {
        window.location.reload();
      console.log("Request successful");
    } else {
      console.error("Request failed");
    }
  }

  return (
    <Container
      className="d-flex flex-column justify-content-center position-relative "
      style={{ minHeight: "100vh"  ,marginTop: "20px"}}
    >
      <div className="form-cont-gm custom-form-container"  >
        <Form>
          {/* Campaign Name */}
          <TextField
            className="custom-text-field"
            label="Campaign Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={campaignNumber}
            onChange={(e) => setCampaignNumber(e.target.value)}
            type="number" // This makes the TextField accept numeric input
            required
          />
          {/* State Dropdown */}
          <TextField
            select
            className="custom-text-field"
            label="Select Status"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
            }}
            required
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

        </Form>
          <button className="custom-send-button" onClick={updateStatus}>
            Update status <SendIcon />
          </button>
      </div>

      {/* Table container */}
      <div className="table-responsivem " style={{ width: '100%', flexGrow: 1, overflow: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Campaign ID</th>
            <th>Agent ID</th>
            <th>Send Date Time</th>
            <th>Status</th>
            <th>Twilio SID</th>
          </tr>
        </thead>
        <tbody>
          {listOfAllMessages.filter(
              (message) =>
                (!selectedStatus ||
                  message.status
                    .toLowerCase()
                    .includes(selectedStatus.toLowerCase())) &&
                (!campaignNumber ||
                  message.campaignID === Number(campaignNumber))
            )
            .map((message) => (
              <tr key={message.ID}>
                <td>{message.ID}</td>
                <td>{message.campaignID}</td>
                <td>{message.agentID}</td>
                <td>{new Date(message.sendDateTime).toLocaleString()}</td>
                <td>{message.status}</td>
                <td>{message.twilioSid}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>  
    <div className='getallmessagesbut' style={{ display: 'flex', gap: '10px', }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setGtallmsgCurrentPage(currentPage => Math.max(1, GtallmsgCurrentPage - 1))}
        disabled={GtallmsgCurrentPage === 1}
      >
        <ArrowBackIcon />
      </Button>
      <TextField
        size="small"
        variant="outlined"
        type="number"
        value={GtallmsgCurrentPage}
        onChange={handleGtallmsgPageChange}
        inputProps={{
          min: 1,
          style: { textAlign: 'center' },
        }}
        sx={{ width: '80px' }} // Adjust the width as necessary
      />
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setGtallmsgCurrentPage(GtallmsgCurrentPage => GtallmsgCurrentPage + 1)}
      >
        <ArrowForwardIcon />
      </Button>
    </div>
    </Container>
  );
}

export default App;
