var express = require('express');
var router = express.Router();
var parseUrl = require('body-parser');

let encodeUrl = parseUrl.urlencoded({ extended: false })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Project Papyrus - Login' });
});


module.exports = router;
