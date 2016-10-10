// Required modules
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
// GET requests
app.get('/items', function(request, response) {
    response.json(storage.items);
});


app.get('/users/:username/items', function(request, response){
  var usernameReq = request.params.username
  var userItems = usersArray.filter(function (userItems){ 
    return userItems.username === usernameReq
  })
  var userIndex = usersArray.indexOf(userItems[0])
  response.json(usersArray[userIndex])
})


// POST request
// using jsonParser as second argument tells express to use the 
// jsonParser middleware when requests for the route are made.
app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {// middleware adds a new attribute request.body to request object
        return response.sendStatus(400);
    }
    var item = storage.add(request.body.name);
    response.status(201).json(item);
});
// DELETE endpoint for items, identifies them by id sent in request
app.delete('/items/:id', function(request, response) {
  // this variable is the id of the item that the user wants to delete
  var itemId = Number(request.params.id) 
  // this function uses the filter method to see if the id requested matches an item in the array
 
  var itemIdArray = storage.items.filter(function (itemIdArray){ 
    return itemIdArray.id === itemId
  })
  if(itemIdArray.length === 0){
    response.status(404).json("Item not found") // in case the user doesn't send an existing id, a 404 will be sent
  }
 //console.log("items id array: ", itemIdArray) 
  // variable that tells us the index in the array of the item corresponding to the id
  var index = storage.items.indexOf(itemIdArray[0])
  storage.items.splice(index, 1) // splice method removes the item requested to be removed by the user 
  response.status(200).json(itemId); //responds with a status 200 when item is successfully removed
});
// PUT request
app.put('/items/:id', jsonParser, function(request, response){
  var newItem = {
    name: "",
    id: "",
  }
  // this variable is the id of the item that the user wants to delete
  var itemId = Number(request.params.id) 
  // this function uses the filter method to see if the id requested matches an item in the array
  var itemIdArray = storage.items.filter(function (itemIdArray){ 
    return itemIdArray.id === itemId
  })
  console.log("this is the item array", itemIdArray)
  if(itemIdArray.length === 0){
    response.status(404).json("No item edited") // in case the user doesn't send an existing id, a 404 will be sent
  }
  // variable that tells us the index in the array of the item corresponding to the id
  var index = storage.items.indexOf(itemIdArray[0])
  console.log("INDEX",index)
  var chosenItem = storage.items[index]
  console.log('THIS IS THE CHOSEN ITEM', chosenItem)
  var keys = Object.keys(request.body)
  keys.forEach(function(key){
    console.log("this is the key", storage.items[index[key]])
    chosenItem[key] = request.body[key]
  })
  console.log("chosen item changed", chosenItem)
  storage.items[index] = chosenItem
  response.status(200).json(storage.items[index]); //responds with a status 200 when item is successfully removed
})

app.listen(process.env.PORT || 8080, process.env.IP);

exports.app = app;
exports.storage = storage;