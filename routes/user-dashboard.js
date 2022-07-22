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
  addOrder,
  getOrder,
  deductBalance,
  getUserPendingOrders,
  getUserCompletedOrders
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

router.post('/new', function(req,res,next){
    res.render('user-home', {title: 'Project Papyrus'});
})


router.post('/new/order', upload, addOrder, getOrder, function(req,res,next){    
    console.log(req.publicUrl);
    console.log(req.fileName);
    console.log("REQUESTING DATA: " + JSON.stringify(req.order_data));
    res.render('user-order-summary', {title: 'Project Papyrus', publicUrl: req.publicUrl, order_data: req.order_data, fileName: req.fileName});
})

router.get('/new/order', function(req,res,next){ 

    res.render('user-order-summary', {title: 'Project Papyrus'});
})

router.post('/new/order/:order_id', deductBalance, function(req,res,next){
    res.render('user-order-complete', {title: 'Project Papyrus', order_data: req.order_data});
})

router.get('/files', getListFiles, function(req,res){
    res.status(200);
})

router.get('/pending', getUserPendingOrders, function(req,res,next){
    console.log("ORDER ARRAY: " + req.order_array);
    res.render('user-pending', {title: 'Project Papyrus', order_array: req.order_array});
})

router.get('/archive', getUserCompletedOrders, function(req,res,next){
    res.render('user-archive', {title: 'Project Papyrus', order_array: req.order_array});
})





module.exports = router;