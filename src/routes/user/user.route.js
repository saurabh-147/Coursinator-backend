const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user");
const { routes } = require('../routes.json');
const { user } = routes;

router.post(user.signup, userController.signup);

router.post(user.login, userController.login);

module.exports = router;
