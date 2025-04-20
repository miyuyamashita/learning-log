const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const apiRoutes = require("./routes/api.js");
const authRoutes = require("./routes/auth.js");

const app = express();

const privateKey = fs.readFileSync("server.key");
const certificate = fs.readFileSync("server.cert");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "http://localhost:5173", // クライアントのURL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions)); //localhost 3005 localhost 5173
// app.options("*", cors(corsOptions));

// app.use("");
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

app.use((e, req, res, next) => {
  console.log(e);
  const status = e.statusCode;
  const message = e.message;
  const data = e.data; //array
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://Miyu:zq19pm@cluster0.yawdz6m.mongodb.net/log?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Database connected");
    https
      .createServer({ key: privateKey, cert: certificate }, app)
      .listen(3000);
  });
