import React from "react";
import './App.scss';
import GeoNav from './components/GeoNav/GeoNav.js'

function App() {
  const [data, setData] = React.useState(null);

  // Test data call to check server connected
  // TODO: delete
  React.useEffect(() => {
    fetch("/test")
      .then((res) => res.json())
      .then((data) => {
          setData(data.result)
          console.log(data)
      }).catch(error => {
        console.log("Error. Server down.")
      });
  }, []);

  return (
    <div className="App">
      <GeoNav />
      <header className="App-header">
        <p>
          Test
        </p>
      </header>
    </div>
  );
}

export default App;
