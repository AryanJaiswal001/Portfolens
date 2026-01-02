import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/password.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Provide missing credentails (email,name or password)",
        token: null,
        user: null,
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
        token: null,
        user: null,
      });
    }

    //Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
        token: null,
        user: null,
      });
    }

    //Hash password
    const hashedPassword = await hashPassword(password);

    //Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: "local",
    });

    //Generate token
    const token = generateToken(user._id);

    //Return user without password - standardized response contract
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Register error", error.message);

    //Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
        token: null,
        user: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      token: null,
      user: null,
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
        token: null,
        user: null,
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        token: null,
        user: null,
      });
    }

    // Check if user registered via OAuth (no password)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google login. Please sign in with Google.",
        token: null,
        user: null,
      });
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        token: null,
        user: null,
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Standardized response contract
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      token: null,
      user: null,
    });
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get me error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });
    }

    //Get user with password
    const user = await User.findById(req.user._id).select("+password");

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Cannot change password for OAuth account",
      });
    }

    //Verify current password
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    //Hash and save new password
    user.password = await hashPassword(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error", error.message);
    return res.status(500).json({
      success: false,
      message: "Error changing password",
    });
  }
};

/**
 * @desc    Mark onboarding as complete
 * @route   PUT /api/auth/onboarding/complete
 * @access  Private
 */
export const completeOnboarding = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { onboardingComplete: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Onboarding completed",
      data: { user },
    });
  } catch (error) {
    console.error("Complete onboarding error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error completing onboarding",
    });
  }
};
