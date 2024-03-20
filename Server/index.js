const express = require("express");
const pg = require('./postGalavant.js')
require('dotenv').config()



const PORT = process.env.PORT || 5001;

const app = express();
var router = express.Router()

app.use(express.json());

router.get("/test", (req, res) => {
    res.json({ result: "All good!" });
});

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



router.get("/getUserData", (req, res) => {
  res.json({
    username: "hardcoded_user",
    email: "hardcoded_email"
  });
});



router.post("/editUserData", (req, res) => {
  res.json({
    success: false,
    errorMessage: "Feature to be implemented soon"
  });
})




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
