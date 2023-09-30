// Setting server configuration
let server_name = "products-app";
let port = 3001;
let host = "127.0.0.1";

// Initializing request counters
let getCount = 0;
let postCount = 0;

// Importing required modules
let errors = require("restify-errors");
let restify = require("restify"),
  productsSave = require("save")("products"),
  server = restify.createServer({ name: server_name });

// Starting the server
server.listen(port, host, function () {
  console.log('Server "%s" listening at %s', server.name, server.url);
  console.log("Endpoint: " + server.url + "/products");
  console.log("Methods: GET, POST and DELETE");
});

// Adding middleware for handling responses
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Handling GET request for products
server.get("/products", function (req, res, next) {
  console.log("GET /products");
  console.log("GET /products: received request");
  console.log(
    `Processed Request Count--> GET: ${++getCount}, POST: ${postCount}`
  );
  // Finding every entity within the given collection
  productsSave.find({}, function (error, products) {
    // Returning all of the products in the system
    res.send(products);
    console.log("GET /products: sending response");
  });
});

// Handling POST request for products
server.post("/products", function (req, res, next) {
  console.log("POST /products");
  console.log("POST /products body=>" + JSON.stringify(req.body));
  console.log("POST /products: received request");
  console.log(
    `Processed Request Count--> GET: ${++getCount}, POST: ${postCount}`
  );

  // validation of manadatory fields
  if (req.body.name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("name must be supplied"));
  }
  if (req.body.price === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("age must be supplied"));
  }
  if (req.body.quantity === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("age must be supplied"));
  }

  // Creating a new product
  let newProduct = {
    name: req.body.name,
    quantity: req.body.quantity,
    price: req.body.price,
  };
  // Saving the new product
  productsSave.create(newProduct, function (error, product) {
    if (error) return next(new Error(JSON.stringify(error.errors)));
    console.log("POST /products: sending response");
    res.send(201, product);
  });
});

// Handling DELETE request to delete all products
server.del("/products", function (req, res, next) {
  console.log("DELETE /products");
  console.log("DELETE /products: received request");

  // Deleting all products from the collection
  productsSave.deleteMany({}, function (error) {
    if (error) return next(new Error(JSON.stringify(error.errors)));
    console.log("DELETE /products: sending response");
    res.send(204); // Responding with a 204 status code (No Content)
  });
});
