const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A lesson must have a title'],
      trim: true,
    },
    moduleId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Module',
      required: [true, 'Lesson must belong to a module'],
    },
    type: {
      type: String,
      enum: ['video', 'pdf', 'text', 'quiz'],
      required: [true, 'Lesson must have a type defined'],
    },
    content: {
      type: String,
      required: [true, 'Lesson must contain content URL or Text string'],
    },
    duration: {
      type: Number, // Stored in minutes/seconds logically by frontend
      default: 0,
    },
    order: {
      type: Number,
      required: [true, 'Lesson must have an order sequence assigned'],
    },
  },
  { timestamps: true }
);

// Ensure that a numbering/order is unique per module
lessonSchema.index({ moduleId: 1, order: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;
