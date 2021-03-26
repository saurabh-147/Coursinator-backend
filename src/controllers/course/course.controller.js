const Course = require("../../models/course");
const Module = require("../../models/module");

exports.createCourse = async (req, res) => {
  const courseInfo = req.body;

  if (!courseInfo.name) {
    return res.status(422).json({
      error: "Course name is mandatory",
    });
  }

  if (!courseInfo.description) {
    return res.status(422).json({
      error: "Course Description is mandatory",
    });
  }
  if (!courseInfo.duration) {
    return res.status(422).json({
      error: "Course duration is mandatory",
    });
  }

  if (!courseInfo.modules) {
    return res.status(422).json({
      error: "Course Modules is mandatory",
    });
  }

  try {
    let newCourse = new Course(courseInfo.name, courseInfo.description, courseInfo.duration, courseInfo.thumbanil?.courseInfo.thumbanil);
    const courseID = await newCourse.save();

    for (var i = 0; i < courseInfo.modules.length; i++) {
      const data = courseInfo.modules[i];
      var newModule = new Module(data.name, data.description, data.duration, data.content, data.attachment?.data.attachment);
      newModule.save(courseID);
    }
    newCourse = { ...newCourse, courseID };

    return res.status(200).json({ created: true, course: newCourse });
  } catch (err) {
    return res.status(400).json({ created: false, error: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  const result = await Course.get(req.body.name?.req.body.name);
  return res.status(200).json(result);
};

exports.getAModule = async (req, res) => {
  const { courseId, moduleId } = req.params;

  const result = await Module.get({
    courseId: courseId,
    moduleId: moduleId,
  });

  res.status(200).json(result);
};
