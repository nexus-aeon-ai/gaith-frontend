export const generateStrongPassword = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  // const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"; // removed symbols

  let password = "";

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  // password += symbols[Math.floor(Math.random() * symbols.length)]; // removed symbols

  // Fill the rest with random characters
  const allChars = lowercase + uppercase + numbers; // removed symbols
  for (let i = 3; i < 12; i += 1) {
    // start from 3 instead of 4
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};
