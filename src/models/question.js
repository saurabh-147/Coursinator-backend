const { db } = require("../utils/db");

class Question {
  constructor(statement, answer, type, options = null) {
    this.statement = statement;
    this.answer = answer;
    this.type = type;
    this.options = options;
  }
  static async get(conditions) {
    const quesRef = await db.collection("Exams").doc(conditions.examId).collection("Question").doc(conditions.questionId);
    const doc = await quesRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      return doc.data();
    }
  }
  async save(examId) {
    if (this.statement === null || this.answer === null || this.type === null) {
      throw new Error("Fields can't be empty");
    } else {
      var examRef = db.collection("Exams").doc(examId).collection("Question");

      const question = await examRef.add({
        statement: this.statement,
        answer: this.answer,
        type: this.type,
        options: this.options,
      });

      return question.id;
    }
  }
}

module.exports = Question;
