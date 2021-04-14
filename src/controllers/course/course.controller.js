const Course = require("../../models/course");
const Module = require("../../models/module");
const { uploadFile } = require("../../utils/storageServices");

exports.createCourse = async (req, res) => {
  let { course } = req.body;
  let thumbnail = req.file || null;
  course = JSON.parse(course);
  course.duration = course.durationTime + "-" + course.durationUnit;
  if (!course.name) {
    return res.status(422).json({
      error: "Course name is mandatory",
    });
  }

  if (!course.description) {
    return res.status(422).json({
      error: "Course Description is mandatory",
    });
  }
  if (!course.duration) {
    return res.status(422).json({
      error: "Course duration is mandatory",
    });
  }

  if (!course.moduleList) {
    return res.status(422).json({
      error: "Course Modules is mandatory",
    });
  }

  try {
    if (thumbnail) {
      console.log("uploading thumbnail...");
      thumb_url = await uploadFile("thumbnails", thumbnail.mimetype.split("/")[1], thumbnail.buffer, course.name);
      if (thumb_url) course.thumbnail = thumb_url;
    }
    let newCourse = new Course(course.name, course.description, course.duration, course.thumbnail);
    const courseID = await newCourse.save();

    for (var i = 0; i < course.moduleList.length; i++) {
      const module = course.moduleList[i];
      module.duration = module.durationTime + "-" + module.durationUnit;
      var newModule = new Module(module.name, module.description, module.duration, module.content);
      newModule.save(courseID);
    }
    newCourse = { ...newCourse, courseID };

    return res.status(200).json({ created: true, course: newCourse });
  } catch (err) {
    return res.status(400).json({ created: false, error: err.message });
  }
};

exports.getAllCourses = async (req, res) => {
  const result = await Course.get(req.body.name);
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
