const express = require('express');
const router = express.Router();
const Article = require('../models/article')
const articleRouter = require('./articles')
const methodOverride = require('method-override')

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { route } = require('./articles');



router.get('/articles',ensureAuthenticated, async (req, res) => {
  // console.log(req.user.ID);
  // const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('setting');
})

router.use('/articles', articleRouter)

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));

//acedmics
router.get('/acedmics', ensureAuthenticated, (req, res) =>{
  
  const admin="ADMIN";
    
    
      const target=req.user.ID;
      if(admin.localeCompare(target)==0)
        {
          
          res.redirect('/');
        }
        else{
  res.render('acedmics', {
    user: req.user
    
  })
}
}
);

//announcements
router.get('/announcements', ensureAuthenticated, (req, res) =>{
  
  const admin="ADMIN";
    
    
      const target=req.user.ID;
      if(admin.localeCompare(target)==0)
        {
          
          res.redirect('/');
        }
        else{
  res.render('announcements', {
    user: req.user
    
  })
}
}
);

//resource

router.get('/resource', ensureAuthenticated, (req, res) =>{
  
  const admin="ADMIN";
    
    
      const target=req.user.ID;
      if(admin.localeCompare(target)==0)
        {
          
          res.redirect('/');
        }
        else{
  res.render('resource', {
    user: req.user
    
  })
}
}
);

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  
  const admin="ADMIN";
    
    
      const target=req.user.ID;
      if(admin.localeCompare(target)==0)
        {
          
          res.redirect('/');
        }
        else{
  res.render('dashboard', {
    user: req.user
    
  })
}
}
);

module.exports = router;
