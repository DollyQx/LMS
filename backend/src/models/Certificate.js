const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Certificate must strictly belong to a User'],
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'A Certificate must be linked to a Course'],
    },
    certificateId: {
      type: String,
      required: [true, 'A unique globally tracked UUID is required'],
      unique: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    certificateUrl: {
      type: String,
      required: [true, 'Physical PDF Link Path is required'],
    },
  },
  { timestamps: true }
);

// STRICT Validation to dynamically block users from re-generating multiple certificates for the same course!
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
module.exports = Certificate;
