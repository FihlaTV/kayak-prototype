let User = require('../models/user');
let UserDetail = require('../models/userDetail');
let bcrypt = require('bcryptjs');
let sanitizeHtml = require('sanitize-html');
let jwt = require('jsonwebtoken');

function handle_request(req, callback) {
  console.log("In handle request:" + JSON.stringify(req));

  let res;

  if (req.name === 'signup') {
    let adminFlag = false;
    if (req.body.isAdmin) {
      adminFlag = true;
    }
    let user = {
      email: sanitizeHtml(req.body.email),
      password: bcrypt.hashSync(sanitizeHtml(req.body.password), 10),
      isAdmin: adminFlag,
    };

    User.create(user)
      .catch((error) => {
        res = {
          status: 400,
          title: 'Signing up failed.',
          error: {message: 'Invalid Data.'},
        };
        callback(null, res);
      })
      .then((userObj) => {
        let userDetail = UserDetail({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        userDetail.save(function (error) {
          console.log(error);
        });
        let token;
        if (req.body.isAdmin) {
          token = jwt.sign({user: user}, 'admin', {expiresIn: 7200});
        } else {
          token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        }
        res = {
          status: 201,
          message: 'Successfully signed up.',
          token: token,
          id: userObj.email,
        };
        callback(null, res);
      });
  }

  if (req.name === 'signin') {
    User.find({email: sanitizeHtml(req.body.email)})
      .catch((error) => {
        res = {
          status: 401,
          title: 'Signing in failed.',
          error: {message: 'Invalid credentials.'},
        };
        callback(null, res);
      })
      .then((user) => {
        if (user) {
          if (!bcrypt.compareSync(sanitizeHtml(req.body.password), user.password)) {
            res = {
              status: 401,
              title: 'Signing in failed.',
              error: {message: 'Invalid credentials.'},
            };
            callback(null, res);
          } else {
            let token;
            if (req.body.isAdmin) {
              token = jwt.sign({user: user}, 'admin', {expiresIn: 7200});
            } else {
              token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
            }
            res = {
              status: 200,
              message: 'Successfully signed in.',
              token: token,
              id: user.email,
            };
            callback(null, res);
          }
        } else {
          res = {
            status: 401,
            title: 'Signing in failed.',
            error: {message: 'Invalid credentials.'},
          };
          callback(null, res);
        }
      });
  }

  if (req.name === 'getUser') {
    UserDetail.findOne({email: req.params.email}, (error, user) => {
      if (error || !user) {
        res = {
          status: 404,
          title: 'User not found.',
          error: {message: 'Failed to retrieve user.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 404,
          title: 'User not found.',
          error: {message: 'Failed to retrieve user.'},
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'updateUser') {
    UserDetail.findOneAndUpdate({email: req.params.email}, req.body, (error, user) => {
      if (error || !user) {
        res = {
          status: 404,
          title: 'User not found.',
          error: {message: 'Failed to update user.'},
        };
        callback(null, res);
      } else {
        res = {
          status: 200,
          message: 'Successfully updated user.',
          user: req.body,
        };
        callback(null, res);
      }
    });
  }

  if (req.name === 'deleteUser') {
    UserDetail.findOneAndRemove({email: req.params.email}, (error, user) => {
      if (error || !user) {
        res = {
          status: 404,
          title: 'User not found.',
          error: {message: 'Failed to delete user.'},
        };
        callback(null, res);
      } else {
        User.destroy({where: {email: req.params.email}});
        res = {
          status: 200,
          message: 'Successfully deleted user.',
        };
        callback(null, res);
      }
    });
  }

}

exports.handle_request = handle_request;
