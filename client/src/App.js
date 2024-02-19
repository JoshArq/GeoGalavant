import React from "react";
import { Routes, Route } from 'react-router-dom';
import GeoNav from './components/GeoNav/GeoNav.js';
import GeoFooter from './components/GeoFooter/GeoFooter.js';
import Home from './components/Pages/Home/Home.js';
import About from './components/Pages/About/About.js';
import Contact from './components/Pages/Contact/Contact.js';
import './App.scss';

function App() {
  const [data, setData] = React.useState(null);

  // Test data call to check server connected
  // TODO: delete
  React.useEffect(() => {
    fetch("/api/test")
    .then((res) => res.json())
    .then((data) => {
        setData(data.result)
        console.log(data)
    }).catch(error => {
      console.log(error)
      console.log("Error. Server down.")
    });
  }, []);

  return (
    <div className="App">
      <GeoNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
      <GeoFooter />
    </div>
  );
}

export default App;
