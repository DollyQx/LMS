const courseService = require('../services/courseService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createCourse = asyncHandler(async (req, res, next) => {
  // Pass the data alongside the current Admin's logged-in ID as the Instructor
  const course = await courseService.createCourse(req.body, req.user._id);
  res.status(201).json({ status: 'success', data: { course } });
});

exports.getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await courseService.getAllCourses();
  res.status(200).json({ status: 'success', results: courses.length, data: { courses } });
});

exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await courseService.getCourseById(req.params.id);
  res.status(200).json({ status: 'success', data: { course } });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.status(200).json({ status: 'success', data: { course } });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  await courseService.deleteCourse(req.params.id);
  res.status(204).json({ status: 'success', data: null });
});
