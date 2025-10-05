import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * The main application component.
 *
 * This component renders the main user interface, including a header, a link
 * to the React documentation, and a message fetched from the backend server.
 *
 * On mount, it uses the `useEffect` hook to make an API call to `/api/hello`.
 * The response message is then stored in the component's state using `useState`
 * and displayed to the user.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  // 'message' holds the string received from the server, or an error message.
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch message');
        }
        return response.json();
      })
      .then(data => setMessage(data.message))
      .catch(error => setMessage(error.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
