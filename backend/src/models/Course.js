const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      trim: true,
      maxlength: [100, 'A course title must have less or equal than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'A course must have a description'],
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Course must belong to an instructor'],
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    thumbnail: {
      type: String, // URL
      default: 'default-course.jpg', // Placeholder image URL
    },
    modules: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Module',
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Cascade delete modules when a course is deleted
courseSchema.pre('findOneAndDelete', async function (next) {
  const courseId = this.getQuery()['_id'];
  const Module = mongoose.model('Module');
  const Lesson = mongoose.model('Lesson');
  
  // Find all modules inside the course to be deleted
  const modules = await Module.find({ courseId: courseId });
  const moduleIds = modules.map(m => m._id);

  // Delete all lessons belonging to those modules
  await Lesson.deleteMany({ moduleId: { $in: moduleIds } });

  // Delete the modules themselves
  await Module.deleteMany({ courseId: courseId });
  
  next();
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
