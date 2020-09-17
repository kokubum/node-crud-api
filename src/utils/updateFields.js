// Function that update an user with some fields
const updateFields = (userFields, user) => {
  Object.keys(userFields).forEach((field) => {
    user[field] = userFields[field];
  });
};

module.exports = updateFields;
