import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DealDetailsPage = () => {
  const { dealId } = useParams();
  const [dealDetails, setDealDetails] = useState(null);
  const token = sessionStorage.getItem('authToken'); 

  useEffect(() => {
    const fetchDealDetails = async () => {
      try {
        const response = await axios.get('http://'+ window.location.hostname + `:5003/trades/${dealId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setDealDetails(response.data);
      } catch (error) {
        console.error('Failed to fetch deal details:', error);
      }
    };

    fetchDealDetails();
  }, [dealId, token]);

  return (
    <div>
      <h2>Deal Details</h2>
      {dealDetails ? (
        <div>
          <p>Deal ID: {dealDetails.id}</p>
          <p>Price: {dealDetails.price}</p>
          <p>Currency: {dealDetails.currency}</p>
          <p>Description: {dealDetails.description}</p>
          {/* Другие свойства сделки, которые вы хотите отобразить */}
        </div>
      ) : (
        <p>Loading deal details...</p>
      )}

    
      <Link to="/deal">
        <button style={{ marginRight: '10px' }}>Back to Deals</button>
      </Link>

    
      <Link to={`/deal/${dealId}/chat-page`}>
        <button>Chat</button>
      </Link>
    </div>
  );
};

export default DealDetailsPage;
