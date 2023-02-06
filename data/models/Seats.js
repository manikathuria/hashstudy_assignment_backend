const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SeatsSchema = new Schema({
    seat_id: Number,
    booked_by: String,
    is_booked: {
        type: Boolean,
        default: false
    }
})

const Seats = mongoose.model("seats", SeatsSchema);
module.exports = {
    Seats
}