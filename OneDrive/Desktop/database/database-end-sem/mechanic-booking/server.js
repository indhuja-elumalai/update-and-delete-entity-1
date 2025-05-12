const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("mongodb connection successful"))
.catch((err)=>console.log("connection not successful"));

app.use('/',userRoutes);
app.use('/',bookingRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
});