const fs = require("fs").promises;

// Function to try to find an user, if he's not in the array, an error will be thrown
const findUser = async (id, path) => {
  const users = JSON.parse(await fs.readFile(path, "utf-8"));
  const userIndex = users.findIndex((element) => element.id === id);
  if (userIndex === -1) throw new Error("User not found");
  return {
    users,
    user: users[userIndex],
    index: userIndex,
  };
};

module.exports = findUser;
