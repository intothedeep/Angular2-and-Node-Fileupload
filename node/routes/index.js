var express = require('express');
var router = express.Router();

// GET Index
router.get('/', function(req, res, next) {
  res.render('index', { title: 'File Upload Node Server!', REST: 'To call filupload API, use url : "/api/files/<RESTful source>"' });
});

module.exports = router;
