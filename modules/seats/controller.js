const path = require("path")
const handleErrors = require("../../utilities/controllers/handle_errors")
const joiModel = require("./joi_models");
const seatsRepo = require("../../db_services/seatsRepo")
const helperFunctions = require('./helper_functions');

const getBookedSeats = async (req, res) => {
    try {
        const validation = joiModel.getSeatsReq.validate(req.body)
        if (validation.error) {
            return res.status(403).send({
                success: false,
                message: validation.error,
                data: []
            })
        }

        validatedReq = validation.value;
        if (Object.keys(validatedReq).length > 0) { 
            validatedReq.booked_by = validatedReq.username; 
            delete validatedReq.username; 
        }

        const filterBookedSeats = await seatsRepo.filterSeats(validatedReq);
        if (filterBookedSeats) {
            return res.status(200).send({
                success: true,
                message: 'data found successfully',
                data: filterBookedSeats
            })
        }

        return res.status(200).send({ 
            success: false,
            message: 'user does not exist!',
            data: []
        })
    } catch (err) {
        return handleErrors(err, res);
    }
}

const bookSeats = async (req, res) => {
    try {
        const validation = joiModel.seatsReq.validate(req.body)
        if (validation.error) {
            return res.status(403).send({
                success: false,
                message: validation.error,
                data: []
            })
        }

        validatedReq = validation.value
        const availableSeats = await seatsRepo.filterSeats({ is_booked: false });
        if (validatedReq.seats_required > availableSeats.length) {
            return res.status(201).send({
                success: false,
                message: "Sorry!! Seats are not available",
                data: []
            })
        }

        const seatsBooked = await helperFunctions.bookSeatsHelper({ ...validatedReq, availableSeats });
        if (seatsBooked) {
            return res.status(200).send({
                success: true,
                message: "seats booked successfully",
                data: seatsBooked
            })
        }
    } catch (err) {
        return handleErrors(err, res);
    }


}

module.exports = {
    getBookedSeats,
    bookSeats
}