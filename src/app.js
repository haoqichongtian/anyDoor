const conf = require('./config/defaultConfig');
const httpService = require('http');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Service{
    constructor(config){
        this.conf=Object.assign({},conf,config);
    }
    start(){
        const service = httpService.createServer((req, res) => {
            const filepath = path.join(this.conf.root, req.url);
            route(req,res,filepath,this.conf);

        });

        service.listen(this.conf.port, this.conf.hostname, () => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.info(`Service started at ${chalk.green(addr)}`);
            openUrl(addr); 
        });
    }
}

module.exports = Service;



