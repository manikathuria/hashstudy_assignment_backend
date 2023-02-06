const joi = require("joi");

exports.seatsReq = joi.object({
    username: joi.string().required(),
    seats_required: joi.number().max(7).required()
});
exports.getSeatsReq = joi.object({
    username: joi.string(),
    is_booked: joi.boolean(),

});