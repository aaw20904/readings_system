
let dbLayer = require("./db");

async function main() {
    let dbL = new dbLayer.MysqlLayer({basename:"my_bot", password:"65535258", user:"root", host:"localhost"});
   // console.log("Converting from JSON..");
    //await dbL._utilConvertToJson("28-ex_xml_atu.xml");
    console.log("Init database..");
    await dbL.initDb();
   
    await dbL._utilFillTypesOfStreetsLocalities();
    // console.log("Parce Streets, localities, regions, districts");
   // await dbL._utilWriteAllRegionsDistrictsStreetsLocalities();
    console.log("Write relations REGION->DISTRICT..");
   //await dbL._utilWriteRegionDistrictRelation();
    await dbL._utilWriteKiewSevastopolCities("28-ex.json")
   await dbL.closeDatabase();
}

main();