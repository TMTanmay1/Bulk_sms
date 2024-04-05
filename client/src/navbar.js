import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Lottie from 'react-lottie';
import bulkSmsAnimation from './resource/Animation - 1711797452832.json'; // Adjust the path as necessary

const defaultOptions = {
  loop: true,
  autoplay: true, 
  animationData: bulkSmsAnimation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const Navbar = () => {
  return (
    <AppBar position="sticky" sx={{
      background: 'linear-gradient(-45deg, #23a6d5, #23d5ab)',
      boxShadow: 'none',
      color: 'white',
      padding: '0 24px',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Lottie options={defaultOptions} height={60} width={60} />
        </Box>
        <Box display="flex" gap="16px">
          <Button component={RouterLink} to="/bulk-sms" sx={navLinkStyle}>
            Home
          </Button>
          <Button component={RouterLink} to="/bulk-sms/campaigns-info" sx={navLinkStyle}>
            List Campaigns
          </Button>
          <Button component={RouterLink} to="/bulk-sms/get-all-messages" sx={navLinkStyle}>
          List messages
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px'
  },
};

export default Navbar;
