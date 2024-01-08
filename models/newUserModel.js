import mongoose from "mongoose";

const newUserSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [2, "password must be longer than one character"],
  },
});

const newUser = mongoose.model("newUser", newUserSchema);
export default newUser;
