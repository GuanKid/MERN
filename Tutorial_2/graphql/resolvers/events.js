const Event = require("../../models/events")
const { dateToString } = require("../../helper/date")
const User = require("../../models/user")
const { events, userFunction } = require("../resolvers/merge")

const transformEvent = (event) => {
   return {
      ...event._doc, // get document data
      _id: event.id, // overwrite the id prop
      date: dateToString(event._doc.date), // convert date to readable date
      creator: userFunction.bind(this, event.creator) // bind user function to populate creator 
   }
}

module.exports = { // resolvers
   events: async () => {
      try {
         const events = await Event.find() // return all events

         return events.map(event => {
            return transformEvent(event);
         })
      } catch (error) {
         return new Error(`Couldn't retrieve events: ${error.message}`)
      }
   },
   createEvent: async (args, req) => {
      try {
         if (!req.isAuth) {
            return new Error("Unauthorized")
         }
         const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
         })

         const userExists = await User.findById(req.userId)

         if (!userExists) {
            return new Error("User don't exists")
         } else {
            userExists.createdEvents.push(event) // add event posted by user to their createdEvents prop
            await userExists.save()
         }

         const savedEvent = await event.save()
         console.log(`Saved event successfully`)

         return transformEvent(savedEvent)
      } catch (error) {
         return new Error(`Error saving event: ${error.message}`)
      }
   }
}