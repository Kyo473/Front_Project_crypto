import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { dealId } = useParams();
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();
  const [token] = useState(sessionStorage.getItem('authToken'));

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  const hostportDns = 'localhost:5003'; 

  const appendMessage = (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  };

  const connectToWebSocket = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    if (!dealId || !userId) {
      appendMessage('Room ID and Client ID are required.');
      return;
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      appendMessage('Already connected to a session.');
      return;
    }

    const websocket = new WebSocket(`ws://${hostportDns}/ws/${dealId}/${userId}`);
    setWs(websocket);

    websocket.onopen = async () => {
      appendMessage('Connected to the session.');
      websocket.send(JSON.stringify({ authorization: `Bearer ${token}` }));
      await getLastMessages(dealId); 
    };

    websocket.onmessage = (event) => {
      appendMessage(event.data);
    };

    websocket.onerror = () => {
      appendMessage('Connection error.');
    };
  };

  const sendMessage = (event) => {
    event.preventDefault();

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      appendMessage('Connection not found. Please connect first.');
      return;
    }

    const messageText = document.getElementById('messageText');
    const message = messageText.value.trim();

    if (!message) {
      appendMessage('Message cannot be empty.');
    } else {
      ws.send(message);
      messageText.value = '';
    }
  };

  const getLastMessages = async (dealId) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        const url = `http://${hostportDns}/last_messages/${dealId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const messages = await response.json();
  
        appendMessage('Previous messages:');
        messages.forEach((msg) => {
          appendMessage(msg.message);
        });
        appendMessage('New messages:');
      } catch (error) {
        console.error('Error fetching last messages:', error);
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center">
      <h1>WebSocket Chat</h1>
      <h2>Your ID: <span id="ws-id"></span></h2>
      <form onSubmit={sendMessage}>
        <input
          className="bg-green-300"
          type="text"
          id="messageText"
          autoComplete="off"
          placeholder="Msg"
        />
        <button
          type="button"
          onClick={() => {
            connectToWebSocket();
          }}
        >
          Connect
        </button>
        <button type="submit">Send</button>
        <button
          type="button"
          onClick={() => {
            getLastMessages(dealId);
          }}
        >
          Get Last Messages
        </button>
      </form>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChatPage;
