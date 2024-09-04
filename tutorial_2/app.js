const express = require("express")
const bodyParser = require("body-parser")
const { graphqlHTTP } = require("express-graphql")
const mongoose = require("mongoose")
const graphQlSchema = require("./graphql/schemas/index")
const graphQlResolvers = require("./graphql/resolvers/index")
const isAuth = require("./middleware/isAuth")
const cors = require("cors")

const app = express()
const port = 5000;

require("dotenv").config({ path: ".env" })

app.use(bodyParser.json())

app.use(cors({
   origin: "*",
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(isAuth)

app.use("/graphql", graphqlHTTP({
   schema: graphQlSchema,
   rootValue: graphQlResolvers,
   graphiql: true
}));


mongoose.connect(`mongodb+srv://desire:04943655@cluster0.mf6mj8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
   .then(() => {
      app.listen(port, () => {
         console.log(`Server started listening at http://localhost:${port}`)
      })
      console.log("Connected to database")
   })
   .catch(error => {
      console.log(`Error connecting to database: ${error}`)
   })
