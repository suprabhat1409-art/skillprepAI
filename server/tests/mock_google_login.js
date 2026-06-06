const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillprepai';

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: mongoose.connection.name || undefined });
  console.log('Connected to MongoDB for mock test');

  const fakePayload = {
    sub: 'mock-google-12345',
    email: 'mock.google.test@example.com',
    name: 'Mock Google User',
    picture: 'https://example.com/avatar.png',
    email_verified: true
  };

  const normalizedEmail = String(fakePayload.email).trim().toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });
  if (user) {
    console.log('Existing user found:', user.email);
    if (!user.googleId) {
      user.googleId = fakePayload.sub;
      user.avatar = user.avatar || fakePayload.picture;
      await user.save();
      console.log('Updated user with googleId');
    }
  } else {
    user = await User.create({
      name: fakePayload.name,
      email: normalizedEmail,
      googleId: fakePayload.sub,
      avatar: fakePayload.picture,
      skills: [],
      targetRole: ''
    });
    console.log('Created new user:', user.email);
  }

  const token = jwt.sign({ userId: user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET || 'devsecret123', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

  console.log('\nMock Google login successful. Token and user:');
  console.log('TOKEN:', token);
  console.log('USER:', {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    googleId: user.googleId,
    avatar: user.avatar
  });

  // Cleanup: remove the mock user we created
  // Comment out the next two lines if you want to keep the user
  // await User.deleteOne({ _id: user._id });
  // console.log('Cleaned up mock user');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Mock test failed:', err && err.message ? err.message : err);
  process.exit(1);
});
