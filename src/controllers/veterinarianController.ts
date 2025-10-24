import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// @desc    Get all veterinarians
// @route   GET /api/veterinarians
// @access  Public
export const getAllVeterinarians = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { district, specialty, search } = req.query;

    // Build query
    const query: any = { role: 'veterinarian', isActive: true };

    if (district) {
      query.location = new RegExp(district as string, 'i');
    }

    if (specialty) {
      query.specialty = new RegExp(specialty as string, 'i');
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search as string, 'i') },
        { specialty: new RegExp(search as string, 'i') },
        { location: new RegExp(search as string, 'i') }
      ];
    }

    const veterinarians = await User.find(query)
      .select('-password')
      .sort({ rating: -1, name: 1 });

    res.json({
      success: true,
      count: veterinarians.length,
      data: veterinarians
    });
  } catch (error: any) {
    console.error('Get veterinarians error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching veterinarians',
      error: error.message
    });
  }
};

// @desc    Get single veterinarian by ID
// @route   GET /api/veterinarians/:id
// @access  Public
export const getVeterinarianById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const veterinarian = await User.findById(req.params.id).select('-password');

    if (!veterinarian || veterinarian.role !== 'veterinarian') {
      res.status(404).json({
        success: false,
        message: 'Veterinarian not found'
      });
      return;
    }

    res.json({
      success: true,
      data: veterinarian
    });
  } catch (error: any) {
    console.error('Get veterinarian error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching veterinarian',
      error: error.message
    });
  }
};

// @desc    Get list of all specialties
// @route   GET /api/veterinarians/specialties/list
// @access  Public
export const getSpecialties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const specialties = await User.distinct('specialty', { 
      role: 'veterinarian', 
      isActive: true 
    });

    res.json({
      success: true,
      data: specialties.filter(s => s) // Remove null/undefined
    });
  } catch (error: any) {
    console.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching specialties',
      error: error.message
    });
  }
};

// @desc    Get list of all locations
// @route   GET /api/veterinarians/locations/list
// @access  Public
export const getLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await User.distinct('location', { 
      role: 'veterinarian', 
      isActive: true 
    });

    res.json({
      success: true,
      data: locations.filter(l => l) // Remove null/undefined
    });
  } catch (error: any) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching locations',
      error: error.message
    });
  }
};