var express = require('express');
const { body,validationResult } = require('express-validator');
var router = express.Router();
var parseUrl = require('body-parser');
var session = require('express-session')

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
  getUserCompletedOrders,
  getUserBalance
 } = require('../controllers/controller');
const e = require('express');
const { ContextRunnerImpl } = require('express-validator/src/chain');
1
var runner = require("child_process");


let encodeUrl = parseUrl.urlencoded({ extended: false })
router.use(express.json())
router.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

router.get('/', function(req,res,next){
    req.session.uid = req.params.id;
    res.redirect('user-dashboard/new');
})

router.post('/', function(req,res,next){
    req.session.uid = req.params.id;
    res.redirect('user-dashboard/new'); 
})


// router.get('/:id', function(req,res,next){
//     res.redirect(`${req.params.id}/new`);
// })

// router.post('/:id', function(req,res,next){
//     res.redirect(`${req.params.id}/new`);
// })
// router.post('/file_upload_parser.php'){
//     runner

// }

router.get('/:id', function(req,res,next){
    req.session.uid = req.params.id;
    res.redirect(`${req.session.uid}/new`); 
})

router.post('/:id', function(req,res,next){
    req.session.uid = req.params.id;
    res.redirect(`${req.session.uid}/new`); 
})

router.get('/:id/new', getUserBalance, function(req,res,next){
    console.log(req.session.uid);
    res.render('user-home', {title: 'Project Papyrus', uid: req.session.uid, balance: req.userBalance});
})

router.post('/:id/new', getUserBalance, function(req,res,next){
    res.render('user-home', {title: 'Project Papyrus', uid: req.session.uid, balance: req.userBalance});
})


router.post('/:id/new/order', upload, addOrder, getOrder, getUserBalance, function(req,res,next){    
    console.log(req.publicUrl);
    console.log(req.fileName);
    console.log("REQUESTING DATA: " + JSON.stringify(req.order_data));
    res.render('user-order-summary', {title: 'Project Papyrus', publicUrl: req.publicUrl, order_data: req.order_data, fileName: req.fileName, uid: req.session.uid, balance: req.userBalance});
})

router.get('/:id/new/order', getUserBalance, function(req,res,next){ 

    res.render('user-order-summary', {title: 'Project Papyrus', uid: req.session.uid, balance: req.userBalance});
})

router.post('/:id/new/order/:order_id', deductBalance, getUserBalance, function(req,res,next){
    res.render('user-order-complete', {title: 'Project Papyrus', order_data: req.order_data, uid: req.session.uid, balance: req.userBalance});
})

router.get('/files', getListFiles, function(req,res){
    res.status(200);
})

router.get('/:id/pending', getUserPendingOrders, getUserBalance, function(req,res,next){
    console.log("ORDER ARRAY: " + req.order_array);
    res.render('user-pending', {title: 'Project Papyrus', order_array: req.order_array, uid: req.session.uid, balance: req.userBalance});
})

router.get('/:id/archive', getUserCompletedOrders, getUserBalance, function(req,res,next){
    res.render('user-archive', {title: 'Project Papyrus', order_array: req.order_array, uid: req.session.uid, balance: req.userBalance});
})





module.exports = router;