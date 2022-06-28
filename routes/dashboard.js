var express = require('express');
const { body,validationResult } = require('express-validator');
var router = express.Router();
var parseUrl = require('body-parser');

const {addStudent, 
  getAllStudents, 
  getStudent,
  updateStudent,
  deleteStudent
 } = require('../controllers/controller');
const e = require('express');



let encodeUrl = parseUrl.urlencoded({ extended: false })
router.use(express.json())



/* GET home page. */
router.get('/', getAllStudents, function(req, res, next) {
  console.log(JSON.stringify(req.students));
  let dummyUsername = 'NULL';
    res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: dummyUsername});
});

router.post('/', getAllStudents, body('username').trim(), function(req, res, next) {
  const username = req.body.username;
  console.log(JSON.stringify(req.students));
  if(username !== undefined){
  res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: username });
  }
  else{
    let dummyUsername = 'NULL';
    res.render('dashboard', { title: 'Project Papyrus', students: req.students, username: dummyUsername});
  }
});

// router.post('/', addStudent);
// router.get('/', getAllStudents);         
router.get('/:id', getStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent); 



module.exports = router;
