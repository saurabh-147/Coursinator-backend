const express = require("express");
const router = express.Router();
const examController = require("../../controllers/exam");

const { routes } = require("../routes.json");
const { exam } = routes;

router.post(exam.create, examController.createExam);

router.get(exam.getExam, examController.getExamDetails);

module.exports = router;
