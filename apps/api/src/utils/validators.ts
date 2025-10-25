export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMongoId = (id: string): boolean => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(id);
};

export const validateFileType = (mimetype: string): boolean => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return allowedTypes.includes(mimetype);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "").trim().substring(0, 1000);
};
