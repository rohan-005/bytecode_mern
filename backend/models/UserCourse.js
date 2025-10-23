const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedExercises: [{
    exerciseId: String,
    completedAt: Date
  }],
  completedLessons: [{
    lessonId: String,
    completedAt: Date
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure user can't enroll in same course multiple times
userCourseSchema.index({ user: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('UserCourse', userCourseSchema);