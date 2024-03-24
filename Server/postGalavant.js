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
async function createUser(obj){
//create user, customer, usr-role, 

  const username = obj.username
  const password = obj.password
  const email = obj.email
  const appliedBefore = obj.appliedBefore
  const driversLicense = obj.driversLicense
  const firstName = driversLicense.firstName
  const lastName = driversLicense.lastName


  var query = {
    name: 'insertUser',
    text: "INSERT INTO Users (Username, Password, FirstName, LastName, Email, Address, City, Zipcode, StateProvinceID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING UserID",
    values: [username, password, firstName, lastName, email, "TBD", "TBD", "TBD", 1]
  }

  
  try{
    var userID = (await pool.query(query)).rows[0].userid
    return userID
  }
  catch (err){
    return -1
  }


}

async function updateUser(obj){
  const query = {
    text: "UPDATE Users SET Username = $1, Password = $2, FirstName = $3, LastName = $4, Email = $5, Address = $6, ZipCode = $7, City = $8, StateProvinceID = $9 WHERE UserID = $10",
    values: [obj.username, obj.password, obj.firstName, obj.lastName, obj.email, obj.address, obj.zipcode, obj.stateProvinceID, obj.userId]
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
    text: "INSERT INTO User_Role (UserID, RoleID) VALUES ($1, $2)",
    values: [userID, userRole]
  }

  try{
    var roleID = (await pool.query(query))
    console.log(roleID)
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
    var userStatusId= (await pool.query(query))
    console.log(userStatusId)
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
    var rowsEffected = (await pool.query(query))
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

  const res = await pool.query(query);
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

module.exports = {pulseCheck, createUser, updateUser, getUserByName, getUserById, getAllUsers, deleteUser, addUserRole, deleteUserRole, addUserStatus, removeUserStatus, getUserPerms, login}