export const generateOTP = (): string => {
  // Generate a 6-digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}; 