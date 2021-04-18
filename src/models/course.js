const { db } = require("../utils/db");

class Course {
  constructor(name, description, duration,author, thumbnail = null) {
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.author = author
    this.thumbnail = thumbnail;
  }

  static async get(conditions = null) {
    let query;
    console.log(conditions);

    if (conditions === null) {
      query =  db.collection("Courses");
    } else {
      query =  query.where("name", "==", conditions.name);
    }

    var allCourses = [];
    let doc = await query.get();

    doc.forEach((d) => {
      allCourses.push({ id: d.id, ...d.data() });
    });
    return allCourses;
  }

  async save() {
    if (this.name === null || this.description === null || this.duration === null) {
      throw new Error("Fields can't be empty");
    } else {
      const course = await db.collection("Courses").add({
        name: this.name,
        description: this.description,
        duration: this.duration,
        thumbnail: this.thumbnail,
        author:this.author
      });

      return course.id;
    }
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      duration: this.duration,
      thumbnail: this.thumbnail,
      author:this.author
    };
  }
}

module.exports = Course;
