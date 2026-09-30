const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const AppError = require('../utils/AppError');

exports.createLesson = async (lessonData) => {
  // Validate parent module existence physically first
  const parentModule = await Module.findById(lessonData.moduleId);
  if (!parentModule) {
    throw new AppError('The specified Module ID does not exist', 404);
  }

  try {
    const newLesson = await Lesson.create(lessonData);

    // Push the lesson connection cleanly to the parental module array
    parentModule.lessons.push(newLesson._id);
    await parentModule.save({ validateBeforeSave: false });

    return newLesson;
  } catch (error) {
    // Handling Unique Composite Index Collisions cleanly (same order in exactly same module)
    if (error.code === 11000) {
      throw new AppError('A lesson with this exact order already exists inside this module', 400);
    }
    throw error;
  }
};

exports.getLessonsByModule = async (moduleId) => {
  const lessons = await Lesson.find({ moduleId }).sort({ order: 1 });
  return lessons;
};
