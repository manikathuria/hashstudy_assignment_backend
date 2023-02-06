const express = require('express');
const bodyParser = require('body-parser');
const logger = require("./utilities/logger/logger");
const cors = require("cors");
const indexRouter = require('./modules/index')
const router = require("./modules/index.js")
var path = require("path");
require('dotenv').config({ path: __dirname + '/.env' });
const { addSeatsData } = require('./db_services/seatsRepo');
const { connectDb } = require('./dbConnection');
const app = express();


app.use(express.static(path.join(__dirname, 'public')));

app.get("/health", (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: "Ok",
    date: new Date(),
  };
  res.status(200).send(data);
});

connectDb();


app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', function (req, res) {
  res.json({message: "running..."});
});
app.use("/api", indexRouter);
app.use(function (req, res, next) {
  res.sendStatus(404);
});

app.listen(process.env.PORT, async () => {
    try {
        logger.info(`🚀 backend app running on port ${process.env.PORT}`);
        await addSeatsData();
    } catch (err) {
        logger.error("server error: ", err);
    }
  
});
