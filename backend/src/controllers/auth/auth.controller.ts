import { Request, Response } from 'express';
// import User from '/models/user.js';
import User from '../../models/user.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendRegistrationEmail } from '../../utils/nodeMailer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation functions
const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_.]+$/;
  return usernameRegex.test(username);
};

const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{4,}$/;
  return passwordRegex.test(password);
};

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export const register = async (req: RegisterRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    console.log('Registering user with email:', email);

    // Validate username
    if (!validateUsername(name)) {
      res.status(400).json({ 
        message: 'Username can only contain alphanumeric characters, underscore (_), and dot (.)' 
      });
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      res.status(400).json({ 
        message: 'Password must be 4-6 characters long, contain at least one capital letter and one number' 
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password before creating user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Create new user with hashed password
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    });

    // Send welcome email
    try {
      await sendRegistrationEmail(name, email, password);
      console.log('Welcome email sent successfully');
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
    console.log(user," register user data")
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: LoginRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found for email:', email);
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    console.log('User found, comparing passwords...');
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h'
    });

    // Set token in Authorization header
    res.setHeader('Authorization', `Bearer ${token}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Since JWT is stateless, we just need to tell the client to remove the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error logging out' });
  }
}; 