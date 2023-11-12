import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DealPage = () => {
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const token = sessionStorage.getItem('authToken'); // Получаем токен из session storage
  const lat = sessionStorage.getItem('lat');
  const lon = sessionStorage.getItem('lon');
  // GET request to fetch a list of trades with authorization header
  const handleFetchTrades = async () => {
    try {
      const response = await axios.get('http://localhost:5003/trades', {
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
      const response = await axios.get('http://localhost:5003/nearest', {
        params: {
          lat: lat,
          lon: lon
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Проверяем, что response существует и не равен null
      if (response && response.data && response.data.id_trade) {
        navigate(`/deal/${response.data.id_trade}`);
      } else {
        // Если response не содержит ожидаемых данных, обработайте этот случай
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
      <button onClick={handleAddDeal}>Добавить сделку</button>
      {renderContent()}
    </div>
  );
};

export default DealPage;
