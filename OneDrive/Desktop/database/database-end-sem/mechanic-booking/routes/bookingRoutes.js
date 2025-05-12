const express = require('express');
const Booking = require('../models/booking');
const User = require('../models/user');
const bookingRoutes = express.Router();

bookingRoutes.post('/booking',async(req,res)=>{
    try{
        const {model,date,mechanicId,ownerId}=req.body;

        const appointmentDateTime = new Date(date);
        if (isNaN(appointmentDateTime.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }
        if (appointmentDateTime <= new Date()) {
            return res.status(400).json({ error: "Date must be in the future" });
        }

        const [owner,mechanic] = await Promise.all([
            User.findById(ownerId),
            User.findById(mechanicId)
        ]);

        if(!owner || owner.role!=='owner'){
            return res.status(400).json({error:"owner role invalid"});
        }

        if(!mechanic || mechanic.role!=='mechanic'){
            return res.status(400).json({error:"mechanic role invalid"});
        }

        const booking = new Booking({model,date,mechanicId,ownerId});
        await booking.save();

        res.status(201).json({message:"booking confirmed",booking});

    }catch{
        res.status(500).json({error:"Server error"});
    }
});

module.exports = bookingRoutes;