/*
* later I will use this on instead of upload.js
*/

var express = require('express');
var router = express.Router();
var fileController = require('../controllers/fileController');

var cors = require('cors');
// Cross-Origin-Resource-Sharing
var whitelist = ['http://localhost:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
};

// include before other routes
router.options('*', cors(corsOptions));
// GET Index
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload Node Server' });
});
// POST upload file
router.post('/upload', cors(corsOptions), fileController.uploadFile);

module.exports = router;
