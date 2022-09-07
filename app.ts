import dotenv from 'dotenv'
dotenv.config({path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env'} )

import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import decodeToken from "./auth"
import apiRoutes from "./routes/api";
import mongoose from "mongoose";

mongoose.connect(process.env.DATABASE_URL).then((response) => {
    console.log('MongoDB Connected Successfully.')
}).catch((err) => {
    console.log('Database connection failed.')
})

const PORT = process.env.PORT
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

app.use(compression())
app.use(helmet())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //* will allow from all cross domain
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.locals.socket = io
    next()
});
app.use(cors())
app.use(decodeToken)
app.use('/api', apiRoutes)

http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});