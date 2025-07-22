const express = require("express");
const { connect } = require("mongoose");
const connectDb = require("./config/dbConnection");

const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
