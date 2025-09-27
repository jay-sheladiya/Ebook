const Activity = require('../models/Activity');

const listActivities = async (req, res, next) => {
  try {
    // admin can view all; others see their own
    const filter = (req.user.role === 'admin' && req.query.all === 'true') ? {} : { user: req.user._id };
    const activities = await Activity.find(filter).sort({ createdAt: -1 }).limit(100);
    res.status(200).json(activities);
  } catch (err) { next(err); }
};

module.exports = { listActivities };
