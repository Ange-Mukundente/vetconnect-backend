import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone, district, sector, specialty, licenseNumber, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user object based on role
    const userData: any = {
      email,
      password, // Don't hash here - model will handle it
      name,
      role,
      phone
    };

    // Add role-specific fields
    if (role === 'farmer') {
      userData.district = district;
      userData.sector = sector;
    } else if (role === 'veterinarian' || role === 'vet') {
      userData.specialty = specialty;
      userData.licenseNumber = licenseNumber;
      userData.location = location;
    }

    // Save user to DB (password will be hashed by pre-save hook)
    const newUser = await User.create(userData) as IUser;

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id.toString(), email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
          ...(newUser.district && { district: newUser.district }),
          ...(newUser.sector && { sector: newUser.sector }),
          ...(newUser.specialty && { specialty: newUser.specialty }),
          ...(newUser.licenseNumber && { licenseNumber: newUser.licenseNumber }),
          ...(newUser.location && { location: newUser.location })
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email (include password field)
    const user = await User.findOne({ email }).select('+password') as IUser | null;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Use the model's comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
          ...(user.district && { district: user.district }),
          ...(user.sector && { sector: user.sector }),
          ...(user.specialty && { specialty: user.specialty }),
          ...(user.location && { location: user.location }),
          ...(user.rating && { rating: user.rating })
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Logout user (for JWT, this is just client-side removal)
router.post('/logout', async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logout successful. Please remove token from client.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Please include Authorization header with Bearer token.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret'
    ) as { id: string; email: string; role: string };

    // Find user
    const user = await User.findById(decoded.id).select('-password') as IUser | null;
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive' 
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
        ...(user.district && { district: user.district }),
        ...(user.sector && { sector: user.sector }),
        ...(user.specialty && { specialty: user.specialty }),
        ...(user.licenseNumber && { licenseNumber: user.licenseNumber }),
        ...(user.location && { location: user.location }),
        ...(user.rating !== undefined && { rating: user.rating })
      }
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;