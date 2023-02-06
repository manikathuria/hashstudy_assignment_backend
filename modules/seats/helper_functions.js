const seatsRepo = require("../../db_services/seatsRepo");
const logger = require("../../utilities/logger/logger");

const bookSeatsHelper = async ({ username, seats_required, availableSeats }) => {
    try {
        const totalSeats = await seatsRepo.filterSeats({});
        if (availableSeats.length === totalSeats.length) {
            return bookSeatsMapper(availableSeats.splice(0, seats_required), username);
        } else {
            const rows = [...Array(Math.ceil(totalSeats.length / 7))];
            const seatRows = rows.map((row, idx) => totalSeats.slice(idx * 7, idx * 7 + 7));
            for (let i = 0; i < seatRows.length; i++) {
                const filterUnbookedSeats = seatRows[i].filter((seat, idx) => { return seat.is_booked == false });
                if (filterUnbookedSeats.length <= 0) continue;

                if (filterUnbookedSeats.length > seats_required) {
                    return bookSeatsMapper(filterUnbookedSeats.splice(0, seats_required), username);
                } else {
                    let seatsBooked = filterUnbookedSeats.length;
                    let bookings = await bookSeatsMapper(filterUnbookedSeats.splice(0, filterUnbookedSeats.length), username);
                    totalBookings = seatRows[i + 1].reverse().splice(0, seats_required - seatsBooked);
                    return [...bookings, ...await bookSeatsMapper(totalBookings, username)]
                }
            }

        }
    } catch (err) {
        logger.error("error in book seats helper: ", err);
        throw err;
    }
};

const bookSeatsMapper = async (totalBookings, username) => {
    try {
        return Promise.all(totalBookings.map(async (booking, idx) => {
            return seatsRepo.updateSeat({
                booked_by: username,
                is_booked: true,
                seat_id: booking.seat_id
            })
        })).then((res) => {
            return res;
        })

    } catch (err) {
        logger.error("mapper error : ", err)
        throw err;
    }
}

const findLastIndex = (array, searchKey, searchValue) => {
    let index = array.slice().reverse().findIndex(x => x[searchKey] === searchValue);
    let count = array.length - 1
    let finalIndex = index >= 0 ? count - index : index;
    return finalIndex;
}

module.exports = {
    bookSeatsHelper
}