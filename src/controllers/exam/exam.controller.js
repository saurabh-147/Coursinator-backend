const Exam = require("../../models/exam");
const Question = require("../../models/question");

exports.createExam = async (req, res) => {
  const { exam } = req.body;

  if (!exam.course_id) {
    return res.status(422).json({
      error: "Course id is mandatory",
    });
  }

  if (!exam.num_questions) {
    return res.status(422).json({
      error: "Num of question  is mandatory",
    });
  }

  if (!exam.marks_per_ques) {
    return res.status(422).json({
      error: "Marks Per Question is mandatory",
    });
  }
  if (!exam.passing_marks) {
    return res.status(422).json({
      error: "Passing Marks is mandatory",
    });
  }
  if (!exam.time_allocated) {
    return res.status(422).json({
      error: "Time Allocated is mandatory",
    });
  }

  if (!exam.questions) {
    return res.status(422).json({
      error: "Question is mandatory",
    });
  }

  try {
    let newExam = new Exam(exam.course_id, exam.num_questions, exam.marks_per_ques, exam.passing_marks, exam.time_allocated);

    const examId = await newExam.save();
    console.log(examId);

    for (let i = 0; i < exam.questions.length; i++) {
      const ques = exam.questions[i];
      var newQuestion;
      if (ques.type == "FILLUPS") {
        newQuestion = new Question(ques.statement, ques.answer, ques.type);
      } else {
        newQuestion = new Question(ques.statement, ques.answer, ques.type, ques.options);
      }
      const quesId = newQuestion.save(examId);
      console.log(quesId);
    }

    const courseRef = await db.collection("Courses").doc(exam.course_id);

    newExam = await courseRef.set(
      {
        examSnapshot: {
          exam_id: examId,
          marks_per_ques: newExam.marks_per_ques,
          num_questions: newExam.num_questions,
          passing_marks: newExam.passing_marks,
          time_allocated: newExam.time_allocated,
        },
      },
      { merge: true }
    );

    // newExam = { ...newExam, examId };
    return res.status(200).json({ created: true, exam: newExam });
  } catch (err) {
    return res.status(400).json({ created: false, error: err.message });
  }
};

exports.getExamDetails = async (req, res) => {
  const { examId } = req.params;

  const result = await Exam.get({
    examId: examId,
  });

  res.status(200).json(result);
};
