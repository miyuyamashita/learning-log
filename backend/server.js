const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const apiRoute = require("./routes/api.js");
const authRoute = require("./routes/auth.js");

const app = express();

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "http://localhost:5173", // クライアントのURL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); //localhost 3005 localhost 5173

app.use("/api", apiRoute);
app.use("/auth", authRoute);

//error
app.use((e, req, res, next) => {
  console.log(e);
  if (!e.statusCode) {
    e.statusCode = 500;
  }
  const status = e.statusCode;
  const message = e.message;
  const data = e.data; //array
  res.status(status).json({ message: message, data: data });
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Database connected");
  https.createServer({ key: privateKey, cert: certificate }, app).listen(3000);
});
