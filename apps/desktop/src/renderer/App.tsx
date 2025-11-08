import { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testPing = async () => {
      const result = await window.electron.ping();
      setMessage(`Electron IPC test: ${result}`);
    };
    testPing();
  }, []);

  return (
    <div className="app">
      <h1>Desktop</h1>
      <p>{message}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">
        Edit src/renderer/App.tsx and save to test HMR
      </p>
    </div>
  );
}

export default App;
