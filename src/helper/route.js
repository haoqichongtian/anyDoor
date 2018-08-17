const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const ArtTemplate = require('art-template');
const path = require('path');
const mime = require('.//mime');
const compress = require('./compress');
const range= require('./range');
const isFresh = require('./cache');


const tplPath = path.join(__dirname, '../template/dir.html');
const source = fs.readFileSync(tplPath, 'utf8'); //必须准备的东西 同步
// const html = ArtTemplate.template(source.toString());

//异步调用改同步写法， 外层async包裹，内部异步函数使用await即可
module.exports = async function (req, res, filepath,conf) {
    try {
        const stats = await stat(filepath);
        if (stats.isFile()) {
            const contentType = mime(filepath);
            res.statusCode = 200;
            res.setHeader('Content-Type', contentType);
            if(isFresh(stats,req,res)){
                res.statusCode=304;
                res.end();
                return;
            }

            let rs;
            const {code,start,end} = range(stats.size,req,res);
            if(code==200){
                rs = fs.createReadStream(filepath);
            }else{
                rs = fs.createReadStream(filepath,{
                    start,
                    end
                });
            }
            // fs.readFile(filepath,(err,data)=>{
            //     if(err) throw err;
            //     res.end(data);
            // })
            if(filepath.match(conf.compress)){
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await readdir(filepath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(conf.root, filepath);
            const data = {
                title: path.basename(filepath),
                dir: dir?`/${dir}`:'',
                files:files.map(file=>{
                    return {
                        file,
                        icon:mime(file)
                    };
                })
            };
            let html = ArtTemplate(tplPath, data);
            // console.log(html);
            res.end(html);
            // res.end('xixi');
        }
    } catch (ex) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        // res.end(`${filepath} is not a dictionary or a file`);
        res.end(ex.toString());
        return;
    }
};
