const { db, admin } = require("../utils/db");

class Module {
  constructor(topic, description, duration, content, attachment = null) {
    this.topic = topic;
    this.description = description;
    this.duration = duration;
    this.content = content;
    this.attachment = attachment;
  }
  static async get(conditions) {
    const courseRef = await db.collection("Courses").doc(conditions.courseId).collection("Module").doc(conditions.moduleId);
    const doc = await courseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      return doc.data();
    }
  }
  async save(courseID) {
    if (this.topic === null || this.description === null || this.duration === null || this.content === null) {
      throw new Error("Fields can't be empty");
    } else {
      var courseRef = db.collection("Courses").doc(courseID).collection("Module");

      const module = await courseRef.add({
        name: this.topic,
        description: this.description,
        duration: this.duration,
        content: this.content,
        attachment: this.attachment,
      });

      courseRef = await db.collection("Courses").doc(courseID);

      const res = await courseRef.update({
        moduleSnapshot: admin.firestore.FieldValue.arrayUnion({
          module_id: module.id,
          topic: this.topic,
          description: this.description,
          duration: this.duration,
        }),
      });

      return module.id;
    }
  }
}

module.exports = Module;
