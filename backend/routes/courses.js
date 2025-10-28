const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const UserCourse = require('../models/UserCourse');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

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

// Helper function to get all courses
const getAllCourses = async () => {
  try {
    const coursesDir = path.join(__dirname, '..', 'courses');
    
    try {
      await fs.access(coursesDir);
    } catch (error) {
      console.error('Courses directory does not exist:', coursesDir);
      return [];
    }
    
    const files = await fs.readdir(coursesDir);
    
    const courses = [];
    for (const file of files) {
      if (file.endsWith('.json')) {
        const courseId = file.replace('.json', '');
        const course = await getCourseFromFile(courseId);
        if (course) {
          courses.push(course);
        }
      }
    }
    
    return courses;
  } catch (error) {
    console.error('Error reading courses directory:', error);
    return [];
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await getCourseFromFile(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await getCourseFromFile(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await UserCourse.findOne({
      user: req.user.id,
      courseId: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const userCourse = await UserCourse.create({
      user: req.user.id,
      courseId: courseId
    });

    res.status(201).json({
      message: 'Successfully enrolled in course!',
      course: course,
      enrollment: userCourse
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's enrolled courses with course details - FIXED VERSION
// @route   GET /api/courses/user/enrolled
// @access  Private
router.get('/user/enrolled', protect, async (req, res) => {
  try {
    const userCourses = await UserCourse.find({ user: req.user.id }).sort({ enrolledAt: -1 });
    
    const enrolledCoursesWithDetails = [];
    for (const enrollment of userCourses) {
      const course = await getCourseFromFile(enrollment.courseId);
      if (course) {
        enrolledCoursesWithDetails.push({
          enrollment: {
            _id: enrollment._id.toString(),
            courseId: enrollment.courseId,
            progress: enrollment.progress,
            enrolledAt: enrollment.enrolledAt,
            completed: enrollment.completed,
            completedExercises: enrollment.completedExercises || [],
            completedLessons: enrollment.completedLessons || [],
            lastAccessed: enrollment.lastAccessed
          },
          course: {
            id: course.id,
            name: course.name,
            description: course.description,
            level: course.level,
            duration: course.duration,
            instructor: course.instructor,
            image: course.image,
            category: course.category
          }
        });
      }
    }

    res.json(enrolledCoursesWithDetails);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { exerciseId, lessonId, completed } = req.body;
    const courseId = req.params.id;

    const userCourse = await UserCourse.findOne({
      user: req.user.id,
      courseId: courseId
    });

    if (!userCourse) {
      return res.status(404).json({ message: 'Not enrolled in this course' });
    }

    const course = await getCourseFromFile(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (exerciseId && completed) {
      const exerciseExists = userCourse.completedExercises.find(
        ex => ex.exerciseId === exerciseId
      );
      if (!exerciseExists) {
        userCourse.completedExercises.push({
          exerciseId,
          completedAt: new Date()
        });
      }
    }

    if (lessonId && completed) {
      const lessonExists = userCourse.completedLessons.find(
        lesson => lesson.lessonId === lessonId
      );
      if (!lessonExists) {
        userCourse.completedLessons.push({
          lessonId,
          completedAt: new Date()
        });
      }
    }

    const totalItems = course.exercises.length + course.lessons.length;
    const completedItems = userCourse.completedExercises.length + userCourse.completedLessons.length;
    userCourse.progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    userCourse.lastAccessed = new Date();
    await userCourse.save();

    res.json({
      progress: userCourse.progress,
      completedExercises: userCourse.completedExercises,
      completedLessons: userCourse.completedLessons
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user stats
// @route   GET /api/courses/user/stats
// @access  Private
router.get('/user/stats', protect, async (req, res) => {
  try {
    const userCourses = await UserCourse.find({ user: req.user.id });
    
    const totalCourses = userCourses.length;
    const completedCourses = userCourses.filter(course => course.completed).length;
    const totalProgress = userCourses.reduce((sum, course) => sum + course.progress, 0);
    const averageProgress = totalCourses > 0 ? totalProgress / totalCourses : 0;
    
    // Calculate total hours (estimate based on progress and course duration)
    let totalHours = 0;
    for (const enrollment of userCourses) {
      const course = await getCourseFromFile(enrollment.courseId);
      if (course && course.duration) {
        const weeksMatch = course.duration.match(/(\d+)\s*weeks?/);
        if (weeksMatch) {
          const weeks = parseInt(weeksMatch[1]);
          // Estimate 5 hours per week
          totalHours += weeks * 5 * (enrollment.progress / 100);
        }
      }
    }

    res.json({
      totalCourses,
      completedCourses,
      averageProgress: Math.round(averageProgress),
      totalHours: Math.round(totalHours),
      enrolledCourses: totalCourses
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Search courses
// @route   GET /api/courses/search/:query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toLowerCase();
    const allCourses = await getAllCourses();
    
    const filteredCourses = allCourses.filter(course => 
      course.name.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(query))) ||
      course.category.toLowerCase().includes(query)
    );

    res.json(filteredCourses);
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/:id/rate', protect, async (req, res) => {
  try {
    const { rating } = req.body;
    const courseId = req.params.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize if doesn't exist
    if (!user.courseRatings) {
      user.courseRatings = new Map();
    }
    
    user.courseRatings.set(courseId, rating);
    await user.save();

    res.json({ 
      message: 'Rating submitted successfully', 
      rating,
      courseId 
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get user's rating for a course
// @route   GET /api/courses/:id/rating
// @access  Private
router.get('/:id/rating', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const rating = user.courseRatings?.get(req.params.id) || 0;
    res.json({ rating });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;