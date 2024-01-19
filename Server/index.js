const express = require("express");

const PORT = process.env.PORT || 5001;

const app = express();

app.get("/test", (req, res) => {
    res.json({ result: "All good!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});