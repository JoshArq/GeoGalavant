import * as React from 'react';
import {useEffect, useRef} from "react";
import { 
  Route, 
  Routes,
  Navigate,
  useNavigate,
  useLocation
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
import EditProfile from './components/Pages/EditProfile/EditProfile.js';
import EditPayments from './components/Pages/EditPayments/EditPayments.js';
import Reserve from './components/Pages/Reserve/Reserve.js';
import EditReservation from './components/Pages/EditReservation/EditReservation.js';
import Dashboard from './components/Pages/Dashboard/Dashboard.js';
import Content from './components/Pages/Content/Content.js';
import Customers from './components/Pages/Customers/Customers.js';
import Reports from './components/Pages/Reports/Reports.js';
import Messages from './components/Pages/Messages/Messages.js';
import Gyrocars from './components/Pages/Gyrocars/Gyrocars.js';
import Employees from './components/Pages/Employees/Employees.js';
import EmpAccount from './components/Pages/EmpAccount/EmpAccount.js';
import Customer from './components/Pages/Customer/Customer.js';
import ModifyReservation from "./components/Pages/ModifyReservation/ModifyReservation.js";
import Message from './components/Pages/Message/Message.js';
import ContentDetail from './components/Pages/ContentDetail/ContentDetail.js';
import Report from './components/Pages/Report/Report.js';
import Gyrocar from './components/Pages/Gyrocar/Gyrocar.js';
import Employee from './components/Pages/Employee/Employee.js';
import './App.scss';



function App() {
  const [token, setToken] = React.useState(null);
  const [role, setRole] = React.useState(0); 
  let navigate = useNavigate();
  let location = useLocation();
  const timeoutRef = useRef(null);

  // Roles
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
    approvedCustomer: [6],
    unAuthed: [0],
  }

  // Routes where you have to be unAuthed (so we don't need to worry abt timeout)
  const exemptedRoutes = ["/login", "/apply"];

  // Login
  const saveUserData = (data) => {
    setToken(data.sessionToken);
    setRole(data.role);
  }

  // Logout
  const clearUserData = () => {
    setToken(null);
    setRole(0);
    navigate("/");
  }
  
  // Handling session timeout
  useEffect(() => {
    // If we're not logged in, don't bother w/ session timeout
    if (role == 0) return;
    const handleWindowEvents = () => {
      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        // Logout
          clearUserData()
      }, 120000);
    };

    // listen for window events to ensure the user is still active
    window.addEventListener("mousemove", handleWindowEvents);
    window.addEventListener("keydown", handleWindowEvents);
    window.addEventListener("click", handleWindowEvents);
    window.addEventListener("scroll", handleWindowEvents);

    handleWindowEvents();

    // cleanup
    return () => {
      window.removeEventListener("mousemove", handleWindowEvents);
      window.removeEventListener("keydown", handleWindowEvents);
      window.removeEventListener("click", handleWindowEvents);
      window.removeEventListener("scroll", handleWindowEvents);
    };
  }, [navigate, location.pathname]);

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
                <Account token={token} />
              </ProtectedRoute>
            }/>
            <Route path="/account/editProfile" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.customers}>
                <EditProfile token={token} />
              </ProtectedRoute>
            }/>
            <Route path="/account/editPayments" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.customers}>
                <EditPayments />
              </ProtectedRoute>
            }/>
            <Route path="reserve" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.approvedCustomer}> 
                <Reserve token={token} />
              </ProtectedRoute>
            }/>
            <Route path="reserve/edit" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.approvedCustomer}> 
                <EditReservation token={token} />
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
            <Route path="/content/contentdetail" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.sysadmin}>
                <ContentDetail />
              </ProtectedRoute>
            }/>
            <Route path="customers" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Customers token={token} />
              </ProtectedRoute>
            }/>
            <Route path="/customers/customer" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Customer token={token} />
              </ProtectedRoute>
            }/>
            <Route path="/modifyreservation/modifyreservation" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <ModifyReservation />
              </ProtectedRoute>
            }/>
            <Route path="reports/report" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.employees}>
                <Report />
              </ProtectedRoute>
            }/>
             <Route path="reports" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.employees}>
                <Reports />
              </ProtectedRoute>
            }/>
            <Route path="messages" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Messages token={token} />
              </ProtectedRoute>
            }/>
             <Route path="/messages/message" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.custserveUp}>
                <Message token={token} />
              </ProtectedRoute>
            }/>
            <Route path="gyrocars" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.mechUp}>
                <Gyrocars />
              </ProtectedRoute>
            }/>
            <Route path="/gyrocars/gyrocar" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.mechUp}>
                <Gyrocar />
              </ProtectedRoute>
            }/>
            <Route path="employees" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.admins}>
                <Employees />
              </ProtectedRoute>
            }/>
            <Route path="/employees/employee" element={
              <ProtectedRoute role={role}  clearData={clearUserData} permitted={roles.admins}>
                <Employee />
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
