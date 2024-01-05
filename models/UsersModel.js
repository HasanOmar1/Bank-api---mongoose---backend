import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: [true, "This ID is taken"],
    required: [true, "Please take an ID"],
    min: [1, "The Lowest ID you can take is 1. "],
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: [3, "Name must be longer than 2 characters"],
  },
  email: {
    type: String,
    unique: [true, "This email is taken"],
    required: [true, "Please provide an email"],
    lowerCase: true,
  },
  cash: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
