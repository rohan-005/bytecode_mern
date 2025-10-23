const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const UserCourse = require('../models/UserCourse');
const { protect } = require('../middleware/auth'); // Use your existing protect middleware

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
    
    // Check if courses directory exists
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

    // Check if already enrolled
    const existingEnrollment = await UserCourse.findOne({
      user: req.user.id,
      courseId: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
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

// @desc    Get user's enrolled courses with course details
// @route   GET /api/courses/user/enrolled
// @access  Private
router.get('/user/enrolled', protect, async (req, res) => {
  try {
    const userCourses = await UserCourse.find({ user: req.user.id }).sort({ enrolledAt: -1 });
    
    // Get course details for each enrollment
    const enrolledCoursesWithDetails = [];
    for (const enrollment of userCourses) {
      const course = await getCourseFromFile(enrollment.courseId);
      if (course) {
        enrolledCoursesWithDetails.push({
          enrollment,
          course
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

    // Get course to calculate total items
    const course = await getCourseFromFile(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update progress based on completed exercises/lessons
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

    // Calculate overall progress
    const totalItems = course.exercises.length + course.lessons.length;
    const completedItems = userCourse.completedExercises.length + userCourse.completedLessons.length;
    userCourse.progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    
    // Update last accessed
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

module.exports = router;