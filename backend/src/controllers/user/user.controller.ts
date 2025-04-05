import { Request, Response } from 'express';
import User, { UserPreferences } from '../../models/user.js';

interface UserRequest extends Request {
  user?: {
    id: string;
  };
}

interface UpdateProfileRequest extends UserRequest {
  body: {
    name?: string;
    email?: string;
  };
}

interface UpdatePreferencesRequest extends UserRequest {
  body: Partial<UserPreferences>;
}

export const getProfile = async (req: UserRequest, res: Response): Promise<void> => {
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
    
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: UpdateProfileRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { name, email } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    await user.update({ name, email });
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const getPreferences = async (req: UserRequest, res: Response): Promise<void> => {
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
    
    res.json({ preferences: user.preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Error fetching preferences' });
  }
};

export const updatePreferences = async (req: UpdatePreferencesRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const preferences = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    await user.update({ preferences });
    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
}; 