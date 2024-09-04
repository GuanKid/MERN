const Booking = require("../../models/booking")
const User = require("../../models/user")

const { dateToString } = require("../../helper/date")
const { singleEvent, userFunction } = require("./merge")

const transformBooking = (booking) => {
   return {
      ...booking._doc,
      _id: booking.id,
      booking: userFunction.bind(this, booking._doc.user),
      event: singleEvent.bind(this, booking._doc.event),
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt)
   }
}

module.exports = { // resolvers
   bookings: async (req) => {
      try {
         if (!req.isAuth) {
            return new Error("Unauthorized")
         }
         const bookings = await Booking.find();

         return bookings.map(booking => {
            return transformBooking(booking)
         })
      } catch (error) {
         return new Error();
      }
   },
   bookEvent: async (args, req) => {
      try {
         if (!req.isAuth) {
            return new Error("Unauthorized")
         }
         const fetchedEvent = await Event.findOne({ _id: args.eventId })
         const user = await User.findById("6684333d4a75f4cdcd4985b8")

         if (!fetchedEvent) {
            return new Error(`Event not found`)
         }

         if (!user) {
            return new Error("User not found");
         }

         const booking = new Booking({
            user: user,
            event: fetchedEvent
         })

         const result = await booking.save();
         console.log("Successfully booked event")

         return transformBooking(result)
      } catch (error) {
         return new Error(`Error booking event: ${error.message}`)
      }
   },
   cancelBooking: async (args, req) => {
      try {
         if (!req.isAuth) {
            return new Error("Unauthorized")
         }
         j
         const booking = await Booking.findById(args.bookingId).populate("event")

         if (!booking) {
            return new Error("Booking not found");
         }

         if (!booking) {
            return new Error("Event not associated with the booking")
         }

         const event = transformEvent(booking.event)

         await Booking.deleteOne({ _id: args.bookingId })

         console.log("Successfully cancelled booking");

         return event;
      } catch (error) {
         return new Error(`Couldn't cancel booking: ${error.message}`);
      }
   }
}