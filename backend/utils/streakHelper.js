const User = require('../models/User');

/**
 * Check and update daily streak & daily login bonus
 * Rules:
 * - If lastActiveDate is same day: keep current streak.
 * - If lastActiveDate is yesterday: streak += 1, update longestStreak, award +5 XP login +10 XP streak bonus, log activity.
 * - If lastActiveDate is older: reset streak = 1, award +5 XP login bonus, log activity.
 */
const updateDailyStreakAndXP = async (user) => {
  const now = new Date();
  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
  
  // Format dates as YYYY-MM-DD for comparison
  const formatDate = (d) => d ? `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}` : '';
  const todayStr = formatDate(now);
  const lastActiveStr = formatDate(lastActive);

  // Check if todayXP needs reset for a new day
  if (user.todayXPDate) {
    const todayXPStr = formatDate(new Date(user.todayXPDate));
    if (todayXPStr !== todayStr) {
      user.todayXP = 0;
      user.todayXPDate = now;
    }
  } else {
    user.todayXP = 0;
    user.todayXPDate = now;
  }

  if (!lastActiveStr) {
    // First time login
    user.streak = 1;
    user.longestStreak = 1;
    user.lastActiveDate = now;
    
    // Award first login bonus
    const loginXP = 5;
    user.xp = (user.xp || 0) + loginXP;
    user.todayXP = (user.todayXP || 0) + loginXP;
    user.level = Math.floor((user.xp || 0) / 100) + 1;
    
    if (!user.activities) user.activities = [];
    user.activities.push({
      type: 'login',
      title: 'First Platform Session',
      description: 'Logged into ByteCode developer platform',
      xpEarned: loginXP,
      createdAt: now
    });

    await user.save();
    return user;
  }

  if (todayStr === lastActiveStr) {
    // Already active today, just update lastActiveDate timestamp
    user.lastActiveDate = now;
    user.level = Math.floor((user.xp || 0) / 100) + 1;
    await user.save();
    return user;
  }

  // Calculate day difference
  const diffTime = Math.abs(now - lastActive);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    // Consecutive day login
    user.streak = (user.streak || 0) + 1;
    user.longestStreak = Math.max(user.longestStreak || 0, user.streak);
    
    const bonusXP = 15; // 5 XP login + 10 XP streak bonus
    user.xp = (user.xp || 0) + bonusXP;
    user.todayXP = (user.todayXP || 0) + bonusXP;
    user.level = Math.floor((user.xp || 0) / 100) + 1;

    if (!user.activities) user.activities = [];
    user.activities.push({
      type: 'streak',
      title: `Daily Streak Extended (${user.streak} Days)`,
      description: `Logged in ${user.streak} consecutive days`,
      xpEarned: bonusXP,
      createdAt: now
    });
  } else {
    // Streak broken, reset to 1
    user.streak = 1;
    const loginXP = 5;
    user.xp = (user.xp || 0) + loginXP;
    user.todayXP = (user.todayXP || 0) + loginXP;
    user.level = Math.floor((user.xp || 0) / 100) + 1;

    if (!user.activities) user.activities = [];
    user.activities.push({
      type: 'login',
      title: 'Daily Login Session',
      description: 'Logged in to continue learning tracks',
      xpEarned: loginXP,
      createdAt: now
    });
  }

  user.lastActiveDate = now;
  await user.save();
  return user;
};

/**
 * Add XP and activity log for a specific event
 */
const addXPAndActivity = async (userId, { type, title, description, xpEarned }) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.xp = (user.xp || 0) + xpEarned;
  user.todayXP = (user.todayXP || 0) + xpEarned;
  user.level = Math.floor((user.xp || 0) / 100) + 1;

  if (!user.activities) user.activities = [];
  user.activities.unshift({
    type,
    title,
    description,
    xpEarned,
    createdAt: new Date()
  });

  // Keep only latest 50 activities
  if (user.activities.length > 50) {
    user.activities = user.activities.slice(0, 50);
  }

  await user.save();
  return user;
};

module.exports = {
  updateDailyStreakAndXP,
  addXPAndActivity
};
