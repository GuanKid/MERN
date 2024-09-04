const bcrypt = require("bcrypt")
const User = require("../../models/user")
const JSONWebToken = require("jsonwebtoken")

module.exports = { // resolvers
   createUser: async (args) => {
      try {
         const userExists = await User.findOne({ email: args.userInput.email }) // fetch user for validation

         if (userExists) {
            return new Error("User already exists")
         }

         const hashedPassword = await bcrypt.hash(args.userInput.password, 10) // hash password

         const user = new User({ // create new user
            email: args.userInput.email,
            password: hashedPassword
         })
         const result = await user.save()
         console.log("User saved successfully")

         return { ...result._doc, password: null, _id: result.id }
      } catch (error) {
         return new Error(`Error creating user: ${error.message}`)
      }
   }, 
   login: async ({ email, password }) => {
      try {
         const user = await User.findOne({ email: email })

         if (!user) {
            return new Error("User does not exist")   
         }

         const decryptedPassword = await bcrypt.compare(password, user.password)
         
         if (!decryptedPassword) {
            return new Error("Invalid password")
         }

         const token = JSONWebToken.sign({ userId: user.id, email: user.email}, "admin123", {
            expiresIn: "1h"
         });

         return { 
            userId: user.id,
            token: token,
            tokenExpiration: 1 
         }
      } catch (error) {
         console.log(error)
         return new Error(`Error logging user in: ${error.message}`)
      }
   }
}