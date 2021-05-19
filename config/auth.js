module.exports = {
  ensureAuthenticatedADMIN: function(req, res, next) {
    // console.log(req.user.ID);
    if(typeof req.user==="undefined")
    {
      req.flash('error_msg', 'You are Not ADMIN');
      res.redirect('/');
    }
    else
    {
      
      const admin="ADMIN";
    
    
      const target=req.user.ID;
      if(admin.localeCompare(target)==0)
        {
          
          if (req.isAuthenticated()) {
            return next();
          }
        }
       
        req.flash('error_msg', 'You are Not ADMIN');
        res.redirect('/');
    }
    
  },
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/');
  },
  forwardAuthenticated: function(req, res, next) {
    
    if (!req.isAuthenticated()) {
      return next();
    }
    const admin="ADMIN";
    const target=req.user.ID;
    if(admin.localeCompare(target)==0)
      res.redirect('/users/welcome');
    else
      res.redirect('/dashboard');
  }
};
