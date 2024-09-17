const express = require("express");
const router = express.Router();
const evaluation_controller = require("../controllers/evaluation_controller.js");

router.post("/calculate", evaluation_controller.calculate_evaluation);

module.exports = router;
