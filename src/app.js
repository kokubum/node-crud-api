// CRUD API with pure node.js

const http = require("http");
const userController = require("./controllers/userController");

const port = process.env.PORT | 5000;

// Mapping each route with its respective handler
const requestHandlers = {
  "GET /api/v1/users": userController.getUsers,
  "POST /api/v1/users": userController.postUser,
  "GET /api/v1/users/id": userController.getUser,
  "DELETE /api/v1/users/id": userController.deleteUser,
  "PATCH /api/v1/users/id": userController.updateUser,
};

// Creating the server
const server = http.createServer((req, res) => {
  
  let { pathname } = new URL(req.url, "http:127.0.0.1");

  // Teste if the pathname is dynamic
  if (pathname.match(/^\/api\/v1\/users\/\d+\/?$/)) {
    // Putting the dynamic value (id) in the request object
    req.user_id = parseInt(pathname.split("/")[4]);

    // Replacing the id that was passed by the "id" string
    pathname = pathname.replace(/\d+\/?$/, "id");
  }
  // Making all the routes end with no "/"
  pathname = pathname.match(/\/$/) ? pathname.replace(/\/$/, "") : pathname;

  // Creating the key request
  const typeOfRequest = `${req.method} ${pathname}`;

  // Search for the function handler
  const handler = requestHandlers[typeOfRequest];

  // if the function is undefined, it means that the route it's not registered
  if (!handler) {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });
    return res.end(
      JSON.stringify({
        status: "fail",
        message: "Route not found",
      })
    );
  }
  
  return handler(req, res);
});


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
