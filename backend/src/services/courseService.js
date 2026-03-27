const Course = require('../models/Course');
const AppError = require('../utils/AppError');

exports.createCourse = async (courseData, instructorId) => {
  const newCourse = await Course.create({ ...courseData, instructor: instructorId });
  return newCourse;
};

exports.getAllCourses = async () => {
  // Return courses with modules and instructor populated cleanly
  return await Course.find()
    .populate('instructor', 'name email')
    .populate({
      path: 'modules',
      select: 'title order',
      options: { sort: { order: 1 } }
    });
};

exports.getCourseById = async (id) => {
  const course = await Course.findById(id)
    .populate('instructor', 'name email')
    .populate({
      path: 'modules',
      select: 'title order',
      populate: {
        path: 'lessons',
        select: 'title type duration order',
        options: { sort: { order: 1 } }
      },
      options: { sort: { order: 1 } }
    });

  if (!course) {
    throw new AppError('No course found with that ID', 404);
  }
  return course;
};

exports.updateCourse = async (id, updateData) => {
  const course = await Course.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    throw new AppError('No course found with that ID', 404);
  }
  return course;
};

exports.deleteCourse = async (id) => {
  // Using findOneAndDelete to trigger Mongoose Document middleware hook correctly!
  const course = await Course.findOneAndDelete({ _id: id });
  
  if (!course) {
    throw new AppError('No course found with that ID', 404);
  }
  return null;
};
