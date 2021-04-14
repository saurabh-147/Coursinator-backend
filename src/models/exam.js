const { db } = require("../utils/db");

class Exam {
  constructor(course_id, num_questions, marks_per_ques, passing_marks, time_allocated) {
    this.course_id = course_id;
    this.num_questions = num_questions;
    this.marks_per_ques = marks_per_ques;
    this.passing_marks = passing_marks;
    this.time_allocated = time_allocated;
  }

  static async get(conditions = null) {
    const examRef = await db.collection("Exams").doc(conditions.examId);
    const doc = await examRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      return doc.data();
    }
  }

  async save() {
    if (this.course_id === null || this.num_questions === null || this.marks_per_ques == null || this.passing_marks === null || this.time_allocated === null) {
      throw new Error("Field's can't be empty");
    }
    const exam = await db.collection("Exams").add({
      course_id: this.course_id,
      num_questions: this.num_questions,
      marks_per_ques: this.marks_per_ques,
      passing_marks: this.passing_marks,
      time_allocated: this.time_allocated,
    });

    return exam.id;
  }

  toJSON() {
    return {
      course_id: this.course_id,
      num_question: this.num_questions,
      marks_per_ques: this.marks_per_ques,
      passing_marks: this.passing_marks,
      time_allocated: this.time_allocated,
    };
  }
}

module.exports = Exam;
