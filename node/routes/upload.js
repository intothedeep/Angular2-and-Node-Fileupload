// eveything is in this file,
// but later I will split this into 2 parts,
// upload.js and fileController.js

var express = require('express');
var router = express.Router();
var fileModel = require('../models/file.js');
var counterModel = require('../models/counter.js');

var cors = require('cors');
var whitelist = ['http://localhost:4200'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

//multers disk storage settings
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

//multer settings
var upload = multer({ storage: storage }).single('file');

// include before other routes
router.options('*', cors(corsOptions));

// GET fileList
router.get('/', cors(corsOptions), function (req, res) {
  // get files where deleted field != 1
  fileModel.find({ deleted: { $ne:1 } }).sort({ fileSeq : -1 }).skip(0).limit(0).exec(function (err, files) {
      if (err) {
          return res.status(500).json({
              message: 'Error when getting article.',
              error: err
          });
      }
      return res.json(files);
  });
});

// GET file
router.get('/:fileSeq', cors(corsOptions), function (req, res) {
  var fileSeq = req.params.fileSeq;
  fileModel.findOne({ fileSeq:fileSeq  }).exec(function (err, file) {
      if (err) {
          return res.status(500).json({
              message: 'Error when getting article.',
              error: err
          });
      }
      return res.json(file);
  });
});

// GET searchFiles with key and word
router.get('/key/:key/word/:word', cors(corsOptions), function (req, res) {
  var key = req.params.key;
  var word = req.params.word;

  fileModel.find({
    originalname:{ $regex:new RegExp(word) },
    deleted: { $ne:1 }
  }).sort({ fileSeq:-1 }).exec(function (err, file) {
    if (err) {
        return res.status(500).json({
            message: 'Error when getting article.',
            error: err
        });
    }
    if (!file) {
        return res.status(404).json({
            message: 'No such article'
        });
    }
    return res.json(file);
  });
});

// POST upload file , API path that will upload the files
router.post('/upload', cors(corsOptions), function(req, res) {

  // with Multer, save file at ./uploads/
  upload(req, res, function(err){

    // create fileMOdel with req.file
    var file = new fileModel(req.file);
    if(err){
         res.json({error_code:1,err_desc:err});
         return;
    }

    // get sequence for upload file info
    var nextFileSeq = counterModel.increment('fileSeq', function (err, result) {
      if (err) {
        console.error('Counter save error: ' + err);
        return;
      }

      // set mymodel's sequence to next fileSeq gotten from the mongoDB collection, counters
      file.fileSeq = result.next;
      file.originalFileSeq = result.next;

      // create a file document at the mongoDB collection, files
      file.save(function (err, file) {
        if (err) {
          return res.status(500).json({
            message: 'Error when creating article',
            error: err
          });
        }
        return res.status(201).json({ error_code:0, err_desc:null, file:file });
      });

    });

  });

});

// PUT update file
router.put('/', cors(corsOptions), function(req, res) {
  var fileSeq = req.body.fileSeq;
  fileModel.findOne( { fileSeq:fileSeq }, function (err, file) {
      if (err) {
          return res.status(500).json({
              message: 'Error when getting article',
              error: err
          });
      }
      if (!file) {
          return res.status(404).json({
              message: 'No such article'
          });
      }

      file.originalname = req.body.originalname ? req.body.originalname : file.originalname;
      file.save(function (err, file) {
          if (err) {
              return res.status(500).json({
                  message: 'Error when updating article.',
                  error: err
              });
          }

          return res.json(file);
      });
    });
});

// DELETE file where fileSeq = :fileSeq
router.delete('/:fileSeq', cors(corsOptions), function(req, res) {
  var fileSeq = req.params.fileSeq;
  fileModel.findOne( { fileSeq:fileSeq }, function (err, file) {
      if (err) {
          return res.status(500).json({
              message: 'Error when getting article',
              error: err
          });
      }
      if (!file) {
          return res.status(404).json({
              message: 'No such article'
          });
      }

      file.deleted = 1;
      file.save(function (err, file) {
          if (err) {
              return res.status(500).json({
                  message: 'Error when updating article.',
                  error: err
              });
          }

          return res.json(file);
      });

  });

});

module.exports = router;
