
export const validatePhone = (phoneNumber: string) => {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return cleanPhone.length >= 10;
};

export const validateEmail = (emailAddress: string) => {
  return emailAddress.includes('@') && emailAddress.includes('.');
};

// Helper function to get the driver-specific auth email
export const getDriverAuthEmail = (phone: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  // Remove leading zeros and ensure we have a valid format
  const normalizedPhone = cleanPhone.replace(/^0+/, '');
  // Add a prefix to make it a valid email format
  return `driver${normalizedPhone}@taxiye.com`;
};
