const fs=require('fs');
const express=require('express');
const app=express();
const moment=require('moment');
const url=require('url');
app.use(express.static(__dirname="./"));
app.get('/file',function(req,res,next){
    fs.readdir('./','utf8',function(err,data){
        var data_arr = [];
        var cont = 0;
        for(var i=0;i<data.length;i++){
            data_arr[i]={};
            (function(i){
                fs.stat(data[i],function(err,files){
                    cont++;
                    if(files.isFile()){
                        data_arr[i].type='f';
                    }else{
                        data_arr[i].type='d';
                    }
                    data_arr[i].name=data[i];
                    data_arr[i].size=files.size;
                    data_arr[i].mtime=moment(files.mtime).format('YYYY-MM-DD hh:mm:ss');
                    if(cont==data.length){
                        res.end(JSON.stringify(data_arr));
                    }
                })
            })(i);
        }
    })
})
app.get('*',function(req,res,next){
    var pathname=url.parse(req.url).pathname;
    var del_url=url.parse(req.url,true).query.id;
    if(req.url.substring(0,9)=='/download'){
        var name=req.url.substring(10,1000);
        var path='./'+name;
        var size=fs.statSync(path).size;
        var f= fs.createReadStream(path);
        res.writeHead(200,{
            'Content-Type':'application/force-download',
            'Content-Disposition':'attachment;filename='+name,
            'Content-Length':size
        });
        f.pipe(res);
        var time=new Date().toLocaleString();
        console.log("["+time+"]下载了 "+name);
    }else if(pathname=='/delete'){
        fs.unlink("./"+del_url,function(err){
            res.setHeader('Content-type','text/html;charset=utf-8');
            res.end('<p>已删除:'+del_url+'。错误:'+err+'</p>');
        })
    }
})
app.listen(3000,()=>{
    console.log('127.0.0.1:3000');
})