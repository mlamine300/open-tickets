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
