export const getEffectiveUserId = (user) => {
  return user.role === "staff" ? user.createdBy : user._id;
};
