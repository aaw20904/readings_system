
let dbLayer = require("./db");

async function main(){
    let dbL = new dbLayer.MysqlLayer({basename:"my_bot",password:"65535258",user:"root",host:"localhost"});

await dbL.initDb();
await dbL.closeDatabase();
}

main()