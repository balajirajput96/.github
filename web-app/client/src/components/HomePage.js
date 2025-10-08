import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch message from API');
        }
        return response.json();
      })
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Could not connect to the server.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to the AI Assistant Platform</h1>
      <p>This is the beginning of our journey. More features coming soon!</p>
      <p style={{ marginTop: '2rem', fontStyle: 'italic', color: '#555' }}>
        {message || 'Loading message from the server...'}
      </p>
    </div>
  );
};

export default HomePage;