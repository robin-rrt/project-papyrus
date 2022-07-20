'use strict';

const {db, bucket} = require('../db');
const Student = require('../models/student');
const processFile = require("../middleware/upload");
const { format } = require("util");
const { body } = require('express-validator');
const firestore = db.firestore();



const addStudent = async (req, res, next) => {
    try {
        const data = req.body;
        await firestore.collection('students').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllStudents = async (req, res, next) => {
    try {
        const students = await firestore.collection('students');
        const data = await students.get();
        const studentsArray = [];
        if(data.empty) {
            res.status(404).send('No student record found');
        }else {
            data.forEach(doc => {
                const student = new Student(
                    doc.id,
                    doc.data().firstName,
                    doc.data().lastName,
                    doc.data().fatherName,
                    doc.data().class,
                    doc.data().age,
                    doc.data().phoneNumber,
                    doc.data().subject,
                    doc.data().year,
                    doc.data().semester,
                    doc.data().status
                );
                studentsArray.push(student);
            });
            console.log(studentsArray);
            // res.send(studentsArray);
            req.students = studentsArray;
            next();
            // return studentsArray;

        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const student = await firestore.collection('students').doc(id);
        const data = await student.get();
        if(!data.exists) {
            res.status(404).send('Student with the given ID not found');
        }else {
            res.send(data.data());
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const student =  await firestore.collection('students').doc(id);
        await student.update(data);
        res.send('Student record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteStudent = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('students').doc(id).delete();
        res.send('Record deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const upload = async (req, res, next) => {
    try {
      await processFile(req, res);
    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });
    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );
      try {
        // Make the file public
        await bucket.file(req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message:
            `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }
      
      req.publicUrl = publicUrl;
      
      next();
      res.status(200);
    });
    blobStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });

      } 
    };

const getListFiles = async (req, res) => {
    try {
        const [files] = await bucket.getFiles();
        let fileInfos = [];
        files.forEach((file) => {
          fileInfos.push({
            name: file.name,
            url: file.metadata.mediaLink,
          });
        });
        res.status(200).send(fileInfos);
      } catch (err) {
        console.log(err);
        res.status(500).send({
          message: "Unable to read list of files!",
        });
      }
    };

  const download = async (req, res) => {
    try {
        const [metaData] = await bucket.file(req.params.name).getMetadata();
        res.redirect(metaData.mediaLink);
        
      } catch (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    };


    const addOrder = async (req, res, next) => {
      try {
        let counter = 1;
          let form_data = req.body;
          console.log(JSON.stringify(form_data));
          let json = JSON.parse(JSON.stringify(form_data).replace(/"\s+|\s+"/g,'"'));
          if(json.lamination === undefined){
            json.lamination = '0';
          }
          if(json.binding === undefined){
            json.binding = '0';
          }
          const data = {
            order_id: "SGCE0000" + counter,
            user: 'default-user',
            priority: 1,
            file_path: req.publicUrl,
            price:  parseInt(json.copies)*(parseInt(json.colour) + parseInt(json.lamination) + parseInt(json.binding)),
            binding: json.binding,
            lamination: json.lamination,
            page_orientation: json.orientation,
            colour: json.colour,
            copies: json.copies,
            instructions: json.instructions,
            payment_status: 'unpaid'
            
          }
          console.log(data);
          // await firestore.collection('orders').doc().set(data);
          // res.send('Record saved successfuly');
          res.status(200);
          next();
      } catch (error) {
          res.status(400).send(error.message);
      }
  }



module.exports = {
    addStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    upload,
    getListFiles,
    download,
    addOrder
}