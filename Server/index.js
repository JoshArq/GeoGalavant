const express = require("express");

const PORT = process.env.PORT || 5001;

const app = express();
var router = express.Router()

app.use(express.json());

router.get("/test", (req, res) => {
    res.json({ result: "All good!" });
});


router.post("/createUser", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  console.log(username)
  console.log(password)

  res.json({ success: true, sessionToken: "to_be_implemented"});
});



router.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  console.log(username)
  console.log(password)

  res.json({ success: true, sessionToken: "to_be_implemented"});
});



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