let Booking = require('../models/booking');

function handle_request(req, callback) {
  console.log("In handle request:" + JSON.stringify(req));

  let res;

  if (req.name === 'createBooking') {
    let booking = Booking({
      userID: req.body.userID,
      serviceType: req.body.serviceType,
      bookingDetail: {
        serviceId: req.body.serviceId,
        price: req.body.price,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
      },
    });
    booking.save(function (error) {
      res = {
        status: 400,
        title: 'Invalid data.',
        error: {message: 'Failed to create booking.'},
      };
      callback(null, res);
    });

    res = {
      status: 201,
      message: 'Successfully created booking.',
      booking: booking,
    };

    callback(null, res);
  }

  if (req.name === 'getBooking') {
    Booking.findOne({_id: req.params._id}, (error, booking) => {
      if (error || !booking) {
        res = {
          status: 404,
          title: 'Booking not found.',
          error: {message: 'Failed to retrieve booking.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 200,
          message: 'Successfully retrieved booking.',
          booking: booking,
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'updateBooking') {
    Booking.findOneAndUpdate({_id: req.params._id}, req.body, (error, booking) => {
      if (error || !booking) {
        res = {
          status: 404,
          title: 'Booking not found.',
          error: {message: 'Failed to update booking.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 200,
          message: 'Successfully updated booking.',
          booking: req.body,
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'deleteBooking') {
    Booking.findOneAndRemove({_id: req.params._id}, (error, booking) => {
      if (error || !booking) {
        res = {
          status: 404,
          title: 'Booking not found.',
          error: {message: 'Failed to delete booking.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 200,
          message: 'Successfully deleted booking.',
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'getAllBookings') {
    Booking.find({}, (error, bookings) => {
      if (error) {
        res = {
          status: 500,
          title: 'Bookings not retrieved.',
          error: {message: 'Failed to retrieve bookings.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 200,
          message: 'Successfully retrieved all bookings.',
          bookings: bookings,
        };
        callback(null, res);
      }
    });
  }

}

exports.handle_request = handle_request;
