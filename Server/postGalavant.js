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



async function createCustomer(obj){
//create user, customer, usr-role, 

  const username = obj.username
  const password = obj.password
  const email = obj.email
  const appliedBefore = obj.appliedBefore
  const driversLicense = obj.driversLicense

  console.log(username)

  var query = {
    name: 'createCustomer',
    text: "INSERT INTO Users (Username, Password, FirstName, LastName, Email, StateProvinceID) VALUES ($1, $2, $3, $4, $5, $6)",
    values: [username, password, driversLicense.firstname, driversLicense.firstname, email, driversLicense.state,]
  }

  await pool.query(query);
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
      sessionToken: "to_be_implemented",
      role: role[0].roleid
    };
  }
}

module.exports = {pulseCheck, createCustomer, login}