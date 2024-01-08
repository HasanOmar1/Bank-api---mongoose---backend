import STATUS_CODE from "../constants/statusCodes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import newUser from "../models/newUserModel.js";
// Creates new user
// Create:  /api/v1/bank
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(404);
      throw new Error("please fill all fields");
    }
    const userExists = await newUser.findOne({ email });
    if (userExists) {
      res.status(404);
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await newUser.create({
      name,
      email,
      password: hashedPassword,
    });
    if (user) {
      res.status(STATUS_CODE.CREATED).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401);
      throw new Error("All fields are required");
    }
    const user = await newUser.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

export const getUserByToken = async (req, res, next) => {
  try {
    if (req.user === null) {
      // res.send("User with this id is not found");
      throw new Error("User with this token is not found");
    }
    const { _id, name, email } = await newUser.findById(req.user._id);
    // console.log(req.user._id);
    res.status(200).send({
      id: _id,
      name,
      email,
    });
  } catch (error) {
    next(error);
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const deleteNewUsers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await newUser.findByIdAndDelete(id);
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No user found with this id");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// Gets all users info
// Get:  /api/v1/bank
export const getNewUsers = async (req, res, next) => {
  try {
    const users = await newUser.find();
    if (users.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("No users in the database");
    }
    res.send(users);
  } catch (error) {
    next(error);
  }
};

// Gets user's info by id
// Get:  /api/v1/bank/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await newUser.find({ id: id });
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not found");
    }
    res.send(user);
  } catch (error) {
    next(error);
  }
};

// extra
// deletes user
// Delete:  /api/v1/bank/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToDelete = await newUser.findOneAndDelete({ id: id });
    if (!userToDelete) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }
    res.send(userToDelete);
  } catch (error) {
    next(error);
  }
};

// extra
// updates user's fields
// PUT:  /api/v1/bank/:id
export const updateUserTest = async (req, res, next) => {
  //   console.log(req.user);
  try {
    // const { id } = req.params;
    const updatedUser = await newUser.findOneAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User with this ID is not found");
    }
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};
