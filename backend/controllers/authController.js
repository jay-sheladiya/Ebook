const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserFactory = require('../patterns/UserFactory');
const Logger = require('../patterns/Logger');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const userInstance = UserFactory.create({ name, email, password, role });
    const user = await userInstance.save();

    Logger.info(`Registered new user ${user.email}`);
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, email, university, address, password } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.university = university || user.university;
    user.address = address || user.address;
    if (password) user.password = password;
    const updated = await user.save();
    res.json({ id: updated._id, name: updated.name, email: updated.email, university: updated.university, address: updated.address, token: generateToken(updated._id) });
  } catch (err) { next(err); }
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile };
