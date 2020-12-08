var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var VerifyToken = require('../token/verify_token')

var config = require('../../config/salt');
module.exports = function(app, db){
  const updateStatusUser = (value)=>{
    return value === 3 ? 'user' : 'moder'
  }
    const someDB = db.db('sn')
    app.get('/users',VerifyToken, (req, res) => {
      someDB.collection('users').find({}).toArray((err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(item);
        } 
      });
    });
    app.get('/users/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      someDB.collection('users').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send(item);
        } 
      });
    });
    app.post('/userschecking', (req,res) => {
      const details = { 'login': req.body.login };
      const password = req.body.password
      someDB.collection('users').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          if(bcrypt.hashSync(password, config.secret) === item.password){
            var token = jwt.sign({ id: item._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({status: true, token: token})
            console.log("нужный пароль")
          } else {
            res.status(401).send({status: false, token: none})
            console.log("неверный пароль");
          }
        } 
      });
    })
    app.post('/usersadd', (req,res) => {
      const details = { 'login': req.body.login };
      const newPassword = bcrypt.hashSync(req.body.password, config.secret)
      
      const user = { login: req.body.login, password: newPassword, status: updateStatusUser(req.body.status)} 
      someDB.collection('users').findOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          if(item){
            res.status(403).send(403)
          } else {
            someDB.collection('users').insert(user, (err,result) =>{
              if(err){
                res.send({ 'error': 'An error has occurred' }); 
              } else {
                res.status(200).send(result.ops[0]);
              }
            })
          }
        } 
      });
    })
    app.delete('/users/:id', (req, res) => {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      someDB.collection('users').removeOne(details, (err, item) => {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          res.send('user ' + id + ' deleted!');
        } 
      });
    });
    app.post('/userschange', (req, res) => {
      const id = req.body.id;
      const details = { '_id': new ObjectID(id) };
      const user = { login: req.body.body, password: req.body.title };
      someDB.collection('users').findOne(details, (err, item) => {
        item.status = updateStatusUser(req.body.status)
        someDB.collection('users').update(details, item, (err, result) => {
          if (err) {
              res.send({'error':'An error has occurred'});
          } else {
              res.send(user);
          } 
        });
      })
    });  
};