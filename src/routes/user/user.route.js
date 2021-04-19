const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user");
const { routes } = require("../routes.json");

const { user } = routes;
// const multipleUpload = multer({dest:'uploads/'}).array('selectedFiles',12);

router.post(user.signup, userController.signup);

router.post(user.login, userController.login);

router.post(user.updateProfile, userController.updateProfile);

router.post(user.enrollCourse, userController.getUserEnrollInCourse);

module.exports = router;
