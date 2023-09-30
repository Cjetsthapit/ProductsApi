let server_name = 'products-app';
let port = 3001;
let host = '127.0.0.1';

let getCount = 0;
let postCount = 0;

const {get} = require('http');
let errors = require('restify-errors');
let restify = require('restify')
    , productsSave = require('save')('products')
    ,server = restify.createServer({name:server_name})

server.listen(port, host, function(){
    console.log('Server "%s" listening at %s', server.name, server.url)
    console.log('Endpoint: '+ server.url +'/products')
    console.log('Methods: GET, POST and DELETE')
})

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

server.get('/products', function(req,res,next){
    console.log('GET /products');
    console.log('GET /products: received request')
    console.log(`Processed Request Count--> GET: ${++getCount}, POST: ${postCount}`)  
    // Find every entity within the given collection
    productsSave.find({}, function (error, products) {
      // Return all of the users in the system
      res.send(products)
      console.log('GET products: sending response')
    })
})

server.post('/products', function (req, res, next) {
    console.log('POST /products');
    console.log('POST /products body=>' + JSON.stringify(req.body));
    console.log('POST /products: received request')
    console.log(`Processed Request Count--> GET: ${++getCount}, POST: ${postCount}`)  
  
    // validation of manadatory fields
    if (req.body.name === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('name must be supplied'))
    }
    if (req.body.price === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('age must be supplied'))
    }
    if (req.body.quantity === undefined ) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('age must be supplied'))
    }
  
    let newProduct = {
          name: req.body.name, 
          quantity: req.body.quantity,
          price: req.body.price
      }
  
    productssave.create( newProduct, function (error, product) {
      if (error) return next(new Error(JSON.stringify(error.errors)))
      res.send(201, product)
    })
  })

