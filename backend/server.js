const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Goal = require('./models/goals.js');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan'); // morgan is a middleware that logs requests to the console


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mongoose.connect('mongodb://host.docker.internal:27017/goals_db').then(() => {
//     console.log('Connected to mongodb');
// }).catch((error) => {
//     console.log('Error *** ',error);
// })

mongoose.connect(`mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongodb:27017/goals_db?authSource=admin`).then(() => {
    console.log('Connected to mongodb!!');
}).catch((error) => {
    console.log(process.env.MONGO_USERNAME)
    console.log(process.env.MONGO_PASSWORD)
    console.log('Error *** ',error);
})

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined',{ stream: accessLogStream }));

app.get('/',(req,res) => {
    res.send('Server is ready');
})

app.get('/api/goals',async (req,res) => {
    try {
        const goals = await Goal.find()
        res.json(goals)
    } catch (error) {
        console.error("Error fetching goals ",error)
        res.status(500).json({ message: "Error fetching goals" })
    }
})

app.post('/api/goals',async (req,res) => {
    try {
        const { name,desc } = req.body;
        const newGoal = new Goal({ name,desc });
        await newGoal.save();
        res.status(201).json({ message: 'Goal saved successfully' });
    } catch (error) {
        console.error('Error saving goal:',error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/goals/:id',async (req,res) => {
    try {
        const { id } = req.params
        await Goal.findByIdAndDelete(id)
        res.json({ message: "Goal deleted" })
    } catch (error) {
        console.error("Error deleting goal ",error)
        res.status(500).json({ message: "Error deleting goal" })
    }
})

app.patch('/api/goals/:id/complete',async (req,res) => {
    try {
        const { id } = req.params
        const goal = await Goal.findById(id)

        // const updatedGoal = await Goal.findByIdAndUpdate(id,{ isCompleted: !goal.isCompleted },{ new: true })
        // res.json(updatedGoal)

        goal.isCompleted = !goal.isCompleted
        await goal.save()
        res.json(goal)
    } catch (error) {
        console.error("Error completing goal ",error)
        res.status(500).json({ message: "Error completing goal" })
    }
})

app.listen(5001,() => {
    console.log('Server at http://localhost:5001');
})