const express = require("express");

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
    res.json({ result: "All good!" });
});


app.post("/submitContactForm", (req, res) => {
  //insert DB logic here

  res.json({
    success: true
  })
});




app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});