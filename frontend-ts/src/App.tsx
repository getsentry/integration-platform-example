import React from 'react';
import './App.css';
// TS hints also work
import {Example} from '../../data/types';

function App() {
  // Editor linting works
  // console.log('Testing');
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
