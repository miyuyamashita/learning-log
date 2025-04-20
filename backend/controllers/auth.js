// const Log = require("../models/Log");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv").config(); //環境変数を扱う

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      const e = new Error("Please signup");
      e.statusCode = 401;
      throw e;
    }

    const isAuthed = await bcrypt.compare(password, user.password);

    if (!isAuthed) {
      const e = new Error("wrong password");
      e.statusCode = 401;
      throw e;
    }

    req.user = user;

    const token = jwt.sign({ userId: user._id.toString() }, "secretPayLoad", {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login Succeed", token: token });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const e = new Error("Pick another email or login");
      e.statusCode = 422; //not valid input
      throw e;
    }
    if (password !== confirmPassword) {
      const e = new Error("Password does not match");
      e.statusCode = 422; //not valid input
      throw e;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email: email,
      password: hashedPassword,
      logs: [],
    });
    const savedUser = await user.save();
    if (!savedUser) {
      const e = new Error("Create user failed");
      e.statusCode = 500;
      throw e;
    }
    res.status(202).json({ message: "new user created" });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findById(userId);
    user.password = hashedPassword;
    user.save();
    res.status(202).json({ message: "updated password" });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.sendResetLink = (req, res, next) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(apiKey);
};
