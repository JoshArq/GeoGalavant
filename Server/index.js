const express = require("express");
const bl = require('./businessLayer.js')
const pg = require('./postGalavant.js')
require('dotenv').config()
const bcrypt = require('bcrypt');
var cron = require('node-cron');


cron.schedule('0 21 * * *', () => {
  console.log('running a task every minute');
});


const PORT = process.env.PORT || 5001;

const app = express();
var router = express.Router()

app.use(express.json());

router.get("/test", (req, res) => {
  const token = req.headers['auth-token']
  console.log(token)

    res.json({ result: "All good!" });
});


router.get("/testToken", async (req, res) => {
  
  const token = req.headers['auth-token']
  console.log(token)
  // const token = req.body.token

  var data = await decodeToken(token)

  
  res.json({ data});
});


router.get("/getStateProvince", async (req,res)=>{
  const token = req.headers['auth-token']

  var userAuth = await decodeToken(token)
  const returnData = await bl.getStateProvince(userAuth);
  res.json(returnData);
});

//TODO needs address fix after GR#2
router.post("/createCustomer", async (req, res) => {
  
  var data = req.body;

  var custID = await pg.addUser(data)

  if(custID == -1){
    console.log("In if custID == -1")
    res.json({
      success: false,
      errorMessage: "Could not create user." 
    }); 
    return;
  }

  const unapproved_customer_role_ID = 7

  var roleID = await pg.addUserRole(custID, unapproved_customer_role_ID)

  if(roleID == -1){
    res.json({
      success: false,
      errorMessage: "User cannot be assigned role." 
    }); 
    return;
  }

  var stripeCust = await bl.addStripeCustomer(data.creditCard.fullName)
  data.stripeCust = stripeCust.id 

  custSuccess = await pg.addCustomer(custID, data)
  var statusID = await pg.addUserStatus(custID, 1, "Created Account")

  custSuccess = await pg.addCustomer(custID, req.body)
  if(custSuccess == 0){
    res.json({
      success: false,
      errorMessage: "Customer Driver's License cannot be stored." 
    }); 
    return;
  }

  // bl.addPaymentMethod(stripeCust, data.creditCard)


  //TODO more error checking on the above
  //if all good so far, send email
  bl.emailCustomer(data.email, "Account Created", "Thank you for your interest in joining GyroGoGo! Our representatives will review your application.");

  res.json({ success: true});
});


router.get("/setupNewCustomerCard", async (req,res) => {
  var client_secret = await bl.setupNewCustomerCard()
  apiLog(client_secret)

  res.json({client_secret: client_secret});


})



router.post("/login", async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const ip = req.ip

  result = await pg.login(username, password)

  if(result.success == false){
    res.json(result);
    return;
  }
  else{
    var authToken = await generateToken(result.userID, ip)

    res.json({
      success: true,
      sessionToken: authToken,
      role: result.role
    })
  }

  res.json();
});


router.get("/getUserData", async (req, res) => {
  
  const token = req.headers['auth-token']

  var userAuth = await decodeToken(token)
  
  if(userAuth.validToken){
    var returnData = {};
    let userData = await pg.getUserById(userAuth.id)
    returnData.username = userData.username;
    returnData.email = userData.email;

    var custData = await pg.getCustomerByUserId(userAuth.id)

    if(custData != undefined){
      returnData.driversLicense = {
        ID: custData.licensenumber,
        firstName: userData.firstname,
        lastName: userData.lastname,
        state: custData.stateprovincename,
        expirationDate: new Date(custData.licenseexpires).toLocaleDateString()
      };
    }
    
    res.json(returnData)
  } else {
    //TODO replace default values with error message after GR#2
    res.json({
      username: "hardcoded_user",
      email: "hardcoded_email",
      driversLicense: {
        firstName: "hardcoded_fname",
        lastName: "hardcoded_lname",
        state: "hardcoded_state",
        ID: "hardcoded_DL_ID",
        expirationDate: "hardcoded_exp_date"
      }
      
    });
  }
  
  
});



router.post("/editUserData", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  //validate user
  if(userAuth.validToken){
    var userData = await pg.getUserById(userAuth.id)

    var custData = await pg.getCustomerByUserId(userAuth.id)

    apiLog(req.body)


    var newUserData = {}

    newUserData.userId = userData.userid

    //check for username
    if(inputData.hasOwnProperty('username')){
      newUserData.username = inputData.username
    }
    else{
      newUserData.username = userData.username
    }

    //check for password
    if(inputData.hasOwnProperty('password')){
      newUserData.password = inputData.password
    }
    else{
      newUserData.password = userData.password
    }

    //check for email
    if(inputData.hasOwnProperty('email')){
      newUserData.email = inputData.email
    }
    else{
      newUserData.email = userData.email
    }

    //TODO figure out what is happening to these values after GR#2
    newUserData.address = userData.address
    newUserData.zipcode = userData.zipcode
    newUserData.city = userData.city
    newUserData.stateProvinceID = userData.stateprovinceid

    //check for Driver License Values
    if(inputData.hasOwnProperty('driversLicense')){
      newUserData.email = inputData.email

      //check for firstName
      if(inputData.driversLicense.hasOwnProperty('firstName')){
        newUserData.firstName = inputData.driversLicense.firstName
      }
      else{
        newUserData.firstName = userData.firstName
      }
      
      //check for lastName
      if(inputData.driversLicense.hasOwnProperty('lastName')){
        newUserData.lastName = inputData.driversLicense.lastName
      }
      else{
        newUserData.lastName = userData.lastName
      }

      //check for state
      if(inputData.driversLicense.hasOwnProperty('state')){
        newUserData.state = inputData.driversLicense.state
      }
      else{
        newUserData.state = custData.stateprovincename
      }

      //check for DL number
      if(inputData.driversLicense.hasOwnProperty('ID')){
        newUserData.licenseNumber = inputData.driversLicense.ID
      }
      else{
        newUserData.licenseNumber = custData.licenseNumber
      }

      //check for DL expy
      //TODO check date formats later
      if(inputData.driversLicense.hasOwnProperty('ID')){
        newUserData.licenseExpy = inputData.driversLicense.expirationDate
      }
      else{
        newUserData.licenseExpy = custData.licenseexpires
      }

    }
    else{ // if no DriversLicense info at all
      newUserData.firstName = userData.firstname
      newUserData.lastName = userData.lastname
      newUserData.licenseNumber = custData.licenseNumber
      newUserData.licenseExpy = custData.licenseexpires
      newUserData.state = custData.stateprovincename
      

    }    

    var result = await pg.updateUser(newUserData)

    if(result == 1){

      var result2 = await pg.updateCustomer(newUserData)

      if(result2 == 1){
        res.json({success: true})
      }
      else{
        res.json({
          success: false,
          errorMessage: "Could not update user data"
        });
      }

    }
    else{
      res.json({
        success: false,
        errorMessage: "Could not update user data"
      });
    }

  }
  else{
    res.json({
      success: false,
      errorMessage: "Could not identify user"
    });

  }
  
})



//TODO connect to DB
router.get("/getCreditCards", (req, res) => {
  res.json({
    cards: [
      {
        cardToken: "11111111",
        lastNumbers: "Credit card ending in ####",
        fullname: "hardcoded_cc_name",
        expirationDate: "hardcoded_exp_date",
      },
      {
        cardToken: "22222222222",
        lastNumbers: "Credit card ending in ####",
        fullname: "hardcoded_cc_name",
        expirationDate: "hardcoded_exp_date",
      },
      {
        cardToken: "333333333",
        lastNumbers: "Credit card ending in ####",
        fullname: "hardcoded_cc_name",
        expirationDate: "hardcoded_exp_date",
      }
    ]
  });
});


//TODO connect to backend
router.post("/addCreditCard", (req, res) => {
  res.json({
    success: false,
    errorMessage: "Feature to be implemented soon"
  });
})



//TODO connect to backend
router.delete("/removeCreditCard", (req, res) => {
  res.json({
    success: false,
    errorMessage: "Feature to be implemented soon"
  });
})



//TODO connect to backend
router.get("/getLocations", async (req, res) => {
  apiLog(req.body)
  
  
  var query = await pg.getAllStations();
  apiLog(query)

  var locations = []

  query.forEach((item) => {
    var resultItem= {};
    
    resultItem.stationID = item.stationid
    resultItem.name = item.stationname
    resultItem.address = item.address
    resultItem.latitude = parseFloat(item.minlatitude)
    resultItem.longitude = parseFloat(item.minlongitude)

    
    locations.push(resultItem)
  })
  
  res.json({locations: locations})

});


router.post("/getAvailableLocations", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)
  
  var stations = await bl.getAvailableLocations(userAuth, inputData)

  res.json(stations)
})

//addLocation
router.post("/addLocation", async (req,res)=>{
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  const returnData = await bl.addStation(userAuth, inputData);
  res.json(returnData);
});


router.post("/addReservation", async (req, res) => {
  const token = req.headers['auth-token']
  var userAuth = await decodeToken(token)
  res.json(await bl.addReservation(userAuth, req.body))
});


router.delete("/deleteReservation", async (req, res) => {
  var conf = await bl.deleteReservation(req.body.reservationID)


  if(conf == 1){
    res.json({success: true})
  } else {
    res.json({success: false,
    errorMessage: "Could not find reservation."})
  }

})


router.get("/getReservePrice", async (req, res) => {
  var result = await bl.getReservePrice(req.body.pickupDateTime, req.body.dropoffDateTime )
 
  res.json(result)

});


router.post("/editReservation", async (req, res) => {
  await bl.editReservation(req.body)

});



router.get("/getUserReservations", async (req, res) => {
  const token = req.headers['auth-token']

  var userAuth = await decodeToken(token)

  //validate user
  if(userAuth.validToken){
    var reservations = await bl.getCustomerReservations(userAuth.id)

    res.json({
      reservations: reservations
    })
    
  } else {
    res.json({
      success: false, 
      errorMessage: "User could not be validated"
    })
  }
});



router.get("/getReservationsByUserID", async (req, res) => {
  var user = req.body.userID

  var reservations = await bl.getCustomerReservations(user)

  res.json({
    reservations: reservations
  })

});


router.get("/getReservationByID", async (req, res) => {
  //insert DB logic here

  var result = await bl.getReservationByID(req.body.reservationID)

  res.json({result});

});

//get all customers for employees
router.get("/getAllCustomers", async (req, res) => {
  const token = req.headers['auth-token']

  var userAuth = await decodeToken(token)

  const returnData = await bl.getAllCustomers(userAuth);
  res.json(returnData)
});

app.use("/api", router)
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


//get customer details
router.post("/getCustomerDetails", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  const returnData = await bl.getCustomerDetails(userAuth, inputData);
  res.json(returnData);
});

//change status
router.post("/addStatus", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  const returnData = await bl.addStatus(userAuth, inputData);
  res.json(returnData);
});

//change status
router.post("/changeStatus", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  const returnData = await bl.changeStatus(userAuth, inputData);
  res.json(returnData);
});

//get customer messages
router.post("/addMessage", async (req, res) => {
  const inputData = req.body;
  const returnData = await bl.addMessage(inputData);
  res.json(returnData);
});

//get customer messages
router.get("/getMessages", async (req, res) => {
  const token = req.headers['auth-token']

  var userAuth = await decodeToken(token)

  const returnData = await bl.getMessages(userAuth);
  res.json(returnData);
});

//markResolved
router.post("/markMessageResolved", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  const returnData = await bl.markMessageResolved(userAuth, inputData);
  res.json(returnData);
});


//MECHANICS ENDPOINTS

//getAllCars
router.get("/getAllCars", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const returnData = await bl.getAllCars(userAuth);
  res.json(returnData);
});

//getCarDetails
router.post("/getCarDetails", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.getCarDetails(userAuth, inputData);
  res.json(returnData);
});

//addCar
router.post("/addCar", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.addCar(userAuth, inputData);
  res.json(returnData);
});

//removeCar
router.delete("/removeCar", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.removeCar(userAuth, inputData);
  res.json(returnData);
});


router.put("/updateCar", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.updateCar(userAuth, inputData);
  res.json(returnData);
});

//getWorkOrders
router.post("/getWorkOrders", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.getWorkOrders(userAuth, inputData);
  res.json(returnData);
});


//addWorkOrder
router.post("/addWorkOrder", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.addWorkOrder(userAuth, inputData);
  res.json(returnData);
});

//Business Admin Endpoints

//getAllEmployees
router.get("/getAllEmployees", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const returnData = await bl.getAllEmployees(userAuth);
  res.json(returnData);
});

//employeeDetails
router.post("/getEmployeeDetails", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.getEmployeeDetails(userAuth, inputData);
  res.json(returnData);
});


//changeEmployeeStatus
router.put("/changeEmployeeStatus", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.changeEmployeeStatus(userAuth, inputData);
  res.json(returnData);
});

//addEmployee
router.post("/addEmployee", async (req,res)=>{
  const token = req.headers['auth-token'];
  var userAuth = await decodeToken(token);
  const inputData = req.body;
  const returnData = await bl.addEmployee(userAuth, inputData);
  res.json(returnData);
});

//UTILITY FUNCTIONS

function apiLog(msg){
  console.log('\x1b[95m[Server]:\x1b[0m', msg)
}



async function generateToken(id, ip = "127.0.0.1"){

  var tokenstr = ""

  //timestamp to base 13
  var timestamp = Date.now()
  var cryptTime = timestamp.toString(12)

  //id chunks to base 10
  var cryptID = id.toString(8)


  var cleanIP = ip.replace(/\./g, '')
  var cleanIP = cleanIP.replace(/\:/g, '')
  cryptIP = parseInt(cleanIP, 16).toString()

  //get length of longest str
  var longestStr = cryptTime.length
  if (cryptID.length>longestStr){longestStr = cryptID.length}
  if (cryptTime.length>longestStr){longestStr = cryptTime.length}

  //normalize with zeroes
  cryptID = cryptID.padStart(longestStr, "0")
  cryptIP = cryptIP.padStart(longestStr, "0")
  cryptTime = cryptTime.padStart(longestStr, "0")

  var randChars = ""
  for(let i = 0; i < longestStr; i++){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    randChars += characters.charAt(Math.floor(Math.random() * characters.length));
     
  }

  //interleave characters
  for(let i = 0; i < longestStr; i++){
    tokenstr += randChars[i];
    tokenstr += cryptTime[i];
    //id in reverse order
    tokenstr += cryptID[longestStr - 1 - i]
    tokenstr += cryptIP[i]
  }


 //generate 60-char checksum using bcrypt + add to token
 let myPromise = new Promise((myResolve, myReject) => {
    bcrypt.genSalt(1,  function(err, salt) {
      if(err){myReject()}
      bcrypt.hash(tokenstr, salt, function(err, hash) {
        if(err){myReject()}
        var checksumtoken = hash + tokenstr
        myResolve(checksumtoken)
      });
    });
  });

  await myPromise.then(
    function(value) {tokenstr = value},
    function(error) {}
  );
  
  apiLog("Generated token:" + tokenstr)
  return tokenstr
}



//TODO
// fix IP decoding
// add role encryption?
async function decodeToken(token){
  let data = {validToken: false}
  
  try{
    var checksum = token.substring(0, 60)
    var interleavedToken = token.substring(60, token.length)


    let myPromise = new Promise((myResolve, myReject) => {
      //analyze checksum to make sure string has not been tampered with
    bcrypt.compare(interleavedToken, checksum, (err, result)=>{
        if(err){
          apiLog("token decryption error");
          myReject;
        }
        else{
          myResolve()
        }  
      });
    });

    await myPromise.then(
      function(value) {
        //de-interleave all values
        var ip = ""
        var id = ""

        for(let i = 3; i < interleavedToken.length; i += 4){
          ip += interleavedToken[i]
        }

        for(let i = interleavedToken.length -2; i > 0; i -= 4){
          id += interleavedToken[i]
        }

        ip = ip.toString(16)
        while(ip.charAt[0] == '0'){
          ip = ip.substring(1, ip.length)
        }

        id = parseInt(id, 8)

        apiLog(id);
        apiLog(ip);

        data.validToken = true
        data.ip = ip;
        data.id = id;
        return;

      },
      function(error) {}
    );
    return data
  }
  catch(ex){
    return data
  }
}
