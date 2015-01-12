var router = require('express').Router();
var UserStore = require('./user-store');

router.get('/signup', function(request, response){
  var user = UserStore.verifyCookie(request.cookies.user_id || null);
  if(!user){
    response.clearCookie('user_id');
    response.render('signup', { error: false });
  } 
  else response.redirect('/welcome');
});

router.get('/welcome', function(request, response){
  var user = UserStore.verifyCookie(request.cookies.user_id || null);
  if(!user){
    response.clearCookie('user_id');
    response.redirect('/signup');
  }
  else response.render('welcome', { username: user.username });
});

router.get('/clear', function(request, response){
  response.clearCookie('user_id');
  response.end("Done");
});

router.post('/signup', function(request, response){
  if(!UserStore.availableUsername(request.body.username))
    response.render('signup', { error: 'Username taken' });
  else if(request.body.password !== request.body.verify)
    response.render('signup', { error: 'Passwords do not match' });
  else{
    var cookieValue = UserStore.create({
      username: request.body.username,
      password: request.body.password
    });
    response.cookie('user_id', cookieValue);
    response.redirect('/welcome');
  }
});

module.exports = router;