import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MapComponent from './Map';

const CreateDealPage = () => {
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('BTC');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const navigate = useNavigate();

  const token = sessionStorage.getItem('authToken'); // Получаем токен из session storage
  const userID = sessionStorage.getItem('userId'); // Получаем токен из session storage

  const handleCreateDeal = async () => {
    try {
      const requestBody = {
        price,
        currency,
        description,
        created_at: new Date().toISOString(),
        lat,
        lon,
        seller_id: userID, // Extract seller ID from the token
        hide: 'Create',
      };
  
      const response = await axios.post('http://localhost:5003/trade', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Deal created successfully:', response.data);
  
      // Redirect to the deal page after successful creation
      navigate('/deal');
    } catch (error) {
      console.error('Failed to create deal:', error);
    }
  };
  
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h2>Create Deal</h2>
        <MapComponent setLat={setLat} setLon={setLon} />
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <form>
          <label>
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <br />
          <label>
            Currency:
            <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </label>
          <br />
          <label>
            Description:
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <br />
          <label>
            Latitude (lat):
            <input type="number" value={lat} onChange={(e) => setLat(e.target.value)} />
          </label>
          <br />
          <label>
            Longitude (lon):
            <input type="number" value={lon} onChange={(e) => setLon(e.target.value)} />
          </label>
          <br />
          <button type="button" onClick={handleCreateDeal}>
            Create Deal
          </button>
          <Link to="/deal">
            <button style={{ marginRight: '10px' }}>Back to Deals</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CreateDealPage;