const express = require("express");
const router = express.Router();

const seatsRouter = require("./seats");
router.use("/seats", seatsRouter);

module.exports = router;