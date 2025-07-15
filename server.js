const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect('mongodb+srv://ghugeleenavijay28:2807@cluster0.q30zfzy.mongodb.net/leaderboard?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  totalPoints: { type: Number, default: 0 },
});
const User = mongoose.model('User', userSchema);

// History Schema
const historySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  pointsAwarded: Number,
  claimedAt: { type: Date, default: Date.now },
});
const History = mongoose.model('History', historySchema);

// Create user
app.post('/users', async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Claim points
app.post('/claim/:userId', async (req, res) => {
  const { userId } = req.params;
  const points = Math.floor(Math.random() * 10) + 1;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.totalPoints += points;
  await user.save();

  const history = new History({ userId, pointsAwarded: points });
  await history.save();

  res.json({ message: 'Points claimed', pointsAwarded: points, user });
});

// Get leaderboard
app.get('/leaderboard', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    totalPoints: user.totalPoints,
  }));
  res.json(leaderboard);
});

// Get history
app.get('/history', async (req, res) => {
  const history = await History.find().populate('userId', 'name').sort({ claimedAt: -1 });
  res.json(history);
});
// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.listen(3000, () => console.log('Server running on port 3000'));
