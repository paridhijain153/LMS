const authService = require('./auth.service');

// Register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authService.registerUser(name, email, password, role);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };