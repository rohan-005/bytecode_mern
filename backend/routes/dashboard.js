const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserCourse = require('../models/UserCourse');
const { protect } = require('../middleware/auth');
const { updateDailyStreakAndXP } = require('../utils/streakHelper');
const { getCourseFromFile, isValidCourseId } = require('../utils/courseRegistry');

// @desc    Get dashboard aggregated statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process daily streak and login XP update
    user = await updateDailyStreakAndXP(user);

    // Fetch user enrolled courses and filter out deleted/invalid course IDs
    const userCourses = await UserCourse.find({ user: req.user.id }).sort({ lastAccessed: -1 });
    const validUserCourses = userCourses.filter(c => isValidCourseId(c.courseId));

    const totalCourses = validUserCourses.length;
    const completedCourses = validUserCourses.filter(c => c.completed).length;
    const totalProgress = validUserCourses.reduce((sum, c) => sum + (c.progress || 0), 0);
    const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;

    const completedExercisesCount = user.completedExercises?.length || 0;
    const completedLessonsCount = user.completedLessons?.length || 0;

    // Calculate level
    const xp = user.xp || 0;
    const level = Math.floor(xp / 100) + 1;

    // Build 7-day Weekly XP visualization array
    const now = new Date();
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weeklyXP = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      const dStr = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;

      // Sum exercise and activity XP for that day
      let dayXP = 0;

      if (user.completedExercises) {
        user.completedExercises.forEach(ex => {
          if (ex.completedAt) {
            const exD = new Date(ex.completedAt);
            const exDStr = `${exD.getUTCFullYear()}-${exD.getUTCMonth() + 1}-${exD.getUTCDate()}`;
            if (exDStr === dStr) {
              dayXP += (ex.xpEarned || 20);
            }
          }
        });
      }

      if (user.activities) {
        user.activities.forEach(act => {
          if (act.createdAt) {
            const actD = new Date(act.createdAt);
            const actDStr = `${actD.getUTCFullYear()}-${actD.getUTCMonth() + 1}-${actD.getUTCDate()}`;
            if (actDStr === dStr) {
              dayXP += (act.xpEarned || 0);
            }
          }
        });
      }

      weeklyXP.push({
        day: dayName,
        xp: dayXP,
        height: dayXP > 0 ? `${Math.min(Math.max(dayXP, 20), 100)}%` : '10%'
      });
    }

    // Determine Continue Learning course (most recently accessed)
    let continueLearning = null;
    if (validUserCourses.length > 0) {
      const recentEnrollment = validUserCourses[0];
      const course = await getCourseFromFile(recentEnrollment.courseId);
      if (course) {
        continueLearning = {
          enrollment: recentEnrollment,
          course: {
            id: course.id,
            name: course.name,
            description: course.description,
            level: course.level,
            duration: course.duration,
            image: course.image
          }
        };
      }
    }

    res.json({
      totalXP: xp,
      level,
      streak: user.streak || 1,
      longestStreak: user.longestStreak || 1,
      lastActiveDate: user.lastActiveDate,
      totalCourses,
      completedCourses,
      averageProgress,
      completedExercisesCount,
      completedLessonsCount,
      dailyGoalXP: user.dailyGoalXP || 500,
      todayXP: user.todayXP || 0,
      weeklyXP,
      continueLearning
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get dashboard activity logs
// @route   GET /api/dashboard/activity
// @access  Private
router.get('/activity', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const activities = (user.activities || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching dashboard activity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
