import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TradeMapPage = () => {
  const [mapHtml, setMapHtml] = useState('');
  const token = sessionStorage.getItem('authToken'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://'+ window.location.hostname + ':5003/visualize', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response && response.data) {
          setMapHtml(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchData();
  }, []);  

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <div>
      <button onClick={handleGoBack}>Назад</button>
      <iframe
        title="Trade Map"
        srcDoc={mapHtml}
        style={{ width: '100%', height: '100vh', border: 'none' }}
      />
    </div>
  );
};

export default TradeMapPage;
