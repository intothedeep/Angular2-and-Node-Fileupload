var fileModel = require('../models/file.js');
var counterModel = require('../models/counter.js');

var multer = require('multer');
//multers disk storage settings
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/');
    },
    filename: function (req, file, cb) {
      console.log(file);
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

//multer settings
var upload = multer({ storage: storage }).single('file');

/**
 * fileController.js
 *
 * @description :: Server-side logic for managing files.
 */
module.exports = {

    // POST fileController.uploadFile()
    uploadFile: (res, req) => {
        upload( res, req, function(err) {
            console.log(req.file);
            if(err){
              res.json({error_code:1, err_desc:err});
              return;
            }
            res.json({error_code:0,err_desc:null, sucess: "ok"});
            var nextSeq = counterModel.increment('fileSeq', function (err, nextFileSeq) {
              if (err) {
                console.error('Counter save error: ' + err);
                return;
              }
              return res.json(nextFileSeq.fileSeq);
            });
        });


    },


    //GET boardController.count()
    // totalArticle: (req, res) => {
    //
    //   articleModel.count().exec(function (err, count) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when getting article.',
    //                 error: err
    //             });
    //         }
    //         return res.json(count);
    //     });
    // }
};
