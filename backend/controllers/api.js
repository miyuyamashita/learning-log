const Log = require("../models/Log");
const User = require("../models/User");

exports.getLogs = async (req, res, next) => {
  const userId = req.userId;

  const logs = await Log.find({ userId: userId });

  res.json(logs);
};

exports.getLog = (req, res, next) => {
  Log.findById(req.params.logId)
    .then((log) => {
      res.json(log);
    })
    .catch((e) => console.log(e));
};

exports.postLog = async (req, res, next) => {
  try {
    const userId = req.userId;
    const newLog = new Log(req.body);

    const savedLog = await newLog.save();
    const user = await User.findById(userId);
    if (!user) {
      const e = new Error("Authorization failed");
      e.statusCode = 401;
      throw e;
    }
    user.logs.push(savedLog);
    user.save();
    res.status(201).json(savedLog);
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.editLog = async (req, res, next) => {
  try {
    const log = await Log.findById(req.params.logId);

    log.userId = req.userId;
    log.title = req.body.title;
    log.content = req.body.content;
    log.date = req.body.date;
    const savedLog = await log.save();
    res.status(201).json(savedLog);
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.deleteLog = async (req, res, next) => {
  await Log.findOneAndDelete({ _id: req.params.logId });
  console.log("Deleted");
  res.status(200).json();
};
