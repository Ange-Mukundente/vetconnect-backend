import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Generate JWT Token
const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone, phoneNumber, location, district, sector, specialty, licenseNumber } = req.body;

    // Use either phone or phoneNumber (for compatibility)
    const userPhone = phone || phoneNumber;

    // Validate required fields
    if (!name || !email || !password || !userPhone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, password, phone)',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user data object
    const userData: any = {
      name,
      email,
      password,
      role: role || 'farmer',
      phone: userPhone,
    };

    // Add role-specific fields
    if (userData.role === 'farmer') {
      if (district) userData.district = district;
      if (sector) userData.sector = sector;
      if (location) userData.location = location;
    }

    if (userData.role === 'veterinarian' || userData.role === 'vet') {
      if (specialty) userData.specialty = specialty;
      if (licenseNumber) userData.licenseNumber = licenseNumber;
      if (location) userData.location = location;
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          phoneNumber: user.phone, // For compatibility
          location: user.location,
          district: user.district,
          sector: user.sector,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user (password is not selected by default, so we need to explicitly include it)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password using the model method
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          phoneNumber: user.phone, // For compatibility
          location: user.location,
          district: user.district,
          sector: user.sector,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        phoneNumber: user.phone, // For compatibility
        location: user.location,
        district: user.district,
        sector: user.sector,
        specialty: user.specialty,
        licenseNumber: user.licenseNumber,
        rating: user.rating,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};