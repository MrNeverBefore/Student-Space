const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const articleRouter = require('./articles')
const methodOverride = require('method-override')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



//------------load models------------
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
const Thought = require('../models/Thought');


const { route } = require('./articles');



router.get('/articles',ensureAuthenticated, async (req, res) => {
  console.log(req.user.ID);
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles, user: req.user })
})

router.use('/articles', articleRouter)

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

//---------------------------------------acedmics--------------------------------------------------
router.get('/acedmics', ensureAuthenticated, (req, res) => {

  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    const batchId=req.user.batchId;
    const ID = req.user.ID;

    Batch.find({batchId:batchId},(err,batch)=>{
      if(err){
        res.redirect('/dashboard');
      }
      else{
        Subject.find({subjectId: {$in: batch[0].subject}},(err,subject)=>{
          if(err)
          {
            res.redirect('/');
          }
          else{


            Exam.find({subjectId: {$in: batch[0].exam}},(err,exam)=>{

              if(err)
              {
                res.redirect('/');
              }
              else{
                var examId=[];
                
                for(var i=0;i<exam.length;i++)
                {
                  examId.push(exam[i].examId);
                }
                Marks.find({examId: {$in: examId}},(err,marks)=>{

                  var usermarks=[];
                  var toppermarks=[];
                  var subjectCode=[];
                  var topperId=[]
                  var examname=[]
                  var examdate=[];
                  var examID=[];
                  const ID=req.user.ID;
                  for(var i=0;i<marks.length;i++)
                  {
                    examID[i]=marks[i].examId;
                    var temp=marks[i].studentId.indexOf(ID);
                    usermarks[i]=marks[i].obtainMarks[temp];
                    var topmarks=Math.max(...marks[i].obtainMarks)
                    var t=marks[i].obtainMarks.indexOf(topmarks)
                    topperId[i]=marks[i].studentId[t];
                    toppermarks[i]=topmarks;
                    for(var j=0;j<exam.length;j++)
                    {
                      if(exam[j].examId.localeCompare(marks[i].examId)==0)
                      {
                        subjectCode[i]=exam[j].subjectId;
                        examname[i]=exam[j].examTitle;
                        examdate[i]=exam[j].examDate.getDate()+"/"+exam[j].examDate.getMonth()+"/"+exam[j].examDate.getFullYear();
                        break;
                      }
                    }


                  }
                  
                  console.log(exam);
                 res.render('acedmics',{subject:subject,exam:exam,marks:marks,usermarks:usermarks,topmarks:toppermarks,topId:topperId,examdate:examdate,examname:examname,subjectCode:subjectCode,examID:examID})


                })

              }

            })



          }
        })
      }
    })
    
    
    


  }
}
);

//-------------------------------------Events------------------------------------------------------
router.get('/event', ensureAuthenticated, (req, res) => {

  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    const department= req.user.department;
    Event.find({eventDepartment: {$in: [department, 'ALL']}},(err,event)=>{
      console.log(event);
      res.render('event',{event:event})

    });


  }
}
);


//-------------------------------------Notice-------------------------------------


router.get('/notice',ensureAuthenticated, (req, res) =>{
  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    Notice.find({noticeDepartment:{$in: ["ALL",req.user.department]}},(err,notice)=>{
      res.render('notice',{notice:notice})
    });
    

   
  }

})




//-----------------------------------------resource-----------------------------------

router.get('/resource', ensureAuthenticated, (req, res) => {

  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    Resource.find({resourceDepartment:req.user.department},(err,resource)=>{
      var icon=[];
       const reso={
         Article:"fa-file-text-o",
         Pdf:"fa-file-pdf-o",
         Video:"fa-file-video-o",
         Book:"fa-book",
         Other:"fa-external-link" } 
         for(var i=0;i<resource.length;i++){
           console.log(resource[i]);
         if(resource[i].resourceType.localeCompare("Article")==0)
          icon[i]=reso.Article;
          if(resource[i].resourceType.localeCompare("Pdf")==0)
          icon[i]=reso.Pdf;
          if(resource[i].resourceType.localeCompare("Video")==0)
          icon[i]=reso.Video;
          if(resource[i].resourceType.localeCompare("Book")==0)
          icon[i]=reso.Book;
      
         }
         
         console.log(icon)
         res.render('resource',{resource:resource,icon:icon})

    })
  }
}
);



//--------------------------------------Thought Wall-------------------------------------------------------

router.get('/thought',ensureAuthenticated, (req, res) =>{
  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    Thought.find({},(err,thought)=>{
      console.log(thought)
      res.render('thought',{thought:thought});
    })

   
  }

})


router.get('/managethought',ensureAuthenticated, (req, res) =>{
  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    Thought.find({studentId:req.user.ID},(err,thought)=>{


      res.render('managethought',{thought:thought});
    })

   
  }

})
router.post('/managethought',(req, res) =>{
  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    const studentId=req.user.ID;
    const batchId=req.user.batchId;
    const studentName=req.user.name;
    const department=req.user.department;
    const thought=req.body.thought;
    const date= new Date();
        const newThought = new Thought({

          studentId,
          studentName,
          batchId,
          department,
          thought,
          date
        });
        newThought.save().then(user => {
          req.flash(
            'success_msg',
            '1 ID created Successfully'
          );
          res.redirect('managethought');
        })
          .catch(err => console.log("---" + err));
      
      
      
        }

})

router.post('/deletethought',(req, res) =>{
  const admin = "ADMIN";


  const target = req.user.ID;
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    console.log(req.body)
      
      Thought.remove({_id:req.body.id},(err,val)=>{
        if(err)
        {
          res.redirect('managethought')
        }
        else{
          
          res.redirect('managethought');
        }
      })
      
    
  }

})



//----------------------------------- Dashboard----------------------------------------------
router.get('/dashboard', ensureAuthenticated, (req, res) => {

  const admin = "ADMIN";
  const target = req.user.ID;
  const student = req.user;


  
  if (admin.localeCompare(target) == 0) {

    res.redirect('/');
  }
  else {
    
    Batch.find({batchId:student.batchId}, (err, batch) => {
      if (err) {
        res.redirect('/');
      }
      else {

        Attendance.find({attendanceBatchId:student.batchId}, (err, attendance) => {
          if (err) {
            res.redirect('/');
          }
          else {

            Subject.find({subjectDepartment:student.department}, (err, subject) => {
              if (err) {
                res.redirect('/');
              }else{

            //     console.log("student"+student);
            // console.log("batch"+batch);
            // console.log(attendance);
            // console.log(subject);
                Teacher.find({teacherId: {$in: [batch[0].hod, batch[0].mentor]}},(err,teach)=>{
                

                  User.find({batchId:batch[0].batchId},(err,batchMate)=>{

                   
                    res.render('dashboard', {user: req.user,batch:batch[0],attendance:attendance,subject:subject,teach:teach,batchMate:batchMate})


                  })





                })
             
              }
            });
            
            
            
          }
        })


        
      }
    })
    
  }
}
);

module.exports = router;
