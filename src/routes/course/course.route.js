const express = require("express");
const router = express.Router();
const courseController = require("../../controllers/course");
const { routes } = require("../routes.json");
const { course } = routes;

router.post(course.create, courseController.createCourse);

router.get(course.courses, courseController.getAllCourses);

router.get(course.getModule, courseController.getAModule);

module.exports = router;
