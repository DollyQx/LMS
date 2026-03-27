const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A module must have a title'],
      trim: true,
    },
    order: {
      type: Number,
      required: [true, 'A module must have an order for sequencing'],
    },
    courseId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Module must belong to a course'],
    },
    lessons: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Lesson',
      },
    ],
  },
  { timestamps: true }
);

// Unique index to ensure that order is unique per course
moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

// Cascade delete lessons when a module is deleted
moduleSchema.pre('findOneAndDelete', async function (next) {
  const moduleId = this.getQuery()['_id'];
  const Lesson = mongoose.model('Lesson');
  await Lesson.deleteMany({ moduleId: moduleId });
  next();
});

const Module = mongoose.model('Module', moduleSchema);
module.exports = Module;
