
let dbLayer = require("./db");
let binStore = require("./test_code");

async function main() {

   let dbL = new dbLayer.MysqlLayer({basename:"my_bot", password:"65535258", user:"root", host:"localhost"});
   dbL.binStore = binStore;

    if (process.argv[2]=="step_1") {
       await dbL._utilConvertToJson("28-ex_xml_atu.xml");
       await binStore.convertJsonFileToIndexedArrayFile("28-ex.json","28-ex.bin");
       return;
   }
   
   if (process.argv[2]=="step_2") {
       console.log("Init database..");
       await dbL.initDb();
         await dbL._utilFillTypesOfStreetsLocalities();
          console.log("Parce Streets, localities, regions, districts");
         await dbL._utilWriteAllRegionsDistrictsStreetsLocalitiesFromBinary();
        
          console.log("Write relations REGION->DISTRICT..");
         await dbL._utilWriteRegionDistrictRelationFromBinary();
           console.log("write locations -locality (and it`s streets) region dstrict ");
        await dbL._utilWriteKiewSevastopolCitiesFromBinary();
        await dbL.closeDatabase();
       return
   }
   ///  parse elems from 0 to 20000 - to fill locations and streets_in_locations tables
   //  call thes function several times - to reduce memory usage and preventing crash 
    ///  node app  0 20000  step_3   
    /// call next time: node app 20000 40000 step_3
   if(process.argv[2]=="step_3"){
      console.log("Init database..");
       await dbL.initDb();
      await dbL._utilWriteLocationsAndTheirStreetsAutomatically();
      await dbL.closeDatabase();
      return
   }

  //await dbL._utilWriteLocationsAndTheirStreets("28-ex.json");
  

   await dbL.closeDatabase();
}

main();