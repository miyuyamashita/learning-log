const dotenv = require("dotenv").config(); //環境変数を扱う
// const Log = require("../models/Log");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

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
      const e = new Error("Passwords do not match");
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
      throw e;
    }
    res.status(202).json({ message: "new user created" });
  } catch (e) {
    next(e);
  }
};

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

    // req.user = user;

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Login Succeed",
      token: token,
      userId: user._id.toString(),
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.sendResetLink = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    const apiKey = process.env.SENDGRID_API_KEY;
    sgMail.setApiKey(apiKey);
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    const msg = {
      to: email,
      from: "miyuyamashita0708@gmail.com",
      subject: "Change password!",
      text: `Please click link to change password<a href="/auth/getPasswordForm/${token}">Click here to change password</a>`,
      html: `<h1>Please click link to change password</h1>
              <a href="http://localhost:5173/reset-password?token=${token}">Click here to change password</a>
            `,
    };
    await sgMail.send(msg);
    res.status(200).json({ message: "Success to get link" });
  } catch (e) {
    next(e);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newPassword = req.body.password;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findById(userId);
    if (!user) {
      const e = new Error("No user found");
      e.status(402);
      throw e;
    }

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
