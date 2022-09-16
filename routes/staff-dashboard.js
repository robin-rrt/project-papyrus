var express = require('express');
const { body,validationResult } = require('express-validator');
var router = express.Router();
var parseUrl = require('body-parser');

const {addStudent, 
  getAllStudents, 
  getStudent,
  updateStudent,
  deleteStudent,
  getAllPendingOrders,
  download,
  markAsComplete,
  getAllCollectNowOrders,
  getAllCompletedOrders,
  markAsCollected,
  creditBalance
 } = require('../controllers/controller');
const e = require('express');



// let encodeUrl = parseUrl.urlencoded({ extended: false })
// router.use(express.json())

router.use(express.urlencoded({extended: true}));
router.use(express.json())

router.get('/', function(req,res,next){
    res.redirect('staff-dashboard/pending');
})

router.post('/', function(req,res,next){
    res.redirect('staff-dashboard/pending');
})

router.post ('/pending', getAllPendingOrders, function(req,res,next){

    res.render('staff-pending', {title: 'Project Papyrus', pending_order_array: req.pending_order_array});
})

router.get('/pending', getAllPendingOrders, function(req,res,next){
    res.render('staff-pending', {title: 'Project Papyrus', pending_order_array: req.pending_order_array});
})

router.get('/pending/download/:name', download, function(req,res,next){
    res.status(200);
})

router.post ('/collect/:order_id', markAsComplete, function(req,res,next){
    res.status(200);
    res.redirect('/staff-dashboard/collect');
})


router.get('/collect', getAllCollectNowOrders,function(req,res,next){
    res.render('staff-collect', {title: 'Project Papyrus', order_array: req.collect_order_array});    
})

router.get('/archived', getAllCompletedOrders,function(req,res,next){
    res.render('staff-archived', {title: 'Project Papyrus', order_array: req.completed_order_array});
})

router.post ('/archived/:order_id', markAsCollected, function(req,res,next){
    res.status(200);
    res.redirect('/staff-dashboard/collect');
})

router.get('/credit', function(req,res,next){
    res.render('credit', {title: 'Project Papyrus', updated: false});
})

router.post('/credit', body('email').trim(), body('credit').trim(), creditBalance,  function(req,res,next){
    res.render('credit', {title: 'Project Papyrus', updated: req.updated, balance: req.balance, email:req.body.email});
})



/* GET home page. */
// router.get('/', getAllStudents, function(req, res, next) {
//   console.log(JSON.stringify(req.students));
//   let dummyUsername = 'NULL';
//     res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: dummyUsername});
// });

// router.post('/', getAllStudents, body('username').trim(), function(req, res, next) {
//   const username = req.body.username;
//   console.log(JSON.stringify(req.students));
//   if(username !== undefined){
//   res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: username });
//   }
//   else{
//     let dummyUsername = 'NULL';
//     res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: dummyUsername});
//   }
// });

// router.post('/', addStudent);
// router.get('/', getAllStudents);         
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent); 



module.exports = router;
