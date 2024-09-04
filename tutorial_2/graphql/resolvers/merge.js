const Event = require("../../models/events")
const User = require("../../models/user")

const events = async (eventIds) => {
   try {
      const events = await Event.find({
         _id: {
            $in: eventIds // search for value in the specified array using "$in" 
         }
      })

      if (events) {
         return events.map(event => {
            return transformEvent(event)
         })
      }
   } catch (error) {
      return new Error(error.message)
   }
}

const singleEvent = async (eventId) => {
   try {
      const event = await Event.findById(eventId)

      return {
         ...event._doc,
         _id: event.id,
         creator: userFunction.bind(this, event.creator)
      }
   } catch (error) {
      return new Error(error.message)
   }
}

const userFunction = async (userId) => {
   try {
      const foundUser = await User.findById(userId); // find user by id

      if (foundUser) {
         return {
            ...foundUser._doc, // return all data
            _id: foundUser.id, // overwrite the id prop
            createdEvents: events.bind(this, foundUser._doc.createdEvents) // return events posted by user
         }
      }
   } catch (error) {
      return new Error(error.message)
   }
}

module.exports = { events, userFunction, singleEvent }