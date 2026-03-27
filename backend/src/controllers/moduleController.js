const moduleService = require('../services/moduleService');
const asyncHandler = require('../middleware/asyncHandler');

exports.createModule = asyncHandler(async (req, res, next) => {
  const newModule = await moduleService.createModule(req.body);
  res.status(201).json({ status: 'success', data: { module: newModule } });
});

exports.getModulesForCourse = asyncHandler(async (req, res, next) => {
  const modules = await moduleService.getModulesByCourse(req.params.courseId);
  res.status(200).json({ status: 'success', results: modules.length, data: { modules } });
});
