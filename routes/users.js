const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const Notice = require('../models/Notice');
const Subject = require('../models/Subject');
const Event = require('../models/Event');
const Resource = require('../models/Resource');
const Exam = require('../models/Exam');
const Batch = require('../models/Batch');
const Marks = require('../models/Marks');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const { ensureAuthenticatedADMIN, forwardAuthenticated, ensureAuthenticated } = require('../config/auth');



// Register Page
router.get('/register', ensureAuthenticatedADMIN, (req, res) => res.render('register'));

// update Student Page
router.get('/updatestudent', ensureAuthenticatedADMIN, (req, res) => {
  User.find({}, function (err, user) {
    console.log(user[2].name);
    res.render('updatestudent', { user: user });
  })
});


router.post('/updatestudent', ensureAuthenticatedADMIN, (req, res) => {
  const department = req.body.department;
  const session = req.body.session;
  if (department == "All" && session == "All") {
    res.redirect('/users/updatestudent');
  }
  else if (department == "All") {
    User.find({ session: session }, function (err, user) {
      console.log(user);
      res.render('updatestudent', { user: user });
    })
  }
  else if (session == "All") {
    User.find({ department: department }, function (err, user) {
      console.log(user);
      res.render('updatestudent', { user: user });
    })
  }
  else {
    console.log(department, session);
    User.find({ department: department, session: session }, function (err, user) {
      console.log(user);
      res.render('updatestudent', { user: user });
    })
  }
});
//---------------------------------------- UPDATE STUDENT LIST---------------------------------------------------------------

router.get('/viewstudent', ensureAuthenticatedADMIN, (req, res) => res.render('viewstudent'));
router.post('/viewstudent', ensureAuthenticatedADMIN, (req, res) => {

  const ID = req.body.ID;
  console.log(ID);
  User.find({ ID: ID }, (err, user) => {
    if (err) {
      res.render('/users/updatestudent');
    }
    else {
      console.log(user[0]);
      var d = JSON.stringify(user[0].DoB);



      res.render('viewstudent', { user: user[0], DoB: d.substring(1, 11) });
    }
  })

});


//---------------------------------------- UPDATE STUDENT---------------------------------------------------------------
router.post('/updated', ensureAuthenticatedADMIN, (req, res) => {
  const { name, ID, gname, batchId, email, phone, gender, DoB, rollNo, regNo, department, session, password } = req.body;
  let errors = [];

  if (!name || !ID || !department || !regNo || !password || !gender || !gname || !session || !DoB || !rollNo || !phone || !email || !batchId) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('viewstudent', {
      errors,
      name,
      ID,
      department,
      regNo,
      password,
      password2
    });
  } else {

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;
        var p = hash;
        console.log(p);
        User.updateOne({ ID: ID }, {

          name: name,
          ID: ID,
          department: department,
          session: session,
          regNo: regNo,
          gender: gender,
          gname: gname,
          rollNo: rollNo,
          DoB: DoB,
          batchId: batchId,
          email: email,
          phone: phone,
          password: p


        }, function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.redirect('/users/updatestudent')
          }
        });
      });
    });






  }
});




//---------------------------------------------Attendance--------------------------------------------

router.get('/attendance', ensureAuthenticatedADMIN, (req, res) => {
 const batchInfo=[];
 const attendance=[];
 const attendanceMonth="";
 const user=[]
  Batch.find({},{batchId:1,_id:0}, (err, batch) => {
    if (err) {
      res.render('/users/welcome');
    }
    else {

      res.render('attendance', { batch: batch, batchInfo:batchInfo,attendance:attendance, user:user,attendanceMonth: attendanceMonth});
    }
  })

});

router.post('/attendance',(req,res)=>{



  const batchId = req.body.batchId;
  const attendanceMonth=req.body.attendanceMonth;
  Batch.find({},{batchId:1,_id:0}, (err, batch) => {
    if (err) {
      res.redirect('/users/attendance');;
    }
    else {

      Attendance.find({attendanceBatchId:batchId, attendanceMonth:attendanceMonth}, (err, attendance) => {
        if (err) {
          res.redirect('/users/attendance');
        }
        else {
          Batch.find({batchId:batchId}, (err, batchInfo) => {
            if (err) {
              res.redirect('/users/attendance');
            }
            else {
        
              User.find({batchId:batchId},{ID:1,_id:0,name:1,department:1,batchId:1}, (err, user) => {
                if (err) {
                  res.redirect('/users/attendance');
                }
                else {
            console.log(attendance);
                  res.render('attendance', { batch: batch, batchInfo:batchInfo[0],attendance:attendance[0],user:user ,attendanceMonth:attendanceMonth });
                }
              })
            }
          })
          
        }
      })
    }
  })

})

router.post('/saveattendance',(req,res)=>{
    console.log(req.body);
  const attendanceStudentId= req.body.attendanceStudentId;
  const attendanceBatchId= req.body.attendanceBatchId[0];
  const attendanceMonth= req.body.attendanceMonth[0];
  const attendanceYear= req.body.attendanceYear[0];
  const attendancePercentage= req.body.attendancePercentage;

  Attendance.findOne({ attendanceBatchId:attendanceBatchId, attendanceMonth:attendanceMonth }).then(user => {
    if (user) {
      
      Attendance.updateOne({ attendanceBatchId:attendanceBatchId, attendanceMonth:attendanceMonth }, {

        attendanceBatchId,
        attendanceMonth,
        attendanceYear,
        attendanceStudentId,
        attendancePercentage
      
  
  
      }, function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.redirect('/users/attendance')
        }
      });
    } else {
      const newAttendance = new Attendance({
        attendanceBatchId,
        attendanceMonth,
        attendanceYear,
        attendanceStudentId,
        attendancePercentage
      });

      newAttendance.save().then(user => {
        req.flash(
          'success_msg',
          '1 ID created Successfully'
        );
        res.redirect('/users/attendance');
      }).catch(err => console.log(err));
    };

  })



});



//---------------------------------ADD Teacher--------------------------------------------------------



router.get('/addteacher', ensureAuthenticatedADMIN, (req, res) => {

  res.render('addteacher');

});

router.post('/addteacher', (req, res) => {

  const { teacherName, teacherId, teacherDepartment, teacherGender, teacherEmail, teacherPhone } = req.body;
  let errors = [];
  console.log(req.body)
  console.log(teacherName, teacherId, teacherDepartment, teacherGender, teacherEmail, teacherPhone)
  if (!teacherName || !teacherId || !teacherDepartment || !teacherGender || !teacherEmail || !teacherPhone) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.render('addteacher');
  } 
  else {
    Teacher.findOne({ teacherId: teacherId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        res.render('addteacher');
      } else {
        const newTeacher = new Teacher({
          teacherName,
          teacherId,
          teacherDepartment,
          teacherGender,
          teacherEmail,
          teacherPhone
        });

        newTeacher.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
        }).catch(err => console.log(err));
      };

    })

    }

});


//--------------------------------Manage Teacher----------------------------------------------------


router.get('/manageteacher', ensureAuthenticatedADMIN, (req, res) => {

  Teacher.find({}, (err, teacher) => {
    if (err) {
      res.render('/users/welcome');
    }
    else {

      res.render('manageteacher', { teacher: teacher });
    }
  })

});

router.post('/manageteacher',(req,res)=>{



  const teacherDepartment = req.body.teacherDepartment;
  if (teacherDepartment == "All") {
    res.redirect('/users/manageteacher');
  }
  else {
    Teacher.find({ teacherDepartment: teacherDepartment }, function (err, teacher) {
      res.render('manageteacher', { teacher: teacher });
    })
  }

})

router.post('/updateteacher', ensureAuthenticatedADMIN, (req, res) => {
  const teacherId = req.body.teacherId;
  
  console.log(teacherId)
  Teacher.find({teacherId:teacherId}, (err, teacher) => {
    if (err) {
      res.redirect('/users/manageteacher');
    }
    else {
      console.log(teacher)
      res.render('updateteacher', { teacher: teacher[0] });
    }
  })

});



router.post('/saveteacher', ensureAuthenticatedADMIN, (req, res) => {
  const { teacherName, teacherId, teacherDepartment, teacherGender, teacherEmail, teacherPhone } = req.body;
  let errors = [];
  console.log(req.body)
  console.log(teacherName, teacherId, teacherDepartment, teacherGender, teacherEmail, teacherPhone)
  if (!teacherName || !teacherId || !teacherDepartment || !teacherGender || !teacherEmail || !teacherPhone) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors);
    res.redirect('/manageteacher');
  } 
  else {
    
    Teacher.updateOne({ teacherId: teacherId }, {

      teacherName,
          teacherId,
          teacherDepartment,
          teacherGender,
          teacherEmail,
          teacherPhone


    }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/users/manageteacher')
      }
    });

    }

    
});


//--------------------------------ADD Subjects------------------------------------------------------

router.get('/addsubject', ensureAuthenticatedADMIN, (req, res) => { res.render('addsubject') })
router.post('/addsubject', (req, res) => {
  console.log(req.body);
  const { subjectName, subjectId, subjectDepartment, subjectType } = req.body;
  let errors = [];

  if (!subjectName || !subjectId || !subjectDepartment || !subjectType) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('addstudent');
  } else {
    User.findOne({ subjectId: subjectId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        res.render('addsubject');
      } else {
        const newSubject = new Subject({

          subjectId,
          subjectName,
          subjectDepartment,
          subjectType
        });
        newSubject.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
          console.log(newSubject);
        })
          .catch(err => console.log(err));
      }
    });
  }
})




//----------------------------------------------------------ADD Notice-------------------------------------------

router.get('/addnotice', ensureAuthenticatedADMIN, (req, res) => {
  res.render('addnotice')

})


router.post('/addnotice', (req, res) => {
  const { noticeId, noticeTitle, noticeDesp, noticeDepartment } = req.body;
  console.log(req.body)
  let errors = [];

  if (!noticeId || !noticeTitle || !noticeDesp || !noticeDepartment) {
    errors.push({ msg: 'Please enter all fields' });
  }
  console.log(errors)
  if (errors.length > 0) {
    console.log(errors)
    res.render('addnotice');
  } else {
    User.findOne({ noticeId: noticeId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.render('addnotice');
      } else {
        var today = new Date();
        var dateOfNotice = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const newNotice = new Notice({

          noticeId,
          noticeTitle,
          noticeDesp,
          noticeDepartment,
          dateOfNotice
        });
        newNotice.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
          console.log(newNotice);
        })
          .catch(err => console.log(err));
      }
    });
  }
})




//-------------------------------ADD Events----------------------------------------------------------------

router.get('/addevent', ensureAuthenticatedADMIN, (req, res) => {
  res.render('addevent');

});
router.post('/addevent', (req, res) => {

  const { eventId, eventTitle, eventDesp, eventDepartment, eventDate } = req.body;
  console.log(req.body)
  console.log(eventId)
  let errors = [];

  if (!eventId || !eventTitle || !eventDesp || !eventDepartment || !eventDate) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('addevent');
  } else {
    User.findOne({ eventId: eventId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.render('addevent');
      } else {
        var today = new Date();
        var eventPublistDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const newEvent = new Event({

          eventId,
          eventTitle,
          eventDesp,
          eventDepartment,
          eventDate,
          eventPublistDate
        });
        newEvent.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
          console.log(newEvent);
        })
          .catch(err => console.log("---" + err));
      }
    });
  }

})







//--------------------------------------------ADD Resource--------------------------------------------------


router.get('/addresource', ensureAuthenticatedADMIN, (req, res) => {
  res.render('addresource');

});


router.post('/addresource', (req, res) => {

  const { resourceId, resourceTitle, resourceDesp, resourceDepartment, resourceLink, resourceSource, resourceAuthor } = req.body;
  console.log(req.body)
  let errors = [];

  if (!resourceId || !resourceTitle || !resourceDesp || !resourceDepartment || !resourceLink || !resourceSource || !resourceAuthor) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('addresource');
  } else {
    User.findOne({ resourceId: resourceId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.render('addevent');
      } else {
        var today = new Date();
        var resourcePublishDate = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
        const newResource = new Resource({

          resourceId,
          resourceTitle,
          resourceDesp,
          resourceLink,
          resourceAuthor,
          resourceDepartment,
          resourcePublishDate
        });
        newResource.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
        })
          .catch(err => console.log("---" + err));
      }
    });
  }

})



//-----------------------------------------ADD Exam------------------------------------


router.get('/addexam', ensureAuthenticatedADMIN, (req, res) => {
  res.render('addexam');

});


router.post('/addexam', (req, res) => {

  const { examId, examTitle, subjectId, examDate, fullMarks } = req.body;
  console.log(req.body)
  let errors = [];

  if (!examId || !examTitle || !subjectId || !examDate || !fullMarks) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('addexam');
  } else {
    User.findOne({ examId: examId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.render('addexam');
      } else {

        const newExam = new Exam({

          examId,
          examTitle,
          subjectId,
          examDate,
          fullMarks
        });
        newExam.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
        })
          .catch(err => console.log("---" + err));
      }
    });
  }

})


//---------------------------------------ADD Batch---------------------------------------------

router.get('/addbatch', ensureAuthenticatedADMIN, (req, res) => {

  Subject.find({}, (err, subj) => {
    if (err) {
      res.render('/users/welcome');
    }
    else {
      Exam.find({}, (err, examList) => {
        if (err) {
          res.render('/users/welcome');
        }
        else {
          console.log(subj);
          res.render('addbatch', { subj: subj, examList: examList });
        }
      })
    }
  })

});
router.post('/addbatch', (req, res) => {


  const { batchId, batchDepartment, admYear, mentor, hod, currentSem, currentYear, subject, exam } = req.body;
  console.log(req.body)
  let errors = [];

  if (!batchId || !batchDepartment || !admYear || !mentor || !hod || !currentSem || !currentYear || !subject || !exam) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('addbatch');
  } else {
    Batch.findOne({ batchId: batchId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.render('addbatch');
      } else {

        const newBatch = new Batch({

          batchId,
          batchDepartment,
          admYear,
          mentor,
          hod,
          currentSem,
          currentYear,
          subject,
          exam
        });
        newBatch.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/welcome');
        })
          .catch(err => console.log("---" + err));
      }
    });
  }

});




//----------------------------------------ADD marks---------------------------------------------

router.get('/addmarks', ensureAuthenticatedADMIN, (req, res) => {
  Exam.find({}, (err, exam) => {
    if (err) {
      res.render('/users/welcome');
    }
    else {

      console.log(exam);
      var user = [];
      res.render('addmarks', { exam: exam, user: user });
    }
  })


});

router.post('/addmarks', (req, res) => {
  const examId = req.body.examId;
  console.log(examId);
  Exam.find({ examId: examId }, (err, exam) => {

    if (err) {
      res.render('/users/welcome');
    }
    else {

      Batch.find({ exam: examId }, { batchId: 1, _id: 0 }, (err, batch) => {
        if (err) {
          res.render('/users/welcome');
        }
        else {
          for (var i = 0; i < batch.length; i++) {
            User.find({ batchId: batch[i].batchId }, (err, user) => {
              if (err) {
                res.redirect('/users/addmarks');
              }
              else {
                console.log(exam);
                res.render('addmarks', { exam: exam, user: user })
              }
            })
          }

          console.log(batch);

        }
      })
    }
  })


})


router.post('/savemarks', (req, res) => {



  const { examId, fullMarks, studentId, batchId, obtainMarks } = req.body;
  console.log(req.body)
  let errors = [];

  if (!examId || !fullMarks || !studentId || !batchId || !obtainMarks) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.redirect('/users/addmarks')
  } else {
    Marks.findOne({ studentId: studentId }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        console.log(errors)
        res.redirect('/users/addmarks')
      } else {

        const newMarks = new Marks({

          examId,
          studentId,
          batchId,
          fullMarks,
          obtainMarks
        });
        newMarks.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('/users/addmarks')
        })
          .catch(err => console.log("---" + err));
      }
    });
  }



});



//------------------------------------manage Batch----------------------------------------------------

router.get('/managebatch', ensureAuthenticatedADMIN, (req, res) => {



  Batch.find({}, (err, batch) => {
    if (err) {
      res.render('/users/welcome');
    }
    else {

      res.render('managebatch', { batch: batch });
    }
  })



});

router.post('/managebatch', (req, res) => {
  const batchId = req.body.batchId;
  console.log(batchId);
  Batch.find({ batchId: batchId }, (err, batch) => {
    if (err) {
      console.log(err);
      Batch.find({}, (err, batch) => {
        if (err) {
          res.render('/users/welcome');
        }
        else {

          res.render('managebatch', { batch: batch });
        }
      })
    }
    else {

      console.log(batch);

      Subject.find({}, (err, subj) => {
        if (err) {
          res.render('/users/welcome');
        }
        else {
          Exam.find({}, (err, examList) => {
            if (err) {
              res.render('/users/welcome');
            }
            else {
              console.log(subj);
              res.render('updatebatch', { subj: subj, examList: examList, batch: batch[0] });
            }
          })
        }
      })

    }
  })
});


router.post('/updatebatch', (req, res) => {


  const { batchId, batchDepartment, admYear, mentor, hod, currentSem, currentYear, subject, exam } = req.body;
  console.log(req.body)
  let errors = [];

  if (!batchId || !batchDepartment || !admYear || !mentor || !hod || !currentSem || !currentYear || !subject || !exam) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    console.log(errors)
    res.render('addbatch');
  } else {
    Batch.updateOne({ batchId: batchId }, {

      batchId,
      batchDepartment,
      admYear,
      mentor,
      hod,
      currentSem,
      currentYear,
      subject,
      exam


    }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.redirect('/users/managebatch')
      }
    });
  }

});



//---------------------------------------- ADMIN---------------------------------------------------------------

//Admin Page
router.get('/welcome', ensureAuthenticatedADMIN, (req, res) => { res.render('welcome') });

//Admin Page



//---------------------------------------- REGISTER STUDENT---------------------------------------------------------------

// Register
router.post('/register', (req, res) => {
  console.log(req.body);
  const { name, ID, gname, batchId, email, phone, gender, DoB, rollNo, regNo, department, session, password, password2 } = req.body;
  let errors = [];

  if (!name || !ID || !department || !regNo || !password || !password2 || !gender || !gname || !session || !DoB || !rollNo || !phone || !email || !batchId) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      ID,
      department,
      regNo,
      password,
      password2
    });
  } else {
    User.findOne({ ID: ID }).then(user => {
      if (user) {
        errors.push({ msg: 'ID already exists' });
        res.render('register', {
          errors,
          name,
          ID,
          department,
          regNO,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          ID,
          department,
          session,
          regNo,
          gender,
          gname,
          rollNo,
          DoB,
          batchId,
          email,
          phone,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  '1 ID created Successfully'
                );
                res.redirect('/users/welcome');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


//---------------------------------------- LOGIN---------------------------------------------------------------
// Login
router.post('/login', (req, res, next) => {
  const admin = "ADMIN"
  const response = req.body.ID;

  if (admin.localeCompare(response) == 0) {

    passport.authenticate('local', {
      successRedirect: '/users/welcome',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
    return
  } else {

    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  }

});


//---------------------------------------- LOGOUT---------------------------------------------------------------
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

module.exports = router;
