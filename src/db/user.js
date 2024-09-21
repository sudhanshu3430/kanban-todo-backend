const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const taskSchema = mongoose.Schema({
  userId: String,
  taskname: String,
  priority: String,
  status: String,
});


const Task = mongoose.model("Task", taskSchema);
module.exports = { User, Task };
