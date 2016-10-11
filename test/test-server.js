// require the chai modules
var chai = require('chai');
var chaiHttp = require('chai-http');
// require the server.js to make requests to the app and storage objects
var server = require('../server.js');
// call chai should function. Should extends every object with should property you can use for chaining an assertion
var should = chai.should();
var app = server.app;
var storage = server.storage;
// tells chai to use the HTTP plugin
chai.use(chaiHttp);

// Tests for shopping list
describe('Shopping List', function() {

    it('should list items on GET', function(done) { //function called to tell mocha that the test has completed. Always include in it blocks.
        chai.request(app) // tells chai to make request to the app
        .get('/items') // call get to make a get request to the /items endpoint
        .end(function(err, res) { // end method runs the function which you pass in when the request is complete
            should.equal(err, null);
            res.should.have.status(200); // should style assetion says that the response should have a 200 status code
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.should.have.length(3);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('id');
            res.body[0].should.have.property('name');
            res.body[0].id.should.be.a('number');
            res.body[0].name.should.be.a('string');
            res.body[0].name.should.equal('Broad beans');
            res.body[1].name.should.equal('Tomatoes');
            res.body[2].name.should.equal('Peppers');
            done();
        });
    });
    
    it('should list item with /items/:id on GET', function(done) {
        chai.request(app)
            .get('/items/3')
            .end(function(err, res){
                should.equal(err, null);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('name');
                res.body.id.should.be.a('number');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Peppers');
                res.body.id.should.equal(3);
                done();
            });
    });
    
    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });
     
    it('should edit a new item on PUT', function(done) { 
        chai.request(app) 
            .put('/items/4') 
            .send({'name': 'carrot', 'id':4 }) 
            .end(function(err, res) { 
                should.equal(err, null); 
                res.should.have.status(200); 
                res.should.be.json; 
                res.body.should.be.a('object'); 
                res.body.should.have.property('name'); 
                res.body.should.have.property('id'); 
                res.body.name.should.be.a('string'); 
                res.body.id.should.be.a('number'); 
                res.body.name.should.equal('carrot'); 
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.be.equal('carrot');
                done(); 
            });       
    }); 
    
    it('should delete an item on delete', function(done) {
    chai.request(app)
        .delete('/items/4')
        .end(function(err, res) {
              should.equal(err, null);
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('name');
              res.body.should.have.property('id');
              res.body.name.should.be.a('string');
              res.body.id.should.be.a('number');
              res.body.name.should.equal('carrot');
              storage.items.should.be.a('array');
              storage.items.should.have.length(3);
              done();
        });
  });
    
});

// FAIL tests for shopping list
describe('Shopping List fail tests', function() {
    it('should fail when post without body data', function(done){
        chai.request(app)
        .post('/items')
        .end(function(err, res){
            should.equal(err.message, "Bad Request");
            res.should.have.status(400);
            done();
        });
    });
    
    it('should fail when post with something other than a valid JSON', function(done) {
        chai.request(app)
        .post('/items')
        .end(function(err,res){
            should.equal(err.message, "Bad Request");
            res.should.have.status(400);
            done();
        });
    });
    
    it('should fail put without body data', function(done) {
        chai.request(app)
            .put('/items/3')
            .end(function(err, res){
                should.equal(err.message, "Bad Request");
                res.should.have.status(400);
                done();
            });
    });
    
    it('should fail when put with something other than a valid JSON', function(done) {
        chai.request(app)
            .put('/items/3')
            .end(function(err, res){
                should.equal(err.message, "Bad Request");
                res.should.have.status(400);
                done();
            });
    });
    
    it('should fail when put with a different id in the endpoint than the body', function(done) {
        chai.request(app)
            .put('/items/3')
            .send({"name": "Kale", "id":4})
            .end(function(err, res){
                should.equal(err.message, "Bad Request");
                res.should.have.status(400);
                done();
            });
    });
    
    it('should fail to delete an id that does not exist', function(done) {
        chai.request(app)
            .delete('/items/367268')
            .end(function(err, res){
                should.equal(err.message, "Not Found");
                res.should.have.status(404);
                done();
            });
    });
    
    it('should fail to delete without an ID in the endpoint', function(done) {
        chai.request(app)
            .delete('/items')
            .end(function(err, res){
                should.equal(err.message, "Bad Request");
                res.should.have.status(400);
                done();
            });
    });
    
    it('should create a new item when you PUT an item to an ID that does not exist', function(done) {
        chai.request(app)
            chai.request(app)
                .put('/items/2222')
                .send({'name': 'Papaya', 'id':2222 })
                .end(function(err, res) {
                  should.equal(err, null);
                  res.should.have.status(201);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.should.have.property('name');
                  res.body.should.have.property('id');
                  res.body.name.should.be.a('string');
                  res.body.id.should.be.a('number');
                  res.body.name.should.equal('Papaya');
                  storage.items.should.be.a('array');
                  storage.items.should.have.length(4);
                  storage.items[3].should.be.a('object');
                  storage.items[3].should.have.property('id');
                  storage.items[3].should.have.property('name');
                  storage.items[3].id.should.be.a('number');
                  storage.items[3].name.should.be.a('string');
                  storage.items[3].name.should.equal('Papaya');
                  done();
            });
    });
});





