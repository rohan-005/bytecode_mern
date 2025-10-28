const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserCourse = require('../models/UserCourse');
const { protect } = require('../middleware/auth');
const fs = require('fs').promises;
const path = require('path');

// Helper function to read course from JSON file
const getCourseFromFile = async (courseId) => {
  try {
    const filePath = path.join(__dirname, '..', 'courses', `${courseId}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading course file ${courseId}:`, error);
    return null;
  }
};

// Get user progress for a course
router.get('/:courseId/progress', protect, async (req, res) => {
  try {
    const userCourse = await UserCourse.findOne({
      user: req.user.id,
      courseId: req.params.courseId
    });

    if (!userCourse) {
      return res.status(404).json({ message: 'Course not found or not enrolled' });
    }

    res.json(userCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark exercise as completed
router.post('/:courseId/exercises/:exerciseId/complete', protect, async (req, res) => {
  try {
    const { courseId, exerciseId } = req.params;
    const user = await User.findById(req.user.id);
    
    // Check if already completed
    const alreadyCompleted = user.completedExercises?.find(
      ex => ex.courseId === courseId && ex.exerciseId === exerciseId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Exercise already completed' });
    }

    // Get course data to calculate XP
    const courseData = await getCourseFromFile(courseId);
    if (!courseData) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const exercise = courseData.exercises.find(ex => ex.id === exerciseId);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    let xpEarned = 0;
    switch (exercise.difficulty?.toLowerCase()) {
      case 'easy': xpEarned = 10; break;
      case 'medium': xpEarned = 25; break;
      case 'hard': xpEarned = 50; break;
      default: xpEarned = 10;
    }

    // Update user XP and level
    user.xp = (user.xp || 0) + xpEarned;
    user.level = Math.floor((user.xp || 0) / 100) + 1;
    
    if (!user.completedExercises) user.completedExercises = [];
    user.completedExercises.push({
      courseId,
      exerciseId,
      xpEarned,
      completedAt: new Date()
    });

    // Update course progress
    let userCourse = await UserCourse.findOne({
      user: req.user.id,
      courseId
    });

    if (!userCourse) {
      userCourse = new UserCourse({
        user: req.user.id,
        courseId,
        completedExercises: [],
        completedLessons: []
      });
    }

    if (!userCourse.completedExercises) userCourse.completedExercises = [];
    
    // Check if exercise already completed in this course
    const exerciseExists = userCourse.completedExercises.find(
      ex => ex.exerciseId === exerciseId
    );
    
    if (!exerciseExists) {
      userCourse.completedExercises.push({
        exerciseId,
        completedAt: new Date(),
        xpEarned
      });
    }

    // Calculate progress percentage
    const totalExercises = courseData.exercises.length;
    const completedCount = userCourse.completedExercises.length;
    userCourse.progress = Math.round((completedCount / totalExercises) * 100);

    if (userCourse.progress === 100) {
      userCourse.completed = true;
    }

    userCourse.lastAccessed = new Date();

    await user.save();
    await userCourse.save();

    res.json({
      message: 'Exercise completed!',
      xpEarned,
      totalXP: user.xp,
      level: user.level,
      progress: userCourse.progress
    });
  } catch (error) {
    console.error('Error completing exercise:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mark lesson as completed
router.post('/:courseId/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const user = await User.findById(req.user.id);

    // Check if already completed
    const alreadyCompleted = user.completedLessons?.find(
      lesson => lesson.courseId === courseId && lesson.lessonId === lessonId
    );

    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Lesson already completed' });
    }

    // Update user
    if (!user.completedLessons) user.completedLessons = [];
    user.completedLessons.push({
      courseId,
      lessonId,
      completedAt: new Date()
    });

    // Update course progress
    let userCourse = await UserCourse.findOne({
      user: req.user.id,
      courseId
    });

    if (!userCourse) {
      userCourse = new UserCourse({
        user: req.user.id,
        courseId,
        completedExercises: [],
        completedLessons: []
      });
    }

    if (!userCourse.completedLessons) userCourse.completedLessons = [];
    
    const lessonExists = userCourse.completedLessons.find(
      lesson => lesson.lessonId === lessonId
    );
    
    if (!lessonExists) {
      userCourse.completedLessons.push({
        lessonId,
        completedAt: new Date()
      });
    }

    userCourse.lastAccessed = new Date();
    
    await user.save();
    await userCourse.save();

    res.json({ message: 'Lesson completed!' });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userCourses = await UserCourse.find({ user: req.user.id });

    const stats = {
      totalXP: user.xp || 0,
      level: user.level || 1,
      completedExercises: user.completedExercises?.length || 0,
      completedLessons: user.completedLessons?.length || 0,
      enrolledCourses: userCourses.length,
      completedCourses: userCourses.filter(course => course.completed).length
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;