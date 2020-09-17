// Function to validate the fields in the POST method

const fields = (userBody, user) => {
  userBody = userBody === "" ? "{}" : userBody;

  const requiredFields = ["firstName", "lastName", "age", "email"];
  const userFields = Object.keys(user);
  return (
    requiredFields.every((field) => userFields.includes(field)) &&
    userFields.length === requiredFields.length
  );
};

// Function to validate the fields in the PATCH method
const update = (userBody, user) => {
  userBody = userBody === "" ? "{}" : userBody;

  const possibleFields = ["firstName", "lastName", "age", "email"];
  const userFields = Object.keys(user);
  return userFields.every((field) => possibleFields.includes(field));
};

// Function to test if an user is already registered
const user = (users, email) => users.find((user) => user.email === email);

module.exports = {
  fields,
  update,
  user,
};
