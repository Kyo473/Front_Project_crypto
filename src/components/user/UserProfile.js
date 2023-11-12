import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Получение данных пользователя при загрузке страницы
    axios.get('http://localhost:5003/users/me', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
      },
    })
      .then(response => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      {userData && (
        <div>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          {/* Добавьте другие поля профиля, которые у вас есть */}
        </div>
      )}
      {/* Добавьте другие компоненты для отображения информации о заказах, статистики и т.д. */}
    </div>
  );
};

export default Profile;
