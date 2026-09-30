const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');

const Certificate = require('../models/Certificate');
const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const AppError = require('../utils/AppError');

// Pure isolated check parsing whether all modules are complete
exports.checkEligibility = async (userId, courseId) => {
  // 1. Fetch exactly how many core structural units sit fundamentally underneath the target course
  const modules = await Module.find({ courseId });
  const moduleIds = modules.map(m => m._id);

  const totalLessonsInCourse = await Lesson.countDocuments({ moduleId: { $in: moduleIds } });

  // 2. Cross-check against the active array length representing what the User has genuinely finished physically
  const progressRecord = await Progress.findOne({ user: userId, course: courseId });

  // Math protection layer for zero division or missing progress
  if (!progressRecord || totalLessonsInCourse === 0) return false;

  // A 1:1 match indicates perfect structural course exhaustion
  if (progressRecord.completedLessons.length >= totalLessonsInCourse) {
    return true;
  }

  return false;
};

exports.generateCertificate = async (user, courseId) => {
  // Database lookup to resolve strict constraints before any computations begin
  const existingCert = await Certificate.findOne({ userId: user._id, courseId });
  if (existingCert) {
    throw new AppError('Certificate already generated for this course!', 400);
  }

  const isEligible = await this.checkEligibility(user._id, courseId);
  if (!isEligible) {
    throw new AppError('User is not eligible to receive this certificate! Course not 100% completed.', 403);
  }

  const courseInfo = await Course.findById(courseId);
  if (!courseInfo) throw new AppError('Invalid Course ID parameters.', 404);

  // Buffer formatting mechanics constructing physical file arrays
  const uniqueUUID = uuidv4();
  const fileName = `cert-${user._id}-${Date.now()}.pdf`;
  
  // Physically target our custom placeholder directory cleanly resolving native node absolute paths
  const absolutePath = path.join(__dirname, '..', 'public', 'certificates', fileName);
  const webAccessiblePath = `/public/certificates/${fileName}`;

  // Execute pdfkit formatting layout dynamically 
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const writeStream = fs.createWriteStream(absolutePath);
  doc.pipe(writeStream);

  // Formatting strings
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke(); // Generic generic boundary
  
  doc.fontSize(40).text('CERTIFICATE OF COMPLETION', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(20).text('This is to certify that solemnly:', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(30).fillColor('#2c3e50').text(user.name, { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(20).fillColor('black').text('has successfully fully finished all internal material logic comprising of', { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(25).fillColor('#2980b9').text(courseInfo.title, { align: 'center' });
  
  doc.moveDown(4);
  doc.fontSize(12).fillColor('black').text(`Date Issues: ${new Date().toLocaleDateString()}`, { align: 'left' });
  doc.text(`Certificate Authentication UUID: ${uniqueUUID}`, { align: 'left' });

  // Seal formatting file output properly
  doc.end();

  // Save the record natively into Document storage strictly binding paths while waiting for Node to flush writing buffer
  await new Promise((resolve) => writeStream.on('finish', resolve));

  const newCertificate = await Certificate.create({
    userId: user._id,
    courseId,
    certificateId: uniqueUUID,
    certificateUrl: webAccessiblePath,
  });

  return newCertificate;
};

exports.getCertificate = async (userId, courseId) => {
  const certificate = await Certificate.findOne({ userId, courseId });
  if (!certificate) {
    throw new AppError('No matching certificate issued for this specific user structure.', 404);
  }
  return certificate;
};
