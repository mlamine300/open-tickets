export const validatePassword = (password: string) => {
  return true;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&])[A-Za-z\d@$!%*.?&]{8,}$/;
  return regex.test(password);
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validateName = (name: string) => {
  const regex = /^[A-Za-z\s]{2,}$/;
  return regex.test(name.trim());
};

export const getColorFromName = (name: string): string => {
  let hash = 0;

  // Create a simple hash from the string
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map the hash value to a hue (0–360)
  const hue = Math.abs(hash) % 360;

  // Fixed saturation and lightness for good readability
  return `hsl(${hue}, 65%, 55%)`;
};