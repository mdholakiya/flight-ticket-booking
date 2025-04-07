import { Response } from 'express';
import User from '../../models/user.js';
import { AuthRequest, UpdateProfileRequest } from '../../types/request.js';
import { sendOTPEmail } from '../../utils/nodeMailer.js';
import { generateOTP } from '../../utils/otp.js';
import crypto from 'crypto';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    console.log('User ID from token:', userId); // Debug log
    
    if (!userId) {
      console.log('No user ID found in request'); // Debug log
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    console.log('Database query result:', user); // Debug log
    
    if (!user) {
      console.log('User not found in database'); // Debug log
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name
    };
    
    console.log('Returning user data:', userData); // Debug log
    res.json(userData);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ 
      message: 'Error fetching profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateProfile = async (req: UpdateProfileRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, email,otp} = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if(otp){
      if(otp !== user.otp){
        res.status(400).json({ message: 'Invalid OTP' });
        return;
      }
    }
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const requestProfileUpdateOTP = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    console.log('OTP Expiry:', otpExpiry);

    // Save OTP to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    console.log('OTP saved to database for user:', user.email);

    // Send OTP via email
    await sendOTPEmail(user.name, user.email, otp);
    console.log('OTP sent successfully to:', user.email);

    res.json({ 
      OTP: otp,
      message: 'OTP sent successfully',
      email: user.email // Include email in response for verification
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    res.status(500).json({ 
      message: 'Error sending OTP',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const verifyOTPAndUpdateProfile = async (req: UpdateProfileRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, email, otp } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Verifying OTP for user:', user.email);
    console.log('Stored OTP:', user.otp);
    console.log('Stored OTP Expiry:', user.otpExpiry);

    // Check if OTP was ever requested
    if (!user.otp || !user.otpExpiry) {
      console.log('No OTP found for user:', user.email);
      res.status(400).json({ 
        message: 'No OTP requested. Please request an OTP first.',
        code: 'OTP_NOT_REQUESTED'
      });
      return;
    }

    // Check if OTP is expired
    const currentTime = new Date();
    if (user.otpExpiry < currentTime) {
      console.log('OTP expired for user:', user.email);
      // Clear expired OTP
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      
      res.status(400).json({ 
        message: 'OTP has expired. Please request a new OTP.',
        code: 'OTP_EXPIRED'
      });
      return;
    }

    // Verify OTP
    if (user.otp !== otp) {
      console.log('Invalid OTP provided for user:', user.email);
      res.status(400).json({ 
        message: 'Invalid OTP',
        code: 'INVALID_OTP'
      });
      return;
    }

    console.log('OTP verified successfully for user:', user.email);

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;

    // Update profile
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    console.log('Profile updated successfully for user:', user.email);

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ 
      message: 'Error updating profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const requestPasswordReset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendOTPEmail(user.name, user.email, `Reset your password using this link: ${resetLink}`);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Error requesting password reset' });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { $gt: new Date() } } });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    user.password = newPassword; // Ensure password is hashed before saving
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
}; 