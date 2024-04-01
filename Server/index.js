const express = require("express");
const bl = require('./businessLayer.js')
const pg = require('./postGalavant.js')
require('dotenv').config()
const bcrypt = require('bcrypt');




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


//TODO needs address fix after GR#2
router.post("/createCustomer", async (req, res) => {
  console.log(req.body);  
  var custID = await pg.addUser(req.body)

  if(custID == -1){
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

  var statusID = await pg.addUserStatus(custID, 1, "Created Account")

  custSuccess = await pg.addCustomer(custID, req.body)
  if(custSuccess == 0){
    res.json({
      success: false,
      errorMessage: "Customer Driver's License cannot be stored." 
    }); 
    return;
  }


  res.json({ success: true, sessionToken: "to_be_implemented", role: roleID});
});



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
    
    var userData = await pg.getUserById(userAuth.id)

    var custData = await pg.getCustomerByUserId(userAuth.id)

    var expy = new Date(custData.licenseexpires).toLocaleDateString()

    var returnData = {
      username: userData.username,
      email: userData.email,
      driversLicense: {
        ID: custData.licensenumber,
        firstName: userData.firstname,
        lastName: userData.lastname,
        state: custData.stateprovincename,
        expirationDate: expy
      }
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

router. 
  
  res.json({locations: locations})
  
  // res.json({
  //   locations:[
  //     {
  //       stationID: 1,
  //       name: "GyroGoGo Northwest", 
  //       address: "The mall at Greece Ridge...",
  //       latitude: 43.20,
  //       longitude: -77.69
  //     },
  //     {
  //       stationID: 2,
  //       name: "GyroGoGo Northeast", 
  //       address: "Town Center of Webster...",
  //       latitude: 43.21,
  //       longitude: -77.46
  //     },
  //     {
  //       stationID: 3,
  //       name: "GyroGoGo Center City", 
  //       address: "Genesee Crossroads Garage...",
  //       latitude: 43.16,
  //       longitude: -77.61
  //     }
  //   ]
  // });
});





//TODO - connect to DB
router.post("/makeReservation", (req, res) => {
  //insert DB logic here

  res.json({
    success: true, 
    reservationNumber: 1111
  })
});








//TODO - connect to DB
router.get("/getUserReservations", (req, res) => {
  //insert DB logic here

  res.json({
    reservations: [
      {
        reservationNumber: 1111,
        pickupStationName: "GyroGoGo Northwest",
        pickupStationAddress: "The mall at Greece Ridge...",
        dropoffStationName: "GyroGoGo Center City",
        dropoffStationAddress: "Genesee Crossroads Garage...",
        pickupDateTime: "2012-04-23T18:25:43.511Z",
        dropoffDateTime: "2012-04-23T18:25:43.511Z"
      },
      {
        reservationNumber: 2222,
        pickupStationName: "GyroGoGo Northwest",
        pickupStationAddress: "The mall at Greece Ridge...",
        dropoffStationName: "GyroGoGo Center City",
        dropoffStationAddress: "Genesee Crossroads Garage...",
        pickupDateTime: "2012-04-23T18:25:43.511Z",
        dropoffDateTime: "2012-04-23T18:25:43.511Z"
      },
      {
        reservationNumber: 3333,
        pickupStationName: "GyroGoGo Northwest",
        pickupStationAddress: "The mall at Greece Ridge...",
        dropoffStationName: "GyroGoGo Center City",
        dropoffStationAddress: "Genesee Crossroads Garage...",
        pickupDateTime: "2012-04-23T18:25:43.511Z",
        dropoffDateTime: "2012-04-23T18:25:43.511Z"
      }   
    ]
    
  })
});






//TODO - connect to DB
router.get("/getUserReservationByID", (req, res) => {
  //insert DB logic here

  res.json({
    reservationNumber: 3333,
    pickupStationName: "GyroGoGo Northwest",
    pickupStationAddress: "The mall at Greece Ridge...",
    dropoffStationName: "GyroGoGo Center City",
    dropoffStationAddress: "Genesee Crossroads Garage...",
    pickupDateTime: "2012-04-23T18:25:43.511Z",
    dropoffDateTime: "2012-04-23T18:25:43.511Z",
    cardLastNumbers: "Credit card ending in ####"
  });

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
router.get("/getCustomerDetails", async (req, res) => {
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
  var data = {validToken: false}

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
