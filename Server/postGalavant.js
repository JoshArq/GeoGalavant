//This file functions as the GeoGallavant Team's custom Data Layer for our PostgreSQL DB

require('dotenv').config()
const { Pool } = require('pg')

//To set up your PostgreSQL connection:
// default user: postgres
// default host: localhost
// password should have been setup on installation
// default db: postgres
// default port: 5432

const PGUSER = process.env.PGUSER
const PGHOST = process.env.PGHOST
const PGPASSWORD = process.env.PGPASSWORD
const PGDATABASE = process.env.PGDATABASE
const PGPORT = process.env.PGPORT

const pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT
  })
 
async function pulseCheck(){
  console.log(await pool.query('SELECT NOW()'))
}


//returns -1 on failure, return userID on success
async function addUser(obj){
//create user, customer, usr-role, 

  const username = obj.username
  const password = obj.password
  const email = obj.email
  const driversLicense = obj.driversLicense
  const firstName = driversLicense.firstName
  const lastName = driversLicense.lastName


  var query = {
    name: 'insertUser',
    text: "INSERT INTO Users (Username, Password, FirstName, LastName, Email, Address, City, Zipcode, StateProvinceID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING UserID",
    values: [username, password, firstName, lastName, email, "TBD", "TBD", "TBD", 1]
  }

  
  try{
    var result = await pool.query(query)
    var userID = result.rows[0].userid
    return userID
  }
  catch (err){
    console.log(err)
    return -1
  }
}



async function addCustomer(userID, obj){
  var licenseID = obj.driversLicense.ID
  var licenseExpy = obj.driversLicense. expirationDate
  var state = obj.driversLicense.state
  var appliedBefore = false
  //var appliedBefore = obj.appliedBefore
  var agreed = obj.tos

  console.log(state)
  
  var query = {
    text: "SELECT * from StateProvince WHERE StateProvinceName = $1",
    values: [state]
  };

  const res = await pool.query(query);
  const stateCode = res.rows[0].stateprovinceid

  query = {
    text: "INSERT INTO Customer (LicenseNumber, LicenseExpires, StateProvinceID, UserID, HasAppliedBefore, HasAgreedToTerms) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [licenseID, licenseExpy, stateCode, userID, appliedBefore, agreed]
  };

  const res2 = await pool.query(query);

  return res2.rowCount


}


async function updateUser(obj){
  const query = {
    text: "UPDATE Users SET Username = $1, Password = $2, FirstName = $3, LastName = $4, Email = $5, Address = $6, ZipCode = $7, City = $8, StateProvinceID = $9 WHERE UserID = $10",
    values: [obj.username, obj.password, obj.firstName, obj.lastName, obj.email, obj.address, obj.zipcode, obj.city, obj.stateProvinceID, obj.userId]
  };

  const res = await pool.query(query);
  return res.rowCount;
}

async function deleteUser(userId){
  const query = {
    text: "DELETE FROM Users WHERE UserID = $1",
    values: [userId]
  };

  const res = await pool.query(query);
  return res.rowCount;
}

async function getUserByName(username){
  const query = {
    text: "SELECT * FROM Users WHERE Username = $1",
    values: [username]
  };

  const res = await pool.query(query);
  return res.rows[0];
}

async function getUserById(userId){
  const query = {
    text: "SELECT * FROM Users WHERE UserID = $1",
    values: [userId]
  };

  const res = await pool.query(query);
  return res.rows[0];
}



async function getCustomerByUserId(userID){
  const query = {
    text: "SELECT Customer.*, StateProvince.StateProvinceName FROM Customer LEFT JOIN Users ON Users.UserID = Customer.UserID LEFT JOIN StateProvince ON Customer.StateProvinceID = StateProvince.StateProvinceID WHERE Users.UserID = $1",
    values: [userID]
  };

  const res = await pool.query(query);
  return res.rows[0];

}


async function updateCustomer(obj){
  var query = {
    text: "SELECT * from StateProvince WHERE StateProvinceName = $1",
    values: [obj.state]
  };

  const res = await pool.query(query);
  const stateCode = res.rows[0].stateprovinceid
  
  query = {
    text: "UPDATE Customer SET LicenseNumber = $1, LicenseExpires = $2, StateProvinceID = $3 WHERE UserID = $4",
    values: [obj.licenseNumber, obj.licenseExpy, stateCode, obj.userId]
  };

  const res2 = await pool.query(query);
  return res2.rowCount;

}

async function getAllUsers(){
  const query = {
    text: "SELECT * FROM Users",
    values: [userId]
  };

  const res = await pool.query(query);
  return res.rows[0];
}

async function addUserRole(userID, userRole){

  query = {
    name: 'insertUserRole',
    text: "INSERT INTO User_Role (UserID, RoleID) VALUES ($1, $2) RETURNING RoleID",
    values: [userID, userRole]
  }

  try{
    var query = await pool.query(query)
    var roleID = query.rows[0].roleid
    return roleID;
  }
  catch (err){
    console.log(err);
    return -1
  }

}

async function deleteUserRole(userID, roleID){
  query = {
    text: "DELETE FROM User_Role WHERE UserID = $1 AND RoleID = $2",
    values: [userID, roleID]
  }

  try{
    var rowsEffected = (await pool.query(query))
    return rowsEffected;
  }
  catch(err){
    return -1;
  }
}

async function addUserStatus(userId, statusId, reasonApplied){
  query = {
    text: "INSERT INTO User_Status (UserID, StatusID, ReasonApplied) VALUES ($1, $2, $3) RETURNING UserStatusID",
    values: [userId, statusId, reasonApplied]
  }

  try{
    var userStatusId= (await pool.query(query)).rows[0].userstatusid
    return userStatusId;
  }
  catch (err){
    return -1
  }
}

async function removeUserStatus(reasonRemoved, userStatusID){
  query = {
    text: `UPDATE User_Status SET CurrentStatus = FALSE, StatusChange = (to_timestamp(${Date.now()} / 1000.0)), ReasonRemoved = $1 WHERE UserStatusID = $2`,
    values: [reasonRemoved, userStatusID]
  }

  try{
    var rowsEffected = (await pool.query(query)).rowCount
    return rowsEffected;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getUserPerms(userId){
  var query = {
    text: "SELECT Description FROM User_Permissions WHERE UserID = $1",
    values: [userId]
  };

  const res = (await pool.query(query));
  return res.rows;
}


async function login(username, password){

  var query = {
    name: 'login',
    text: "SELECT * FROM Users WHERE Username = $1 AND Password = $2",
    values: [username, password],
  }

  const result = (await pool.query(query)).rows

  if(result.length == 0){
    return  {
      success: false,
      errorMessage: "Invalid username/password combination." 
    }; 
  } else {
    const query = {
      name: 'login_role',
      text: "SELECT RoleID FROM User_Role LEFT JOIN Users ON User_Role.UserID = Users.UserID WHERE Users.UserID = $1",
      values: [result[0].userid],
    }

    var role = (await pool.query(query)).rows

    if(role.length == 0){
      return  {
        success: false,
        errorMessage: "User has no role assigned." 
      }; 
    }

    return {
      success: true,
      userID: result[0].userid,
      role: role[0].roleid
    };
  }
}

async function getAllStations(){
  var query ={
    text: "SELECT * FROM Station"
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getStation(id){
  var query = {
    text: "SELECT * FROM Station WHERE StationID = $1",
    values: [id]
  };
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addStation(obj){
  var query = {
    text: "INSERT INTO Station (MinLatitude, MaxLatitude, MinLongitude, MaxLongitude, StationName, Address, IsClosed) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING StationID",
    values: [obj.latitude, obj.latitude, obj.longitude, obj.longitude, obj.stationName, obj.address, obj.isClosed]
  }
  try{
    return (await pool.query(query)).rows[0].stationid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}


async function getCustomerReservations(customerId){
  var query ={
    text: "SELECT * FROM Rental WHERE CustomerID = $1",
    values: [customerId]
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getReservation(rentalId){
  var query ={
    text: "SELECT * FROM Rental WHERE RentalID = $1",
    values: [rentalId]
  };
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addReservation(obj){
  var query ={
    text: "INSERT INTO Rental (CustomerID, PickupStationID, ConfirmationNumber, DropoffStationID, ScheduledPickupTime, ScheduledDropoffTime, Rate, Fees, CardID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING RentalID",
    values: [obj.customerId, obj.pickupStationId, obj.confirmationNumber, obj.dropoffStationId, obj.scheduledPickupTime, obj.scheduledDropoffTime, obj.rate, obj.fees, obj.cardId]
  };
  try{
    return (await pool.query(query)).rows[0].rentalid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function updateReservation(obj){
  var query ={
    text: "UPDATE Rental SET CustomerID = $1, PickupStationID=$2, ScheduledPickupTime=$3, ScheduledDropoffTime=$4, Rate=$5, Fees=$6, CardID=$7, CarID=$8, PickupTime=$9, DropoffTime=$10, ConfirmationNumber=11 WHERE RentalID = $12",
    values: [obj.customerId, obj.pickupStationId, obj.scheduledPickupTime, obj.scheduledDropoffTime, obj.rate, obj.fees, obj.cardId, obj.carId, obj.pickupTime, obj.dropoffTime, obj.confirmationNumber, obj.rentalId]
  };
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function removeReservation(rentalId){
  var query ={
    text: "DELETE FROM Rental WHERE RentalID = $1",
    values: [rentalId]
  };
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCreditCardsByCustomer(custId){
  var query = {
    text: "SELECT * FROM Card WHERE CustomerID = $1",
    values: [custId]
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCreditCard(cardId){
  var query = {
    text: "SELECT * FROM Card WHERE CardID = $1",
    values: [cardId]
  };
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function removeCreditCard(cardId){
  var query = {
    text: "DELETE FROM Card WHERE CardID = $1",
    values: [cardId]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function editCreditCard(obj){
  var query = {
    text: "UPDATE Card SET PaymentTypeID=$1, CardName=$2, CardNumber=$3, ExpirationDate=$4, CVV=$5 WHERE CardID=$6",
    values: [obj.paymentTypeId, obj.cardName, obj.cardNumber, obj.expirationDate, obj.cvv, obj.cardId]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addCreditCard(obj){
  var query = {
    text: "INSERT INTO Card (PaymentTypeID, CardName, CardNumber, ExpirationDate, CVV, CustomerID) VALUES ($1,$2,$3,$4,$5,$6) RETURNING CardID",
    values: [obj.paymentTypeId, obj.cardName, obj.cardNumber, obj.expirationDate, obj.cvv, obj.customerId]
  }
  try{
    return (await pool.query(query)).rows[0].cardid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getStationCars(stationId){
  var query = {
    text: "SELECT * FROM Car WHERE stationId = $1",
    values: [stationId]
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCarsByStatus(statusId){
  var query = {
    text: "SELECT * FROM Car WHERE CarStatusID = $1",
    values: [statusId]
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getAllCars(){
  var query = {
    text: "SELECT Car.CarID, CarStatus.Name AS status, Station.StationName FROM Car JOIN Station ON Car.StationID = Station.StationID JOIN CarStatus ON Car.CarStatusID = CarStatus.StatusID",
  };
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCar(carId){
  var query = {
    text: "SELECT Car.CarID, CarStatus.StatusID, CarStatus.name AS statusname, Station.StationID, Station.StationName, Station.IsClosed AS stationclosed, Station.Address AS stationaddress FROM Car JOIN Station ON Car.StationID = Station.StationID JOIN CarStatus ON Car.CarStatusID = CarStatus.StatusID WHERE CarID = $1",
    values: [carId]
  };
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function editCar(obj){
  var query = {
    text: "UPDATE Car SET StationID=$1, CarStatusID=$2 WHERE CarID=$3",
    values: [obj.stationId, obj.carStatusId, obj.carId]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function removeCar(carId){
  var query = {
    text: "DELETE FROM Car WHERE CarID = $1",
    values: [carId]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addCar(obj){
  var query = {
    text: "INSERT INTO Car (StationID, CarStatusID) VALUES ($1,$2) RETURNING CarID",
    values: [obj.stationId, obj.carStatusId]
  }
  try{
    return (await pool.query(query)).rows[0].carid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCarLocations(carId){
  var query = {
    text: "SELECT * FROM CarTracking WHERE CarId = $1",
    values: [carId]
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCurrentCarLocation(carId){
  var query = {
    text: "SELECT DISTINCT ON (CarID) * FROM CarTracking WHERE CarID = $1 ORDER BY CarID, Time",
    values: [carId]
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCurrentLocations(){
  var query = {
    text: "SELECT ct.CarID, ct.Time, ct.Latitude, ct.Longitude FROM CarTracking ct, (SELECT CarID, MAX(Time) AS maxTime FROM CarTracking GROUP BY CarID) ct2 WHERE ct.CarID = ct2.CarID AND ct.Time = ct2.maxTime",
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addCarLocation(obj){
  var query = {
    name: 'insertCarLocation',
    text: "INSERT INTO CarTracking (CarID, Time, Latitude, Longitude) VALUES ($1,$2,$3,$4)",
    values: [obj.carId, obj.time, obj.latitude, obj.longitude]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function removeCarLocationsBefore(time){
  var query = {
    text: "DELETE FROM CarTracking WHERE Time < $1",
    values: [time]
  }
  try{
    return (await pool.query(query)).rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addTicket(obj){
  var query = {
    text: "INSERT INTO TICKET (Name, Phone, Email, Comment) VALUES ($1, $2, $3, $4) RETURNING TicketID",
    values: [obj.name, obj.phone, obj.email, obj.comment]
  }
  try{
    return (await pool.query(query)).rows[0].ticketid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function updateTicket(obj){
  var query = {
    text: "UPDATE Ticket SET Name = $1, Phone = $2, Email = $3, Comment = $4, IsOpen = $5, ClosedBy = $6, Submitted = $7 WHERE TicketID = $8",
    values: [obj.name, obj.phone, obj.email, obj.comment, obj.isOpen, obj.closedBy, obj.submitted, obj.ticketId]
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getAllTickets(){
  var query = {
    text: "SELECT * FROM Ticket"
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getTicket(ticketId){
  var query = {
    text: "SELECT * FROM Ticket WHERE TicketID = $1",
    values: [ticketId]
  }
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getAllCustomers(){
  var query = {
    text: "SELECT Users.FirstName, Users.LastName, Users.Email, AccountStatus.StatusName, Customer.CustomerID FROM Customer JOIN Users ON Customer.UserID = Users.UserID JOIN User_Status ON Users.UserID = User_Status.UserID JOIN AccountStatus ON User_Status.StatusID = AccountStatus.StatusID ORDER BY AccountStatus.StatusID"
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getCustomerDetails(id){
  var query = {
    text: "SELECT Users.UserID, Users.Username, Users.FirstName, Users.LastName, Users.Email, AccountStatus.StatusName, Customer.CustomerID, Customer.LicenseExpires, Customer.LicenseNumber FROM Customer JOIN Users ON Customer.UserID = Users.UserID JOIN User_Status ON Users.UserID = User_Status.UserID JOIN AccountStatus ON User_Status.StatusID = AccountStatus.StatusID WHERE CustomerID = $1",
    values: [id]
  }
  try{
    return (await pool.query(query)).rows[0];
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getMaintenance(){
  var query = {
    text: "SELECT * FROM Maintenance"
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addMaintenance(obj){
  var query = {
    text: "INSERT INTO Maintenance (MaintenanceStart, HasDamage, ServicePerformed, MaintenanceLocation, Mechanic, Car) VALUES ($1,$2,$3,$4,$5,$6) RETURNING MaintenanceID",
    values: [obj.maintenanceStart, obj.hasDamage, obj.servicePerformed, obj.stationId, obj.mechanic, obj.carId]
  }
  try{
    return (await pool.query(query)).rows[0].maintenanceid;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getAllEmployees(){
  var query = {
    text: "SELECT Employee.EmpID, Employee.Status, Users.FirstName, Users.LastName, FIRST_VALUE(Roles.Title) OVER w FROM Employee JOIN Users ON Users.UserID = Employee.EmpID JOIN User_Role ON Users.UserID = User_Role.UserID JOIN Roles ON User_Role.RoleID = Roles.RoleID WINDOW w AS (PARTITION BY EmpID ORDER BY Roles.RoleID DESC)"
  }
  try{
    return (await pool.query(query)).rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}
async function getEmployee(obj){
  var query = {
    text: "SELECT Employee.EmpID, Employee.Status, Users.FirstName, Users.LastName, Roles.Title FROM Employee JOIN Users ON Users.UserID = Employee.EmpID JOIN User_Role ON Users.UserID = User_Role.UserID JOIN Roles ON User_Role.RoleID = Roles.RoleID WHERE Employee.EmpID = $1",
    values: [obj.empId]
  }
  try{
    const returnVal = await pool.query(query);
    return returnVal.rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function updateEmployeeStatus(obj){
  var query = {
    text: "UPDATE Employee SET Status = $1 WHERE EmpID = $2",
    values: [obj.status, obj.empId]
  }
  try{
    const returnVal = await pool.query(query);
    return returnVal.rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function addEmployee(status, empId){
  var query = {
    text: "INSERT INTO Employee (EmpID, Status) Values ($1,$2)",
    values: [empId, status]
  }
  try{
    const returnVal = await pool.query(query);
    return returnVal.rowCount;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}

async function getStateProvince(){
  var query = {
    text: "SELECT * FROM StateProvince"  
  }
  try{
    const returnVal = await pool.query(query);
    return returnVal.rows;
  }
  catch(err){
    console.log(err);
    return -1;
  }
}


module.exports = {
  pulseCheck, 
  addUser, 
  updateUser, 
  getUserByName, 
  getUserById, 
  getAllUsers, 
  deleteUser, 
  addUserRole, 
  deleteUserRole, 
  addUserStatus, 
  removeUserStatus, 
  getUserPerms, 
  login, 
  addCustomer, 
  getCustomerByUserId, 
  updateCustomer, 
  getAllStations, 
  getStation,
  addStation,
  getCustomerReservations, 
  getReservation, 
  updateReservation, 
  addReservation, 
  removeReservation, 
  getCreditCardsByCustomer, 
  getCreditCard, 
  addCreditCard, 
  removeCreditCard, 
  editCreditCard, 
  getStationCars, 
  getAllCars, 
  getCar, 
  editCar, 
  removeCar, 
  addCar, 
  getCarsByStatus,
  getCurrentCarLocation,
  getCarLocations,
  getCurrentLocations,
  addCarLocation,
  removeCarLocationsBefore,
  addTicket,
  updateTicket,
  getAllTickets,
  getTicket,
  getAllCustomers,
  getCustomerDetails,
  getMaintenance,
  addMaintenance,
  getAllEmployees,
  getEmployee,
  updateEmployeeStatus,
  addEmployee,
  getStateProvince
}
