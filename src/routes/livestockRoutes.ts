import { Router } from 'express';
import { 
  getAllLivestock, 
  getLivestockById, 
  createLivestock, 
  updateLivestock, 
  deleteLivestock 
} from '../controllers/livestockController';
import { protect } from '../middleware/auth';

const router = Router();

// Protect all routes - user must be authenticated
router.use(protect);

// @route   GET /api/livestock
// @desc    Get all livestock for logged-in farmer
// @access  Private
router.get('/', getAllLivestock);

// @route   GET /api/livestock/:id
// @desc    Get single livestock by ID
// @access  Private
router.get('/:id', getLivestockById);

// @route   POST /api/livestock
// @desc    Create new livestock
// @access  Private (Farmer only)
router.post('/', createLivestock);

// @route   PUT /api/livestock/:id
// @desc    Update livestock
// @access  Private (Farmer only)
router.put('/:id', updateLivestock);

// @route   DELETE /api/livestock/:id
// @desc    Delete livestock
// @access  Private (Farmer only)
router.delete('/:id', deleteLivestock);

export default router;