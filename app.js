
let dbLayer = require("./db");

async function main() {
   let dbL = new dbLayer.MysqlLayer({basename:"my_bot", password:"65535258", user:"root", host:"localhost"});
   if(process.argv[4]=="all"){
         console.log("Converting from JSON..");
      await dbL._utilConvertToJson("28-ex_xml_atu.xml");
   }
    

    console.log("Init database..");
    await dbL.initDb();
   if(process.argv[4]=="all"){
         await dbL._utilFillTypesOfStreetsLocalities();
          console.log("Parce Streets, localities, regions, districts");
         await dbL._utilWriteAllRegionsDistrictsStreetsLocalities();
          console.log("Write relations REGION->DISTRICT..");
          await dbL._utilWriteRegionDistrictRelation();
        // console.log("write locations -locality (and it`s streets) region dstrict ");
        // await dbL._utilWriteKiewSevastopolCities("28-ex.json")
   }
  await dbL._utilWriteLocationsAndTheirStreets("28-ex.json");
   await dbL.closeDatabase();
}

main();