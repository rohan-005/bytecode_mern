const fs = require('fs').promises;
const path = require('path');

const COURSES_DIR = path.join(__dirname, '..', 'courses');

// Official registry of active course IDs matching files in backend/courses/*.json
const VALID_COURSE_IDS = new Set([
  'html-1',
  'html-2',
  'html-3',
  'css-1',
  'css-2',
  'css-3',
  'js-1',
  'js-2',
  'js-3',
  'python-1',
  'python-2',
  'python-3',
  'python-dsa',
  'cpp-1',
  'cpp-2',
  'cpp-3',
  'cpp-dsa'
]);

/**
 * Check if a course ID exists in the official course registry
 */
const isValidCourseId = (courseId) => {
  if (!courseId || typeof courseId !== 'string') return false;
  return VALID_COURSE_IDS.has(courseId.trim().toLowerCase());
};

/**
 * Safely read a course JSON file after validating the courseId against registry
 */
const getCourseFromFile = async (courseId) => {
  if (!isValidCourseId(courseId)) {
    return null;
  }

  try {
    const filePath = path.join(COURSES_DIR, `${courseId.trim().toLowerCase()}.json`);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading course file ${courseId}:`, error);
    }
    return null;
  }
};

/**
 * Get all active courses from the registry
 */
const getAllCourses = async () => {
  try {
    const courses = [];
    for (const courseId of VALID_COURSE_IDS) {
      const course = await getCourseFromFile(courseId);
      if (course) {
        courses.push(course);
      }
    }
    return courses;
  } catch (error) {
    console.error('Error reading course registry:', error);
    return [];
  }
};

module.exports = {
  VALID_COURSE_IDS: Array.from(VALID_COURSE_IDS),
  isValidCourseId,
  getCourseFromFile,
  getAllCourses
};
