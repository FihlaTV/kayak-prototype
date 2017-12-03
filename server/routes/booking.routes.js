import { Router } from 'express';
import * as BookingController from '../controllers/booking.controller';

const router = new Router();

// Get All Bookings
router.route('/').get(BookingController.getAllBookings);

// Get All Bookings for User
router.route('/all/:email').get(BookingController.getAllBookings);

// Search Bookings
router.route('/search').get(BookingController.searchBookings);

// Top 10 Bookings based on revenue/year
router.route('/topYearRevenue').get(BookingController.topTenBasedOnYearRevenue);

// City based revenue Bookings
router.route('/cityRevenue').get(BookingController.cityBasedRevenue);

// Top 10 Bookings based on revenue for a month
router.route('/topMonthRevenue').get(BookingController.topTenBasedOnMonthRevenue);

// Create Booking
router.route('/').put(BookingController.createBooking);

// Get Booking
router.route('/:cuid').get(BookingController.getBooking);

// Delete Booking
router.route('/:cuid').delete(BookingController.deleteBooking);

// Update Booking
router.route('/:cuid').patch(BookingController.updateBooking);

export default router;