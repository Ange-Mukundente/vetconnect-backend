import { Request, Response, NextFunction } from 'express';
import Livestock from '../models/Livestock';

// @desc    Get all livestock for logged-in farmer
// @route   GET /api/livestock
// @access  Private (Farmer only)
export const getAllLivestock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const livestock = await Livestock.find({ farmerId: req.user?.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: livestock.length,
      data: livestock
    });
  } catch (error: any) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching livestock',
      error: error.message
    });
  }
};

// @desc    Get single livestock by ID
// @route   GET /api/livestock/:id
// @access  Private
export const getLivestockById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const livestock = await Livestock.findById(req.params.id);

    if (!livestock) {
      res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
      return;
    }

    // Make sure user owns the livestock or is a vet
    if (livestock.farmerId.toString() !== req.user?.id && req.user?.role !== 'veterinarian') {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this livestock'
      });
      return;
    }

    res.json({
      success: true,
      data: livestock
    });
  } catch (error: any) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching livestock',
      error: error.message
    });
  }
};

// @desc    Create new livestock
// @route   POST /api/livestock
// @access  Private (Farmer only)
export const createLivestock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, type, breed, age, weight, healthStatus, notes, tagNumber } = req.body;

    const livestock = await Livestock.create({
      farmerId: req.user?.id,
      name,
      type,
      breed,
      age,
      weight,
      healthStatus,
      notes,
      tagNumber
    });

    res.status(201).json({
      success: true,
      message: 'Livestock created successfully',
      data: livestock
    });
  } catch (error: any) {
    console.error('Create livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating livestock',
      error: error.message
    });
  }
};

// @desc    Update livestock
// @route   PUT /api/livestock/:id
// @access  Private (Farmer only)
export const updateLivestock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let livestock = await Livestock.findById(req.params.id);

    if (!livestock) {
      res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
      return;
    }

    // Make sure user owns the livestock
    if (livestock.farmerId.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this livestock'
      });
      return;
    }

    livestock = await Livestock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Livestock updated successfully',
      data: livestock
    });
  } catch (error: any) {
    console.error('Update livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating livestock',
      error: error.message
    });
  }
};

// @desc    Delete livestock
// @route   DELETE /api/livestock/:id
// @access  Private (Farmer only)
export const deleteLivestock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const livestock = await Livestock.findById(req.params.id);

    if (!livestock) {
      res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
      return;
    }

    // Make sure user owns the livestock
    if (livestock.farmerId.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this livestock'
      });
      return;
    }

    await livestock.deleteOne();

    res.json({
      success: true,
      message: 'Livestock deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting livestock',
      error: error.message
    });
  }
};