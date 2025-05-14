import { useEffect, useState } from 'react';

function App() {
  // const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/data')
      .then((res) => res.json())
      // .then((data) => setMessage(data.msg))
      .then((data) => {
        console.log('Data from API:', data);
        // setMessage(data.msg);
      })
      .catch((err) => console.error('API error:', err));
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl">Ping Response:</h1>
      {/* <p>{message || 'Loading...'}</p> */}
    </div>
  );
}

export default App;
