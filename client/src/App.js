import React from "react";
import { 
  Route, 
  Routes,
  Navigate
} from 'react-router-dom';
import GeoNav from './components/GeoNav/GeoNav.js';
import GeoFooter from './components/GeoFooter/GeoFooter.js';
import Home from './components/Pages/Home/Home.js';
import About from './components/Pages/About/About.js';
import Contact from './components/Pages/Contact/Contact.js';
import Login from './components/Pages/Login/Login.js';
import Apply from './components/Pages/Apply/Apply.js';
import Account from './components/Pages/Account/Account.js';
import Reserve from './components/Pages/Reserve/Reserve.js';
import './App.scss';

function App() {
  const [data, setData] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [role, setRole] = React.useState(null); // 1 admin 2 user 3 mech 4 cust 5 cust serve

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

  const saveUserData = (data) => {
    setToken(data.sessionToken);
    setRole(data.role);
  }

  const clearUserData = () => {
    setToken(null);
    setRole(null);
  }

  return (
    <div className="App">
      <GeoNav role={role} clearData={clearUserData} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={
            <ProtectedRoute role={role}  clearData={clearUserData} permitted={[null]}>
              <Login saveData={saveUserData} />
            </ProtectedRoute>} />
          <Route path="apply" element={
            <ProtectedRoute role={role}  clearData={clearUserData} permitted={[null]}>
              <Apply />
            </ProtectedRoute>} />
          <Route path="account" element={
            <ProtectedRoute role={role}  clearData={clearUserData} permitted={[2,4]}>
              <Account />
            </ProtectedRoute>
          }/>
          <Route path="reserve" element={
            <ProtectedRoute role={role}  clearData={clearUserData} permitted={[2,4]}> {/*TODO: remove 2 from this */}
              <Reserve />
            </ProtectedRoute>
          }/>
        </Routes>
      <GeoFooter />
    </div>
  );
}

const ProtectedRoute = ({role, permitted, clearData, children}) => {
  // If the user's role isn't in the list of permitted roles, redirect to login
  if (!permitted.includes(role)) {
    // Check if it's supposed to be a no-account page (like Login or Apply). If so, log out the user.
    if(permitted.includes(null)) {
      clearData();
      // Go to request page
      return children;
    }
    // Go to login
    return <Navigate to="/login" replace />
  }
  // Otherwise, proceed
  return children;
}

export default App;
