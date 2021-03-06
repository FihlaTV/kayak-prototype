let Booking = require('../models/booking');

const logger = require('../logger');
let jwt = require('jsonwebtoken');

function handle_request(req, callback) {
  console.log("In handle request:" + JSON.stringify(req));

  let res;
  let decoded = jwt.decode(req.query.token);

  if (req.name === 'createBooking') {

    let now = Date.now();
    let d = new Date(now);
    let date = d.toLocaleDateString();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;

    let dateFrom = new Date(req.body.dateFrom);
    let dateTo = new Date(req.body.dateTo);
    let timeDifference = Math.abs(dateFrom.getTime() - dateTo.getTime());
    let daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    let calculatedPrice = daysDifference * req.body.price;

    let booking = Booking({
      userID: req.body.userID,
      serviceType: req.body.serviceType,
      bookingDetail: {
        serviceId: req.body.serviceId,
        serviceName: req.body.serviceName,
        price: calculatedPrice,
        dateFrom: dateFrom,
        dateTo: dateTo,
        city: req.body.city,
      },
      dateAdded: date,
      yearAdded: year,
      monthAdded: month,
      cardNumber: req.body.cardNumber,
      billingZipcode: req.body.billingZipcode,
    });
    booking.save(function (error) {
      if (error) {
        res = {
          status: 400,
          title: 'Invalid data.',
          error: {message: 'Failed to create booking.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 201,
          message: 'Successfully created booking.',
          booking: booking,
        };
        callback(null, res);
      }
    });
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

  if (req.name === 'getAllBookingsForUser') {

    if (decoded.user.email !== null)
      logger.info({page: 'Booking', user: decoded.user.email});
    else
      logger.info({page: 'Booking', user: ''});

    Booking.find({userID: req.params.email}, (error, bookings) => {
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

  if (req.name === 'searchBookings') {
    //Naive logic - to be optimized later
    let conditions = [];

    if (req.query.date !== undefined) {
      conditions.push({dateAdded: req.query.date});
    }
    if (req.query.month !== undefined) {
      conditions.push({monthAdded: req.query.month});
    }
    if (req.query.year !== undefined) {
      conditions.push({yearAdded: req.query.year});
    }

    Booking.find({$and: conditions}, (error, bookings) => {
      if (error) {
        console.error(error);
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

  if (req.name === 'topTenBasedOnYearRevenue') {
    Booking.aggregate([{$match: {serviceType: req.query.serviceType}}, {
      $group: {
        _id: '$bookingDetail.serviceName',
        total: {$sum: '$bookingDetail.price'},
      },
    }, {$sort: {total: 1}}, {$limit: 10}], (error, bookings) => {
      if (error) {
        console.error(error);
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

  if (req.name === 'cityBasedRevenue') {
    Booking.aggregate([{$group: {_id: '$bookingDetail.city', total: {$sum: '$bookingDetail.price'}}}, {$sort: {total: 1}}], (error, bookings) => {
      if (error) {
        console.error(error);
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

  if (req.name === 'topTenBasedOnMonthRevenue') {
    Booking.aggregate([{$match: {month: req.query.month, year: req.query.year, serviceType: req.query.serviceType}}, {
      $group: {
        _id: '$bookingDetail.serviceName',
        total: {$sum: '$bookingDetail.price'},
      },
    }, {$sort: {total: 1}}, {$limit: 10}], (error, bookings) => {
      if (error) {
        console.error(error);
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
