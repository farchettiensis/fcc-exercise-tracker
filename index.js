const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT;
const mongoose = require('mongoose');

mongoose.connect(mongoURI);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  }
});

let userModel = mongoose.model('user', userSchema);

const exerciseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: new Date()
  }
});

let exerciseModel = mongoose.model('exercise', exerciseSchema);

// middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// new user endpoint
app.post('/api/users', async (req, res) => {
  const username = req.body.username;
  try {
    const existingUser = await userModel.findOne({ username });

    if (existingUser) {
      res.json({ error: 'Username already exists' });
    } else {
      const newUser = new userModel({
        username: username
      });

      await newUser.save();

      res.json({
        username: newUser.username,
        _id: newUser._id
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// list of users endpoint
app.get('/api/users' , async (req, res) => {
  try {
    let users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// add exercise endpoint
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { description, duration, date } = req.body;

    const newExercise = new exerciseModel({
      userId,
      description,
      duration,
      date: date ? new Date(date) : undefined,
    });

    await newExercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      description: newExercise.description,
      duration: newExercise.duration,
      date: newExercise.date.toDateString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// get exercise log endpoint
app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const userId = req.params._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exercisesQuery = { userId };

    if (req.query.from && req.query.to) {
      exercisesQuery.date = {
        $gte: new Date(req.query.from),
        $lte: new Date(req.query.to),
      };
    }

    let exercises = await exerciseModel
      .find(exercisesQuery)
      .sort({ date: -1 })
      .limit(parseInt(req.query.limit) || 10);

    const log = exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});