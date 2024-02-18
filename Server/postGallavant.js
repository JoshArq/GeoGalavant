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

  var sql = "INSERT INTO Users (UserID, Username, Password, FirstName, LastName, Email, Address, ZipCode, City, StateProvinceID) VALUES (???????)"
  await pool.query('')
}

async function login(username, password){

  const query = {
    name: 'login',
    text: "SELECT * FROM Users WHERE Username = $1 AND Password = $2",
    values: [username, password],
  }

  const result = (await pool.query(query)).rows

  console.log(result)

  if(result.length == 0){
    return  {
      success: false,
      errorMessage: "Invalid username/password combination." 
    };
    
  } else {
    return {
      success: true,
      sessionToken: "to_be_implemented"
    };
  }
}

module.exports = {pulseCheck, createCustomer, login}