import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DealPage = () => {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem('authToken'); 
  const lat = sessionStorage.getItem('lat');
  const lon = sessionStorage.getItem('lon');
  const handleFetchTrades = async () => {
    try {
      const response = await axios.get('http://'+ window.location.hostname + ':5003/trades', {
        params: {
          skip: 0,
          limit: 100
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResponse(response.data);
    } catch (error) {
      setResponse(error.response.data);
    }
  };
  const handleNearestTrades = async () => {
    try {
      const response = await axios.get('http://'+ window.location.hostname + ':5003/nearest', {
        params: {
          lat: lat,
          lon: lon
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
    
      if (response && response.data && response.data.id_trade) {
        navigate(`/deal/${response.data.id_trade}`);
      } else {
        console.error('Unexpected response format:', response);
      }
  
    } catch (error) {
      setResponse(error.response.data);
      console.error('Error fetching nearest trades:', error);
    }
  };
  

  const handleCreateDeal = () => {
    // Редирект на страницу создания сделки
    navigate('/create-deal');
  };
  const handleAddDeal = () => {
    // Редирект на страницу создания сделки
    navigate('/create-deal');
  };
  const handleViewOnMap = () => {
    navigate('/trade-map');
  };
  const renderContent = () => {
    if (response && response.length === 0) {
      return (
        <div>
          <p>На данный момент сделок нет.</p>
          <button onClick={handleCreateDeal}>Создать сделку</button>
        </div>
      );
    } else if (response) {
      return (
        <div>
          <h3>Список сделок</h3>
          {response.map((deal) => (
            <div key={deal.id}>
              <p>
                Сумма: {deal.price} {deal.currency}{' '}
                <Link to={`/deal/${deal.id}`}>Просмотреть сделку</Link>
              </p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h2>Deal Page</h2>
      <button onClick={handleFetchTrades}>Получить список сделок</button>
      <button onClick={handleNearestTrades}>Получить ближайшую сделку</button>
      <button onClick={handleViewOnMap}>Посмотреть на карте</button>
      <button onClick={handleAddDeal}>Добавить сделку</button>
      {renderContent()}
    </div>
  );
};

export default DealPage;
