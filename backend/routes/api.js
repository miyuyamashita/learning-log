const express = require("express");

const apiController = require("../controllers/api");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/fetchLogs", isAuth, apiController.getLogs);
router.get("/fetchLog/:logId", isAuth, apiController.getLog);

router.post("/postLog", isAuth, apiController.postLog);

router.put("/editLog/:logId", isAuth, apiController.editLog);

router.delete("/deleteLog/:logId", isAuth, apiController.deleteLog);

module.exports = router;
