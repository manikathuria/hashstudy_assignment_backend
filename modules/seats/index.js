const express = require("express");
const router = express.Router();
const controller = require('./controller');

router.post("/bookSeats", controller.bookSeats);
router.post("/getSeats", controller.getBookedSeats);
router.get("/get", (req, res) => {
    res.json({message: "get req..."})
})

module.exports = router;