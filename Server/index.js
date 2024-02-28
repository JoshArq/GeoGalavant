const express = require("express");
const pg = require('./postGallavant.js')


const PORT = process.env.PORT || 5001;

const app = express();
var router = express.Router()

app.use(express.json());

router.get("/test", (req, res) => {
    res.json({ result: "All good!" });
});

router.post("/createCustomer", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const appliedBefore = req.body.appliedBefore
  const driversLicense = req.body.driversLicense

  console.log(username)
  console.log(password)

  res.json({ success: true, sessionToken: "to_be_implemented", role: 4});
});



router.post("/login", async (req, res) => {
  const username = req.body.username
  const password = req.body.password

  res.json(await pg.login(username, password));
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