var express = require('express');
var router = express.Router();
var usermodel = require('../model/product')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/home', function (req, res, next) {
  var name = req.session.uname ;
  res.render('home',{myname:name});
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.post('/signupprocess', function (req, res, next) {
  var name = req.body.txt1;
  var password = req.body.txt2;
  req.session.uname = name;
  req.session.upsw = password;
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/loginprocess', function (req, res, next) {
  var name = req.body.txt1;
  var password = req.body.txt2;

  if (req.session.uname == name && req.session.upsw == password) {
    res.redirect('home');
  } else {
    res.redirect('/login')
  }
});



router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/login');
});



router.get('/add', function (req, res, next) {
  res.render('add');
});

router.post('/addprocess', function (req, res, next) {
  var productdata = {
    product_name: req.body.txt1,
    product_price: req.body.txt2
  }

  var result = usermodel(productdata);
  result.save();
  res.redirect('/display');
});

router.get('/display', function (req, res, next) {
  usermodel.find().then(function (mydata) {
    res.render('display', { userdata: mydata });
  })
});

router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;
  usermodel.findByIdAndDelete(id).then(function (err, mydata) {
    res.redirect('/display');
  })
});

router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;

  usermodel.findById(id).then(function(mydata){
    res.render('edit' , { userdata:mydata })
  })
});

router.post('/update/:id', function (req, res, next) {
  var id = req.params.id;
  var productdata = {
    product_name: req.body.txt1,
    product_price: req.body.txt2
  }

  usermodel.findByIdAndUpdate(id,productdata).then(function(mydata){
    res.redirect('/display');
  })
});

router.get('/display-api', function (req, res, next) {
  usermodel.find().then(function (mydata) {

//res.send(JSON.stringify(mydata));
res.send(JSON.stringify({"flag":1,"data":mydata}))
  })
});


router.post('/add-api', function (req, res, next) {
  var productdata = {
    product_name: req.body.txt1,
    product_price: req.body.txt2
  }

  var result = usermodel(productdata);
  result.save();
  res.send(JSON.stringify({"flag":1,"data":"record added"}))
});

router.delete('/delete-api', function (req, res, next) {
  var id = req.params.id;
  usermodel.findByIdAndDelete(id).then(function (err,mydata) {
if(!mydata){
  res.send(JSON.stringify({"flag":1,"message":"error in api","err":err}));
}
else{
  res.send(JSON.stringify({"flage":1,"message":"record deleted"}));
}
 })
});

module.exports = router;
