import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"


// app config
const app = express()       //initialising app using express package
const port = 4000   //port number where our server will be running

// middleware
app.use(express.json())     //whenever get request from frontend to backend, passed here
app.use(cors())             //can access the backend from any frontend

// db connection
connectDB();

//api endpoints, provide endpoint address
app.use('/api/food', foodRouter)

app.get("/", (req,res)=>{
    res.send("API Working")
})            //get data from this server

app.listen(port,()=>{
    //whenever server running
    console.log(`Server started on http://localhost:${port}`)
})