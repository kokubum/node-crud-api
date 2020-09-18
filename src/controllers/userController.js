const fs = require("fs").promises;
const path = require("path");
const sendError = require("./errorController");
const validate = require("../utils/validate");
const findUser = require("../utils/findUser");
const updateFields = require("../utils/updateFields");

// Absolute path for the json data
const db_path = path.join(__dirname, "../../data/users.json");

// Handler to the route "GET api/v1/users"
const getUsers = async (req, res) => {
  try {
    // Reading and parsing the json to a js object
    const users = JSON.parse(await fs.readFile(db_path, "utf-8"));
    
    sendResponse(200, { users }, res);
  } catch (err) {
    sendError(err, 400, res);
  }
};

// Handler to the route "POST api/v1/users"
const postUser = (req, res) => {
  // Creating an userBody that will receives the request body like a string
  let userBody = "";
  req.on("data", (chunk) => {
    userBody += chunk;
  });
  req.on("end", async () => {
    try {
      const user = JSON.parse(userBody);
      // Testing if the fields of the request are valid
      if (!validate.fields(userBody, user)) throw new Error("Invalid fields");
 
      const users = JSON.parse(await fs.readFile(db_path, "utf-8"));
      // Testing if the user are already registered
      if (validate.user(users, user.email))
        throw new Error("User already exists");
      // Defining the id and saving the new user
      user.id = users.length === 0 ? 1 : users[users.length - 1].id + 1;
      users.push(user);
      await fs.writeFile(db_path, JSON.stringify(users));
      sendResponse(201, { user }, res);
    } catch (err) {
      sendError(err, 400, res);
    }
  });
};

// Handler to the route "GET api/v1/users/id"
const getUser = async (req, res) => {
  try {
    const { user } = await findUser(req.user_id, db_path);
    sendResponse(200, { user }, res);
  } catch (err) {
    sendError(err, 404, res);
  }
};

// Handler to the route "DELETE api/v1/users/id"
const deleteUser = async (req, res) => {
  try {
    // Searching and deleting the user
    const { index, users } = await findUser(req.user_id, db_path);
    users.splice(index, 1);
    // Saving the new array of users
    await fs.writeFile(db_path, JSON.stringify(users));
    sendResponse(204, null, res);
  } catch (err) {
    sendError(err, 404, res);
  }
};

// Handler to the route "PATCH api/v1/users/id"
const updateUser = (req, res) => {
  // Creating an userBody that will receives the request body like a string
  let userBody = "";
  req.on("data", (chunk) => {
    userBody += chunk;
  });
  req.on("end", async () => {
    try {
      
      const userFields = JSON.parse(userBody);
      // Testing if the fields are valid to update the user
      if (!validate.update(userBody, userFields))
        throw new Error("Invalid fields to update");

      // Finding and updating the user
      const { users, user } = await findUser(req.user_id, db_path);
      updateFields(userFields, user);

      // Saving the new array of users
      await fs.writeFile(db_path, JSON.stringify(users));
      sendResponse(200, { user }, res);
    } catch (err) {
      sendError(err, 400, res);
    }
  });
};

// A function to send the response
const sendResponse = (code, data, res) => {
  res.writeHead(code, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      status: "success",
      data,
    })
  );
};

module.exports = {
  getUsers,
  postUser,
  getUser,
  deleteUser,
  updateUser,
};
