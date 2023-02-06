const { Timestamp } = require("mongodb");
const Seats = require("../../data/models/Seats");
const { getDb } = require("../../dbConnection");
const logger = require('../../utilities/logger/logger');
const db = getDb();

const filterSeats = async (filter = {}) => {
    if (Object.keys(filter).length <= 0) {
        let res = await db.collection("seats").find().toArray((err, res) => {
            if (err) throw err;
            return res;
        });     
        return res;
    }
    return await db.collection("seats").find(filter).toArray((err, res) => {
        if (err) throw err;
        return res;
    });
};

const updateSeat = (seat) => {
    return db.collection("seats").findOneAndUpdate({seat_id: seat.seat_id}, {
        $set: {
            booked_by: seat.booked_by,
            is_booked: true,
        }
    }, (err, res) => {
        if (err) logger.error("error in getAvailable seats: ", err);
        return res;
    });
};

const addSeatsData = async () => {
    let isDataExists = false;
    let totalRecords = await db.collection("seats").count(); 
    if (totalRecords > 0) return;  

    let totalSeats = new Array(80).fill({
        is_booked: false,
        booked_by: ""
    });
    totalSeats = totalSeats.map((seat, idx) => ({
        ...seat,
        seat_id: idx + 1,
    }))
    db.collection("seats").insertMany(totalSeats, (err, res) => {
        if(err) {
            logger.error("error in bulk insert: ", err)
            throw err;
        }
        logger.info(res.insertedCount + " documents inserted");
    })
};

module.exports = {
    filterSeats,
    updateSeat,
    addSeatsData,
}