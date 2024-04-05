import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Container, Form } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SendIcon from '@mui/icons-material/Send';
import './sendmessageform.css'; // Assuming your custom styles are here
import url from './resource/constants';
import { styled } from '@mui/system';


const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '8px',
  },
  '& .MuiDialogTitle-root': {
    borderBottom: '1px solid #ccc',
    marginBottom: '16px',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
    borderTop: '1px solid #ccc',
  },
}));

function App() {
  const [message, setMessage] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [greeting, setGreeting] = useState('');

  const [popupOpen, setPopupOpen] = useState(false);

  // const [popupOpen, setPopupOpen] = useState(false); 
  // const [popupMessage, setPopupMessage] = useState('');

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  // Function to close the success popup
  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  // Sample states and cities for demonstration
  const states = [
    { value: 'co', label: 'co' },
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
  ];

  const cities = {
    NY: ['New York City', 'Buffalo', 'Rochester'],
    CA: ['Los Angeles', 'San Francisco', 'San Diego'],
    co: ['Westminster'],
    FL: ['Miami', 'Orlando', 'Tampa'],
    IL: ['Chicago', 'Springfield', 'Peoria'],
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Preparing the data to be sent to the backend
    const payload = {
      Cmessage: message, // Message text
      Greeting: greeting,
      campaignName: campaignName, // Campaign name
      campaignDescription: campaignDescription, // Campaign description
      state: selectedState, // Selected state
      cities: selectedCity ? [selectedCity] : [], // Selected city (assuming single selection, adjust if multiple)
    };
  
    // Sending the prepared data to the backend
 
    const response = await fetch(`https://localhost:5000/api/send-bulk-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  
    if (response.ok) {
      console.log('Request successful');
      handlePopupOpen();
    } else {
      console.error('Request failed');
    }

    // if (response.status === 200) {
    //   // If response status code is 200
    //   setPopupMessage('Your messages have been sent successfully.');
    //   handlePopupOpen();
    // } else {
    //   // For any other response status
    //   setPopupMessage('An error occurred. Your messages could not be sent.');
    //   handlePopupOpen();
    // }

  };
  

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="custom-form-container">
        <Form onSubmit={handleSubmit}>
          {/* Campaign Name */}
          <TextField
            className="custom-text-field"
            label="Campaign Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            required
          />
          {/* Campaign Description */}
          <TextField
            className="custom-text-field"
            label="Campaign Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            required
          />
          {/* State Dropdown */}
          <TextField
            select
            className="custom-text-field"
            label="State"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedCity(''); // Reset city selection when state changes
            }}
            required
          >
            {states.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {/* City Dropdown */}
          <TextField
            select
            className="custom-text-field"
            label="City"
            variant="outlined"
            fullWidth
            margin="normal"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={!selectedState}
            required
          >
            {selectedState && cities[selectedState]?.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
          {/* Existing Fields */}
          <TextField
            className="custom-text-field"
            label="Greeting"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            required
          />

          <TextField
            className="custom-text-field"
            label="Message"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        <button className="custom-send-button" >
            Send Messages <SendIcon />
          </button>
        </Form>
      </div>

      <StyledDialog
        open={popupOpen}
        onClose={handlePopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Success!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Campaign has been created successfully.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePopupClose}>Close</Button>
        </DialogActions>
      </StyledDialog>

     
    </Container>
  );
}

export default App;
