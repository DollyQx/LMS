const Module = require('../models/Module');
const Course = require('../models/Course');
const AppError = require('../utils/AppError');

exports.createModule = async (moduleData) => {
  // First evaluate if the parent course actually exists securely
  const parentCourse = await Course.findById(moduleData.courseId);
  if (!parentCourse) {
    throw new AppError('The specified Course ID does not exist', 404);
  }

  try {
    const newModule = await Module.create(moduleData);

    // Push the module reference dynamically into the course array
    parentCourse.modules.push(newModule._id);
    await parentCourse.save({ validateBeforeSave: false });

    return newModule;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('A module with this exact order already exists in this course', 400);
    }
    throw error;
  }
};

exports.getModulesByCourse = async (courseId) => {
  // Ensuring modules are physically ordered by logic sequence defined by Admin
  const modules = await Module.find({ courseId })
    .sort({ order: 1 })
    .populate({
      path: 'lessons',
      select: 'title duration type order',
      options: { sort: { order: 1 } }
    });

  return modules;
};
