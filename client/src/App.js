import React from "react";
import { 
  Route, 
  Routes,
  Navigate,
  useNavigate
} from 'react-router-dom';
import GeoNav from './components/GeoNav/GeoNav.js';
import EmpNav from './components/EmpNav/EmpNav.js';
import GeoFooter from './components/GeoFooter/GeoFooter.js';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Home from './components/Pages/Home/Home.js';
import About from './components/Pages/About/About.js';
import Contact from './components/Pages/Contact/Contact.js';
import Login from './components/Pages/Login/Login.js';
import Apply from './components/Pages/Apply/Apply.js';
import Account from './components/Pages/Account/Account.js';
import Dashboard from './components/Pages/Dashboard/Dashboard.js';
import Content from './components/Pages/Content/Content.js';
import Customers from './components/Pages/Customers/Customers.js';
import Reports from './components/Pages/Reports/Reports.js';
import Messages from './components/Pages/Messages/Messages.js';
import Gyrocars from './components/Pages/Gyrocars/Gyrocars.js';
import Employees from './components/Pages/Employees/Employees.js';
import EmpAccount from './components/Pages/EmpAccount/EmpAccount.js';
import Customer from './components/Pages/Customer/Customer.js';
import './App.scss';


function App() {
  const [data, setData] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [role, setRole] = React.useState(0); 
  let navigate = useNavigate();

  // 1 - sysadmin
  // 2 - biz admin
  // 3 - manager
  // 4 - mech
  // 5 - customer service
  // 6 - customer
  // 7 - user (unapproved customer)

  // Named roles / arrays for roles so I can more easily determine access
  // prob. not the best way to do this but it works
  const roles = {
    admins: [1, 2],
    sysadmin: [1],
    managerUp: [1, 2, 3],
    custserveUp: [1, 2, 3, 5],
    mechUp: [1, 2, 3, 4],
    employees: [1, 2, 3, 4, 5], 
    customers: [6, 7],
    unAuthed: [0],
  }
  

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
    setRole(0);
    navigate("/");
  }

  return (
    <div className="App">
      <GeoNav role={role} roles={roles} clearData={clearUserData} />
      <Row className="no-gutters m-0">
        {roles.employees.includes(role) ? <EmpNav role={role} roles={roles} clearData={clearUserData} /> : ''}
        <Col md={roles.employees.includes(role) ? 10 : 12} className="p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.unAuthed}>
                <Login saveData={saveUserData} customers={roles.customers} />
              </ProtectedRoute>} />
            <Route path="apply" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.unAuthed}>
                <Apply />
              </ProtectedRoute>} />
            <Route path="account" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.customers}>
                <Account />
              </ProtectedRoute>
            }/>
            <Route path="dashboard" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.managerUp}>
                <Dashboard />
              </ProtectedRoute>
            }/>
            <Route path="content" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.sysadmin}>
                <Content />
              </ProtectedRoute>
            }/>
            <Route path="customers" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Customers />
              </ProtectedRoute>
            }/>
            <Route path="/customers/customer" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Customer />
              </ProtectedRoute>
            }/>
            <Route path="reports" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.employees}>
                <Reports />
              </ProtectedRoute>
            }/>
            <Route path="messages" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Messages />
              </ProtectedRoute>
            }/>
            <Route path="gyrocars" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.mechUp}>
                <Gyrocars />
              </ProtectedRoute>
            }/>
            <Route path="employees" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.admins}>
                <Employees />
              </ProtectedRoute>
            }/>
            <Route path="/employee/account" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.employees}>
                <EmpAccount />
              </ProtectedRoute>
            }/>
          </Routes>
        </Col>
      </Row>
      { roles.employees.includes(role) ? '' : <GeoFooter /> }
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
