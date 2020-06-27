const http = require('http');
const fs = require('fs');
const moment = require('moment');
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var murl = require('url');
//var cs = require('cookie-session');
var web = express();
web.use(express.static('./'));
web.use(bodyParser.urlencoded({ extended: false }));
var fullName = '';
var headerConfig = multer.diskStorage({
    destination: './',
    filename: function (req, file, callback) {
        var nameArray = file.originalname;
        fs.readFile("./" + nameArray, 'utf8', function (err, data) {
            console.log(nameArray);
            if (err) {
                var index = Date.now();
                var imageName = nameArray// + '.' + type;
                fullName = imageName;
                callback(null, imageName);

            } else {
                console.log('文件重名！');
                function func() {
                    web.post('/upload', function (req, res) {
                        res.end('文件名称与现有文件名重复，请修改文件名。');
                    });
                } setTimeout(func, 3000, 'funky');
            }

        })
    }
})
var upload = multer({ storage: headerConfig });
    web.post('/upload', upload.single('photo'), function (req, res) {
        res.setHeader('Content-type','text/html;charset=utf-8');
        res.send('<head><meta http-equiv="refresh" content="10;url=http://192.168.0.107:10235/@pic.html"></head><p>上传成功，将在10秒后自动跳转</p>');
        var time = new Date().toLocaleString();
        console.log("[" + time + "]已上传文件");
    });
    web.get('/getMyHeader', function (req, res) {
        res.send('./' + fullName);
    })
    web.listen('10235', function () {
        console.log('服务器开启..');
    })