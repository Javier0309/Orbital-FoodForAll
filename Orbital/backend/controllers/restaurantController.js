const Restaurant = require('../models/restaurantModel');

// Edit (create/update) profile
exports.editProfile = async (req, res) => {
  const { name, yearEstablished, about, address, recommendedItems, foodHygieneCertUrl } = req.body;
  const userId = req.user._id; // assuming JWT middleware sets req.user

  try {
    const update = { name, yearEstablished, about, address, recommendedItems, foodHygieneCertUrl };
    const profile = await Restaurant.findOneAndUpdate(
      { userId },
      update,
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// View profile
exports.getProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const profile = await Restaurant.findOne({ userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};