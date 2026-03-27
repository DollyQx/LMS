const certificateService = require('../services/certificateService');
const asyncHandler = require('../middleware/asyncHandler');

exports.generateCertificate = asyncHandler(async (req, res, next) => {
  const { courseId } = req.body;
  // Deep-bind req.user originating from `authMiddleware.js`
  const certificate = await certificateService.generateCertificate(req.user, courseId);

  res.status(201).json({
    status: 'success',
    message: 'Certificate Successfully Printed and Signed!',
    data: { certificate },
  });
});

exports.getCertificate = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const certificate = await certificateService.getCertificate(req.user._id, courseId);

  res.status(200).json({
    status: 'success',
    data: { certificate },
  });
});
