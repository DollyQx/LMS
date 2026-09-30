const lessonService = require('../services/lessonService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createLesson = asyncHandler(async (req, res, next) => {
  const newLesson = await lessonService.createLesson(req.body);
  res.status(201).json({ status: 'success', data: { lesson: newLesson } });
});

exports.getLessonsForModule = asyncHandler(async (req, res, next) => {
  const lessons = await lessonService.getLessonsByModule(req.params.moduleId);
  res.status(200).json({ status: 'success', results: lessons.length, data: { lessons } });
});
