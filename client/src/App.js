import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import CssBaseline from '@mui/material/CssBaseline'; // MUI CSS reset
import { GlobalStyles } from '@mui/styled-engine';
import './App.css';
import Sendmessageform from './sendmessageform'; // Import the component that contains your form
import CreateCampaign from './createcampaign'; // Import the component that contains your form
import Campaignsallinfo from './campaignsallinfo'; // Import the component that contains your form
import Navbar from './navbar'; // Import the component that contains your form
import Getallmessages from './getallmessages'; // Import the component that contains your form

function App() {
  return (
    <Router>
        <CssBaseline />
        <GlobalStyles styles={{
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }} />
        <Navbar />
      <Routes>
    
        <Route path="/bulk-sms" element={<CreateCampaign />} />
        <Route path="/bulk-sms/send-message" element={<Sendmessageform />} />
        <Route path="/bulk-sms/campaigns-info" element={<Campaignsallinfo />} />
        <Route path="/bulk-sms/get-all-messages" element={<Getallmessages />} />
      </Routes>
    </Router>
  );
}

export default App;