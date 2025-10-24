import { Request, Response, NextFunction } from 'express';
import Appointment from '../models/Appointment';
import Livestock from '../models/Livestock';
import User from '../models/User';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAllAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let appointments;

    if (req.user?.role === 'farmer') {
      appointments = await Appointment.find({ farmerId: req.user.id }).sort({ date: -1, time: 1 });
    } else if (req.user?.role === 'veterinarian') {
      appointments = await Appointment.find({ vetId: req.user.id }).sort({ date: -1, time: 1 });
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error: any) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    // Make sure user is either the farmer or the vet
    if (appointment.farmerId.toString() !== req.user?.id && appointment.vetId.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to access this appointment'
      });
      return;
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error: any) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Farmer only)
export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role !== 'farmer') {
      res.status(403).json({
        success: false,
        message: 'Only farmers can book appointments'
      });
      return;
    }

    const { livestockId, vetId, date, time, reason, notes, location } = req.body;

    // Verify livestock belongs to farmer
    const livestock = await Livestock.findById(livestockId);
    if (!livestock) {
      res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
      return;
    }

    if (livestock.farmerId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to book appointment for this livestock'
      });
      return;
    }

    // Verify veterinarian exists
    const vet = await User.findById(vetId);
    if (!vet || vet.role !== 'veterinarian') {
      res.status(404).json({
        success: false,
        message: 'Veterinarian not found'
      });
      return;
    }

    // Get farmer details
    const farmer = await User.findById(req.user.id);

    // Create appointment
    const appointment = await Appointment.create({
      farmerId: req.user.id,
      farmerName: farmer?.name,
      farmerPhone: farmer?.phone,
      vetId: vet._id,
      vetName: vet.name,
      vetSpecialty: vet.specialty,
      vetPhone: vet.phone,
      vetEmail: vet.email,
      livestockId: livestock._id,
      livestockName: livestock.name,
      livestockType: livestock.type,
      date,
      time,
      reason,
      notes,
      location: location || vet.location,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    // Check authorization
    const isFarmer = appointment.farmerId.toString() === req.user?.id;
    const isVet = appointment.vetId.toString() === req.user?.id;

    if (!isFarmer && !isVet) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to update this appointment'
      });
      return;
    }

    // Farmers can only update notes and cancel
    if (isFarmer && req.user?.role === 'farmer') {
      const allowedUpdates = ['notes', 'status'];
      const updates = Object.keys(req.body);
      const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

      if (!isValidUpdate || (req.body.status && req.body.status !== 'cancelled')) {
        res.status(400).json({
          success: false,
          message: 'Farmers can only update notes or cancel appointments'
        });
        return;
      }
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

// @desc    Confirm appointment (Vet only)
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Vet only)
export const confirmAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role !== 'veterinarian') {
      res.status(403).json({
        success: false,
        message: 'Only veterinarians can confirm appointments'
      });
      return;
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    if (appointment.vetId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to confirm this appointment'
      });
      return;
    }

    appointment.status = 'confirmed';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment confirmed successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirming appointment',
      error: error.message
    });
  }
};

// @desc    Complete appointment (Vet only)
// @route   PUT /api/appointments/:id/complete
// @access  Private (Vet only)
export const completeAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user?.role !== 'veterinarian') {
      res.status(403).json({
        success: false,
        message: 'Only veterinarians can complete appointments'
      });
      return;
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    if (appointment.vetId.toString() !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to complete this appointment'
      });
      return;
    }

    const { diagnosis, treatment, medications, followUpDate } = req.body;

    appointment.status = 'completed';
    appointment.diagnosis = diagnosis;
    appointment.treatment = treatment;
    appointment.medications = medications;
    appointment.followUpDate = followUpDate;

    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      data: appointment
    });
  } catch (error: any) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing appointment',
      error: error.message
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
      return;
    }

    // Only farmer or vet can delete
    if (appointment.farmerId.toString() !== req.user?.id && appointment.vetId.toString() !== req.user?.id) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this appointment'
      });
      return;
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
};