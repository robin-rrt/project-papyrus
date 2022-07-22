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
      req.fileName = req.file.originalname;
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
          // Create a reference to the organisations doc.
          const reproRef = firestore.collection("repro").doc("orders");
          const userRef = firestore.collection("users");
          ////dummy user user@saintigits.org
          let user_uid;
          const user_snapshot = await userRef.where('email', '==', 'user@saintgits.org').get();
          if (user_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          user_snapshot.forEach(doc => {
            user_uid= doc.id;
          });

          // Get random document id for purchases
          const ordersRef = firestore.collection('orders').doc(); 
          try {
            await firestore.runTransaction(async (trx) => {
              const doc = await trx.get(reproRef);
              if (!doc.exists) {
                console.log('No such document!');
              }
              // .then((orders) => {
              //     if (!orders.exists) throw  "Document does not exist!";
          // Increment one serialNumberGenerated to the organisations.
                  const nextOrder = doc.data().orders_placed + 1;
  
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
                      created_at: new  Date(),
                      order_id: "SGCE0" + nextOrder,
                      user_id: user_uid,
                      priority: 1,
                      file_path: req.publicUrl,
                      price:  parseInt(json.copies)*(parseInt(json.colour) + parseInt(json.lamination) + parseInt(json.binding)),
                      binding: json.binding,
                      lamination: json.lamination,
                      page_orientation: json.orientation,
                      colour: json.colour,
                      copies: json.copies,
                      instructions: json.instructions,
                      payment_status: 'unpaid', 
                      order_status: 'pending'

                  }
                  req.order_id = data.order_id;
                  console.log("ORDER ID :" + req.order_id);
                  console.log(data);
                  trx.set(ordersRef, data);
                  trx.update(reproRef, { orders_placed: nextOrder });
          });
          console.log('Transaction success!');
          res.status(200);
          next(); 
          } catch (e) {
            console.log('Transaction failure:', e);
            res.status(400).send(e.message);
          }
          
          }

        const getOrder = async (req,res,next) => {
          const ordersRef = firestore.collection('orders');
          const snapshot = await ordersRef.where('order_id', '==', req.order_id).get();
          if (snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  

          snapshot.forEach(doc => {
            console.log("GET ORDER: ", doc.id, '=>', doc.data());
            req.order_data = doc.data();
          });
          next();
        }

        const deductBalance = async(req,res,next) => {
          const ordersRef = firestore.collection('orders');
          let order_docid;
          const orders_snapshot = await ordersRef.where('order_id', '==', req.params.order_id).get();
          if (orders_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          orders_snapshot.forEach(doc => {
            order_docid = doc.id;
            req.order_data = doc.data();
          });

          const userRef = firestore.collection("users");
          ////dummy user user@saintigits.org
          let user_uid;
          let user_data;
          const user_snapshot = await userRef.where('email', '==', 'user@saintgits.org').get();
          if (user_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          user_snapshot.forEach(doc => {
            user_uid= doc.id;
            user_data= doc.data();
          });

          try {
              await firestore.runTransaction(async (t) => {
                const balance = user_data.account_balance - req.order_data.price;
                if (balance < 0){
                  res.status(400).send("Transaction failure: Insufficent Balance: " + user_data.account_balance );
                }
                console.log("ACCOUNT BALANCE: " + balance)
                t.update(ordersRef.doc(order_docid), {payment_status: 'paid'});
                t.update(userRef.doc(user_uid), {account_balance: balance});
              });
              console.log('Transaction success!');
            } catch (e) {
              console.log('Transaction failure: Insufficent Balance: ', e);
              
            }
          next();
        }

        const getUserPendingOrders = async (req,res,next) => {
          const userRef = firestore.collection("users");
          ////dummy user user@saintigits.org
          let user_uid;
          const user_snapshot = await userRef.where('email', '==', 'user@saintgits.org').get();
          if (user_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          user_snapshot.forEach(doc => {
            user_uid= doc.id;
          });

          const ordersRef = firestore.collection('orders');
          const orders_snapshot = await ordersRef
          .where('user_id', '==', user_uid)
          .where('payment_status', '==', 'paid')
          .where('order_status', '==', 'pending')
          .get();
          if (orders_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          const order_array = [];

          orders_snapshot.forEach(doc => {
            req.order_data = doc.data();
            order_array.push(doc.data());
          });
          console.log(order_array);
          req.order_array = order_array;

          next();
        }

        const getUserCompletedOrders = async(req,res,next) => {
          const userRef = firestore.collection("users");
          ////dummy user user@saintigits.org
          let user_uid;
          const user_snapshot = await userRef.where('email', '==', 'user@saintgits.org').get();
          if (user_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          user_snapshot.forEach(doc => {
            user_uid= doc.id;
          });

          const ordersRef = firestore.collection('orders');
          const orders_snapshot = await ordersRef
          .where('user_id', '==', user_uid)
          .where('payment_status', '==', 'paid')
          .where('order_status', 'in', ['completed', 'collect now'])
          .get();
          if (orders_snapshot.empty) {
            console.log('No matching documents.');
            return;
          }  
          const order_array = [];

          orders_snapshot.forEach(doc => {
            req.order_data = doc.data();
            order_array.push(doc.data());
          });
          console.log(order_array);
          req.order_array = order_array;

          next();
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
    addOrder,
    getOrder,
    deductBalance,
    getUserPendingOrders,
    getUserCompletedOrders
}


// await firestore.collection('orders').doc().set(data);
          // res.send('Record saved successfuly');
          /////////////////////
          // try {
          //   await db.runTransaction(async (t) => {
          //     const doc = await t.get(cityRef);
          
          //     // Add one person to the city population.
          //     // Note: this could be done without a transaction
          //     //       by updating the population using FieldValue.increment()
          //     const newPopulation = doc.data().population + 1;
          //     t.update(cityRef, {population: newPopulation});
          //   });
          
          //   console.log('Transaction success!');
          // } catch (e) {
          //   console.log('Transaction failure:', e);
          // }



          //let counter = 1;
          // let form_data = req.body;
          // console.log(JSON.stringify(form_data));
          // let json = JSON.parse(JSON.stringify(form_data).replace(/"\s+|\s+"/g,'"'));
          // if(json.lamination === undefined){
          //   json.lamination = '0';
          // }
          // if(json.binding === undefined){
          //   json.binding = '0';
          // }
          // const data = {
          //   order_id: "SGCE0000" + counter,
          //   user_id: '123456789',
          //   priority: 1,
          //   file_path: req.publicUrl,
          //   price:  parseInt(json.copies)*(parseInt(json.colour) + parseInt(json.lamination) + parseInt(json.binding)),
          //   binding: json.binding,
          //   lamination: json.lamination,
          //   page_orientation: json.orientation,
          //   colour: json.colour,
          //   copies: json.copies,
          //   instructions: json.instructions,
          //   payment_status: 'unpaid'
            
          // }
          // console.log(data);