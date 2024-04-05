import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './campaignsallinfo.css';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import url from './resource/constants';


import TextField from '@mui/material/TextField';

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterState, setFilterState] = useState('');
  const [filterCity, setFilterCity] = useState('');

  useEffect(() => {
    fetch(`https://localhost:5000/api/campaigns/${currentPage}`) // Adjust URL as necessary
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCampaigns(data.data); // Assuming the backend returns an object with a 'data' array
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [currentPage]);
  const handlePageChange = (event) => {
    const page = parseInt(event.target.value, 10);
    if (page > 0) { // Add additional checks as needed (e.g., maximum page number)
      setCurrentPage(page);
    }
  };
console.log(campaigns.count);
  return (
    <Container className="d-flex flex-column align-items-center" style={{ minHeight: "100vh", marginTop: "20px" }}>
      <h2 className="mb-1 fw-bold">Campaigns List</h2>
      
      {/* Filters container with enhanced styling for visibility */}
      <div className="mb-4" style={{ width: '100%', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,.1)' }}>
        <div className="filter-input-container d-flex justify-content-around">
          <div className="filter-input">
            <i className="bi bi-search filter-input-icon"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Filter by State"
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
              style={{ maxWidth: '200px' }} // Ensure inputs do not stretch too wide on larger screens
            />
          </div>
          <div className="filter-input">
            <i className="bi bi-search filter-input-icon"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Filter by City"
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              style={{ maxWidth: '200px' }} // Consistent styling with state filter
            />
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="table-responsivec" style={{ width: '100%' }}>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Message</th>
            <th>City</th>
            <th>State</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.filter(campaign =>
            (!filterState || campaign.state.toLowerCase().includes(filterState.toLowerCase())) &&
            (!filterCity || campaign.city.toLowerCase().includes(filterCity.toLowerCase()))
          ).map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.id}</td>
              <td>{campaign.title}</td>
              <td>{campaign.description}</td>
              <td>{campaign.startDate}</td>
              <td>{campaign.endDate}</td>
              <td>{campaign.message}</td>
              <td>{campaign.city}</td>
              <td>{campaign.state}</td>
              <td>{campaign.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <div className='campaignallinfobut' style={{ display: 'flex',  gap: '10px', marginTop: '20px' }}>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => setCurrentPage(currentPage => Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ArrowBackIcon />
      </Button>
      <TextField
        size="small"
        variant="outlined"
        type="number"
        value={currentPage}
        onChange={handlePageChange}
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
        onClick={() => setCurrentPage(currentPage => currentPage + 1)}
      >
        <ArrowForwardIcon />
      </Button>
    </div>
    </Container>
  );
}

export default CampaignsPage;
