const express = require("express");
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


//TODO needs address fix
router.post("/createCustomer", async (req, res) => {

  var custID = await pg.createUser(req.body)

  if(custID == -1){
    res.json({
      success: false,
      errorMessage: "Could not create user." 
    }); 
    return;
  }

  var unapproved_customer_role_ID = 7

  var roleID = await pg.addUserRole(custID, unapproved_customer_role_ID)

  if(roleID == -1){
    res.json({
      success: false,
      errorMessage: "User cannot be assigned role." 
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


//TODO add DL info
router.get("/getUserData", async (req, res) => {
  
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)
  
  if(userAuth.validToken){
    
    var userData = await pg.getUserById(userAuth.id)

    var returnData = {
      username: userData.username,
      email: userData.email,
      driversLicense: {
        firstName: userData.firstname,
        lastName: userData.lastname,
        state: "?",
        ID: "?",
        expirationDate: "?"

      }
    }

    res.json(returnData)
  } else {
    //TODO replace default values with error message
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



//TODO connect to backend
router.post("/editUserData", async (req, res) => {
  const token = req.headers['auth-token']
  const inputData = req.body;

  var userAuth = await decodeToken(token)

  if(userAuth.validToken){
    var userData = await pg.getUserById(userAuth.id)

    apiLog(userData)

    var newUserData = {}

    newUserData.userId = userData.userid

    if(inputData.hasOwnProperty('username')){
      newUserData.username = inputData.username
    }
    else{
      newUserData.username = userData.username
    }


    newUserData.password = userData.password
    newUserData.firstName = userData.firstname
    newUserData.lastName = userData.lastname
    newUserData.email = userData.email
    newUserData.address = "TBD"
    newUserData.zipcode = "TBD"
    newUserData.stateProvinceID = "TBD"

  }
  
  
  
  res.json({
    success: false,
    errorMessage: "Feature to be implemented soon"
  });
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
router.get("/getLocations", (req, res) => {
  res.json({
    locations:[
      {
        stationID: 1,
        name: "GyroGoGo Northwest", 
        address: "The mall at Greece Ridge...",
        latitude: 111.11,
        longitude: 111.11
      },
      {
        stationID: 2,
        name: "GyroGoGo Northeast", 
        address: "Town Center of Webster...",
        latitude: 111.11,
        longitude: 111.11
      },
      {
        stationID: 3,
        name: "GyroGoGo Center City", 
        address: "Genesee Crossroads Garage...",
        latitude: 111.11,
        longitude: 111.11
      }
    ]
  });
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



//TODO - connect to DB
router.post("/submitContactForm", (req, res) => {
  //insert DB logic here

  res.json({
    success: true
  })
});



app.use("/api", router)
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
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
// fix race conditions for return
// fix IP decoding
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
