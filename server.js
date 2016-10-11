///// Required modules /////
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// object constructors
var Storage = {
  username: "",
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  } 
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.username = "",
  storage.items = [];
  storage.setId = 1;
  return storage;
}

// objects for storage and users
var storage = createStorage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var user1 = createStorage();
user1.username = 'Gabriel';
user1.add('rancheritos');
user1.add('orange juice');

var user2 = createStorage();
user2.username = 'Dominique';
user2.add('french toast');
user2.add('bacon');

// array with users
var usersArray = [user1,user2]

// This app object tells express to serve any static content in the public folder. 
// When the request is made to the server for a static file (like CSS), express will look for it 
// in the directory that you specify. 
var app = express();
app.use(express.static('public'));

// GET all items
app.get('/items', function(request, response) {
    response.json(storage.items);
});

// Function to get index of the item from ID
var getItemIndex = function(itemId){
  var index = -1;
  for (var i=0; i<storage.items.length; i++){
    if (storage.items[i].id === itemId){
      index = i;
    }
  }
  return index;
}

//GET one item
app.get('/items/:id', function(request, response) {
    var itemId = Number(request.params.id)
    var index = getItemIndex(itemId)
    
    if (index >= 0){
      response.json(storage.items[index])
    }
    else{
      return response.sendStatus(400);
    }
})

//GET user's items
app.get('/users/:username/items', function(request, response){
  var usernameReq = request.params.username
  var index = getItemIndex(usernameReq)

  response.json(usersArray[index])
})


// POST request
// using jsonParser as second argument tells express to use the 
// jsonParser middleware when requests for the route are made.
app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {// middleware adds a new attribute request.body to request object
        return response.sendStatus(400);
    }
    var item = storage.add(request.body.name);
    response.status(201).json(item)
});

// PUT request
app.put('/items/:id', jsonParser, function(request, response){
  // this variable is the id of the item that the user wants to delete
  var itemId = Number(request.params.id)
  var index = getItemIndex(itemId)
  
  if(itemId != request.body.id || request.body.id == ""){
    return response.status(400).json("Bad Request"); // in case the user doesn't send an existing id, a 400 will be sent
  }
  if(index>=0){
    var chosenItem = storage.items[index];
    var keys = Object.keys(request.body)
    keys.forEach(function(key){
      chosenItem[key] = request.body[key]
    })
    response.status(200).json(chosenItem); //responds with a status 200 when item is successfully removed
  }
  else{
    var item = request.add(request.body.name);
    response.status(201).json(item);
  }
});

// DELETE endpoint for items, identifies them by id sent in request
app.delete('/items/:id', function(request, response) {
  // this variable is the id of the item that the user wants to delete
  var itemId = Number(request.params.id)
  var index = getItemIndex(itemId)
  
  if(index >= 0){
    var chosenItem = storage.items[index]
    storage.items.splice(index, 1) // splice method removes the item requested to be removed by the user 
    return response.status(200).json(chosenItem); //responds with a status 200 when item is successfully removed
  }
  else{
    return response.status(404).json("Not found") // in case the user doesn't send an existing id, a 404 will be sent
  }
});

app.delete('/items/', function(request, response){
  return response.status(400).json("Bad Request")
})



app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;