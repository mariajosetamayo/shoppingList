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




describe('Shopping List', function() {
    it('should list items on GET', function(done) { //function called to tell mocha that the test has completed. Always include in it blocks.
        chai.request(app) // tells chai to make request to the app
            .get('/items') // call get to make a get request to the /items endpoint
            .end(function(err, res) { // end method runs the function which you pass in when the request is complete
                res.should.have.status(200); // should style assetion says that the response should have a 200 status code
                done();
            });
    });

    it('should list items on GET', function(done) {
        chai.request(app)
        .get('/items')
        .end(function(err, res) {
            should.equal(err, null);
            res.should.have.status(200);
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
     it('should delete an item on delete', function(done) { 
        chai.request(app) 
            .delete('/items/1') 
            .end(function(err, res) { 
                should.equal(err, null); 
                res.should.have.status(200); 
                res.should.be.json; 
                res.body.should.be.a('object'); 
                res.body.should.have.property('name'); 
                res.body.should.have.property('id'); 
                res.body.name.should.be.a('string'); 
                res.body.id.should.be.a('number'); 
                res.body.name.should.equal('Tomatoes'); 
                res.body.id.should.equal(1); 
                done(); 
            }); 
    }); 
     
    
    
    it('should add a new item on put', function(done) { 
        chai.request(app) 
            .put('/items/3') 
            .send({'name': 'Carrot'}) 
            .end(function(err, res) { 
                should.equal(err, null); 
                res.should.have.status(200); 
                res.should.be.json; 
                res.body.should.be.a('object'); 
                res.body.should.have.property('name'); 
                res.body.should.have.property('id'); 
                res.body.name.should.be.a('string'); 
                res.body.id.should.be.a('number'); 
                res.body.name.should.equal('Carrot'); 
                res.body.id.should.equal(3); 
                done(); 
            });       
    }); 
    
    
});

 it('should delete an item on delete');
    it('should post to an ID that exists');
    it('should post without body data');
    it('should post with something other than a valid JSON');
    it('should put without and ID in the endpoint');
    it('should put with different ID in the endpoint than the body');
    it('should put to an ID that doesnt exist');
    it('should put without body data');
    it('should put with something other than a valid JSON');
    it('should delete an ID that doesnt exist');
    it('should delete without an ID in the endpoint')



