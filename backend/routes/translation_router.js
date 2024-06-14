const express = require("express");
const router = express.Router();
const translate_controller = require("../controllers/translation_controller.js");
const video_controller = require("../controllers/video_controller.js");

router.post("/text", translate_controller.translate_text);
router.post("/signwriting", translate_controller.translate_signwriting);
router.post("/sound", translate_controller.translate_sound);
router.post("/all_translations", translate_controller.translate_all);
router.post("/video", video_controller.combine_video);

module.exports = router;
