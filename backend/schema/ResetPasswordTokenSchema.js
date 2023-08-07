import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '10m', // The token will automatically be deleted after 1 hour
    },
  });
  
  // Create the password reset token model
  const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetSchema);

  export default PasswordResetToken