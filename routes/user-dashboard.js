var express = require('express');
const { body,validationResult } = require('express-validator');
var router = express.Router();
var parseUrl = require('body-parser');
const url = require('url'); 
var storage = require('../db')

const {addStudent, 
  getAllStudents, 
  getStudent,
  updateStudent,
  deleteStudent,
  upload,
  getListFiles,
  download,
  addOrder
 } = require('../controllers/controller');
const e = require('express');
const { ContextRunnerImpl } = require('express-validator/src/chain');
1
var runner = require("child_process");


let encodeUrl = parseUrl.urlencoded({ extended: false })
router.use(express.json())

router.get('/', function(req,res,next){
    res.redirect('user-dashboard/new');
})

router.post('/', function(req,res,next){
    res.redirect('user-dashboard/new');
})

// router.post('/file_upload_parser.php'){
//     runner

// }


router.get('/new', function(req,res,next){
    res.render('user-home', {title: 'Project Papyrus'});
})

router.post('/new/order', upload, addOrder, function(req,res,next){    
    console.log(req.publicUrl);
    res.render('user-order-summary', {title: 'Project Papyrus', publicUrl: req.publicUrl});
})

router.get('/new/order', function(req,res,next){  
    res.render('user-order-summary', {title: 'Project Papyrus'});
})

router.get('/files', getListFiles, function(req,res){
    res.status(200);
})

router.get('/collect', function(req,res,next){
    res.render('staff-collect', {title: 'Project Papyrus'});
})

router.get('/archived', function(req,res,next){
    res.render('staff-archived', {title: 'Project Papyrus'});
})





module.exports = router;