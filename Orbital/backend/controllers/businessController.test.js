import { jest } from '@jest/globals';

// Mock the businessModel dependency before importing the module under test
jest.unstable_mockModule('../models/businessModel.js', () => ({
  default: {
    findByIdAndUpdate: jest.fn()
  }
}));

// Dynamically import after setting up the mock
const { openOrClosed } = await import('./businessController.js');
const businessModel = (await import('../models/businessModel.js')).default;

describe('openOrClosed', () => {
  let req, res;

  beforeEach(() => {
    // Mock request and response objects
    req = {
      body: {
        businessId: '60c72b2f5f1b2c001c8d1234', // Valid MongoDB ObjectId string
        isOpen: true
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    // Clear mocks
    businessModel.findByIdAndUpdate.mockClear();
    res.status.mockClear();
    res.json.mockClear();
  });

  it('should return 400 for invalid businessId', async () => {
    req.body.businessId = 'invalid-id';
    await openOrClosed(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid businessId" });
  });

  it('should update business isOpen status and return success', async () => {
    businessModel.findByIdAndUpdate.mockResolvedValueOnce({});
    await openOrClosed(req, res);

    expect(businessModel.findByIdAndUpdate).toHaveBeenCalledWith('60c72b2f5f1b2c001c8d1234', { isOpen: true });
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Shop is now open' });
  });

  it('should handle errors and return failure', async () => {
    businessModel.findByIdAndUpdate.mockRejectedValueOnce(new Error('DB Error'));
    await openOrClosed(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Failed to update shop status' });
  });
});