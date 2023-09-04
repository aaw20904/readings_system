const mysql = require('mysql2'); //database mamnagement system MySQL---------------------------
const fs = require("fs").promises;
const simpleFs = require("fs");
var xml2js = require('xml2js');
var iconv = require('iconv-lite');
/// making database    https://data.gov.ua/dataset/a2d6c060-e7e6-4471-ac67-42cfa1742a19
const mysqlPromise = require('mysql2/promise');
const { cursorTo } = require('readline');

class MysqlLayer {
    #bdPool;
      constructor(par={basename:"name_of_database", password:"psw", user:"usr", host:"host"}){
          this.#bdPool = mysqlPromise.createPool({
            host: par.host,
            user: par.user,
            password: par.password,
            database: par.basename,
            connectionLimit: 10 // Specify the maximum number of connections in the pool
          });
    }

    getMysqlPool(){
        return this.#bdPool;
    }
    //**********OK! tested!
    async initDb(){
        let connection; 
       
                connection = await this.#bdPool.getConnection();
         try{
              await connection.beginTransaction();

                 await connection.query(
                    "CREATE TABLE IF NOT EXISTS `user_mail` ("+
                        " `email` VARCHAR(45) NOT NULL, "+
                        " `user_id` BIGINT UNSIGNED NULL AUTO_INCREMENT," +
                        " PRIMARY KEY (`email`),"+
                        " UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE);"
                );
               

                 connection.query(
                    "CREATE TABLE IF NOT EXISTS `users` ("+
                            " `user_id` BIGINT UNSIGNED NOT NULL,"+
                            " `passw` BLOB NULL, "+
                            " `picture` BLOB NULL, "+
                            " `uname` VARCHAR(45) NULL, "+
                            " `salt` BLOB NULL, "+
                            " `fail_a` INT DEFAULT 0, "+
                            " `fail_date`BIGINT  UNSIGNED DEFAULT 0, "+
                            " `phone` VARCHAR(45) NULL, "+
                        " PRIMARY KEY (`user_id`),"+
                        // " CONSTRAINT `fk_user_id_user_m` "+
                            " FOREIGN KEY (`user_id`) "+
                            " REFERENCES `my_bot`.`user_mail` (`user_id`)" +
                            " ON DELETE CASCADE "+
                            " ON UPDATE CASCADE);"
                );

              /*  await connection.query("CREATE TABLE IF NOT EXISTS `areas` ("+
                             "`area_id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, "+
                            "`area` VARCHAR(45) NULL,"+
                            "PRIMARY KEY (`area_id`),"+
                            "UNIQUE INDEX `area_UNIQUE` (`area` ASC) VISIBLE);");*/
                
                await connection.query(" CREATE TABLE IF NOT EXISTS `districts` ( " + 
                        " `district_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                        " `district` VARCHAR(45) NOT NULL, " + 
                        " PRIMARY KEY (`district_id`), " + 
                        " FULLTEXT INDEX `di_distr_sp` (`district`), " +
                        " UNIQUE INDEX `district_UNIQUE` (`district` ASC) VISIBLE); ");


                await connection.query("CREATE TABLE IF NOT EXISTS `regions` ("+
                            "`region_id` BIGINT UNSIGNED AUTO_INCREMENT  NOT NULL,"+
                            "`region` VARCHAR(45) NULL,"+
                            " PRIMARY KEY (`region_id`),"+
                            " FULLTEXT INDEX `rg_region_sp` (`region`), "+
                            " UNIQUE INDEX `region_UNIQUE` (`region` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `streets` ("+
                            "`street_id` BIGINT UNSIGNED  AUTO_INCREMENT  NOT NULL,"+
                            "`street` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`street_id`), "+
                            " FULLTEXT INDEX `str_spd` (`street`), "+
                            " UNIQUE INDEX `street_UNIQUE` (`street` ASC) VISIBLE);");

              /*  await connection.query("CREATE TABLE  IF NOT EXISTS `villages` ("+
                            " `village_id` BIGINT UNSIGNED  AUTO_INCREMENT NOT NULL,"+
                            " `village` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`village_id`), "+
                            " UNIQUE INDEX `villages_UNIQUE` (`village` ASC) VISIBLE);");

                await connection.query("CREATE TABLE  IF NOT EXISTS `cities` ("+
                            " `city_id` BIGINT UNSIGNED AUTO_INCREMENT  NOT NULL,"+
                            " `city` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`city_id`),"+
                            " UNIQUE INDEX `city_UNIQUE` (`city` ASC) VISIBLE);");*/

                await connection.query("CREATE TABLE  IF NOT EXISTS `providers` ("+
                            "`provider_id` BIGINT UNSIGNED AUTO_INCREMENT  NOT NULL,"+
                            "`provider` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`provider_id`),"+
                            " FULLTEXT INDEX `prov_spd` (`provider`), "+
                            " UNIQUE INDEX `provider_UNIQUE` (`provider` ASC) VISIBLE),"+
                            " FOREIGN KEY (`providers_region_id`) " + 
                            " REFERENCES `my_bot`.`regions` (`region_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE;");

                await connection.query("CREATE TABLE IF NOT EXISTS `counter_type` ("+
                            " `counter_type` BIGINT UNSIGNED  AUTO_INCREMENT  NOT NULL, "+
                            " `descr` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`counter_type`), "+
                            " FULLTEXT INDEX `cnt_t_spd` (`descr`), "+
                            " UNIQUE INDEX `descr_UNIQUE` (`descr` ASC) VISIBLE);");
                            ///***new */

                await connection.query(" CREATE TABLE IF NOT EXISTS `type_of_localities` ( " + 
                            " `loc_type` BIGINT UNSIGNED NOT NULL, " + 
                            " `descr` VARCHAR(45) NULL, " + 
                            " PRIMARY KEY (`loc_type`), " + 
                            " FULLTEXT INDEX `tl_spd` (`descr`)," + 
                            " UNIQUE INDEX `descr_UNIQUE` (`descr` ASC) VISIBLE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `names_of_localities` ( " + 
                            " `locality_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `locality` VARCHAR(45) NULL, " + 
                            " PRIMARY KEY (`locality_id`), " + 
                            " FULLTEXT INDEX `nl_spd` (`locality`), "+
                            " UNIQUE INDEX `locality_UNIQUE` (`locality` ASC) VISIBLE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `my_bot`.`region_district` ( " + 
                            " `rdi` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `region_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `district_id` BIGINT UNSIGNED NOT NULL, " + 
                            " PRIMARY KEY (`rdi`), " + 
                            " INDEX `rd_reg_idx` (`region_id` ASC) VISIBLE, " + 
                            " INDEX `rd_dist_idx` (`district_id` ASC) VISIBLE, " + 
                            " UNIQUE INDEX `rd_uni` (`region_id` ASC, `district_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `rd_reg` " + 
                            " FOREIGN KEY (`region_id`) " + 
                            " REFERENCES `my_bot`.`regions` (`region_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `rd_dist` " + 
                            " FOREIGN KEY (`district_id`) " + 
                            " REFERENCES `my_bot`.`districts` (`district_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");
                        
                await connection.query(" CREATE TABLE IF NOT EXISTS locations ( " + 
                            " locality_key BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " locality_id BIGINT UNSIGNED NOT NULL, " + 
                            " rdi BIGINT UNSIGNED NOT NULL, " + 
                            " loc_type BIGINT UNSIGNED NOT NULL, " + 
                            " PRIMARY KEY (locality_key), " + 
                            " INDEX loc_rdi_idx (rdi ASC) VISIBLE, " + 
                            " INDEX loc_locality_id_idx (locality_id ASC) VISIBLE, " + 
                            " INDEX loc_loc_type_idx (loc_type ASC) VISIBLE, " + 
                            " CONSTRAINT uc_unique_combination UNIQUE (locality_id, rdi, loc_type), " + 
                            " CONSTRAINT loc_locality_id " + 
                            " FOREIGN KEY (locality_id) " + 
                            " REFERENCES my_bot.names_of_localities (locality_id) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT loc_rdi " + 
                            " FOREIGN KEY (rdi) " + 
                            " REFERENCES my_bot.region_district (rdi) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " +  
                            " CONSTRAINT loc_loc_type " + 
                            " FOREIGN KEY (loc_type) " + 
                            " REFERENCES my_bot.type_of_localities (loc_type) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE " + 
                            " ); ")

                            
                await connection.query(" CREATE TABLE IF NOT EXISTS `real_estate` ( " + 
                            " `estate_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `user_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `locality_key` BIGINT UNSIGNED NOT NULL, " + 
                            " `house` VARCHAR(16) NULL, " + 
                            " `flat` INT NULL, " + 
                            " PRIMARY KEY (`estate_id`), " + 
                            " INDEX `re_user_id_idx` (`user_id` ASC) VISIBLE, " + 
                            " INDEX `re_locality_key_idx` (`locality_key` ASC) VISIBLE, " + 
                            " CONSTRAINT `re_user_id` " + 
                            " FOREIGN KEY (`user_id`) " + 
                            " REFERENCES `my_bot`.`users` (`user_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `re_locality_key` " + 
                            " FOREIGN KEY (`locality_key`) " + 
                            " REFERENCES `my_bot`.`locations` (`locality_key`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `counter` ( " + 
                            " `counter_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `factory_num` BIGINT UNSIGNED NULL, " + 
                            " `estate_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `verified` BIGINT UNSIGNED NULL, " + 
                            " `counter_type` BIGINT UNSIGNED NOT NULL, " + 
                            " PRIMARY KEY (`counter_id`), " + 
                            " INDEX `estate_id_idx` (`estate_id` ASC) VISIBLE, " + 
                            " INDEX `co_counter_type_idx` (`counter_type` ASC) VISIBLE, " + 
                            " CONSTRAINT `co_estate_id` " + 
                            " FOREIGN KEY (`estate_id`) " + 
                            " REFERENCES `my_bot`.`real_estate` (`estate_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `co_counter_type` " + 
                            " FOREIGN KEY (`counter_type`) " + 
                            " REFERENCES `my_bot`.`counter_type` (`counter_type`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `readings` ( " + 
                            " `read_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `counter_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `readings` BIGINT UNSIGNED NULL, " + 
                            " `time_s` BIGINT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`read_id`), " + 
                            " INDEX `rd_counter_id_idx` (`counter_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `rd_counter_id` " + 
                            " FOREIGN KEY (`counter_id`) " + 
                            " REFERENCES `my_bot`.`counter` (`counter_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");
                
                await connection.query(" CREATE TABLE IF NOT EXISTS `counter_provider` ( " + 
                            " `counter_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `provider_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `account` BIGINT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`counter_id`), " + 
                            " INDEX `cp_provider_id_idx` (`provider_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `cp_counter_id` " + 
                            " FOREIGN KEY (`counter_id`) " + 
                            " REFERENCES `my_bot`.`counter` (`counter_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `cp_provider_id` " + 
                            " FOREIGN KEY (`provider_id`) " + 
                            " REFERENCES `my_bot`.`providers` (`provider_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");

                await connection.query(" CREATE TABLE `my_bot`.`street_type` ( " + 
                            " `street_type` BIGINT UNSIGNED NOT NULL , " + 
                            " `descr` VARCHAR(45) NULL, " + 
                            " PRIMARY KEY (`street_type`), " + 
                            " INDEX `st_descr` (`descr` ASC) VISIBLE, " + 
                            " FULLTEXT INDEX `st_descr1` (`descr`) VISIBLE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `streets_in_localities` ( " + 
                            " `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `locality_key` BIGINT UNSIGNED NOT NULL, " + 
                            " `street_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `street_type` BIGINT UNSIGNED NOT NULL, " + 
                            " PRIMARY KEY (`id`), " + 
                            " INDEX `si_locality_key_idx` (`locality_key` ASC) VISIBLE, " + 
                            " INDEX `si_street_id_idx` (`street_id` ASC) VISIBLE, " + 
                            " INDEX `si_street_type_idx` (`street_type` ASC) INVISIBLE, " + 
                            " UNIQUE INDEX `si_composite` (`locality_key` ASC, `street_id` ASC, `street_type` ASC) VISIBLE, " + 
                            " CONSTRAINT `si_locality_key` " + 
                            " FOREIGN KEY (`locality_key`) " + 
                            " REFERENCES `my_bot`.`locations` (`locality_key`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `si_street_id` " + 
                            " FOREIGN KEY (`street_id`) " + 
                            " REFERENCES `my_bot`.`streets` (`street_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `si_street_type` " + 
                            " FOREIGN KEY (`street_type`) " + 
                            " REFERENCES `my_bot`.`street_type` (`street_type`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `provider_credentials` ( " + 
                            " `user_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `provider_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `usr_login` VARCHAR(45) NULL, " + 
                            " `usr_password` VARCHAR(45) NULL, " + 
                            " PRIMARY KEY (`user_id`, `provider_id`), " + 
                            " INDEX `pc_provider_id_idx` (`provider_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `pc_user_id` " + 
                            " FOREIGN KEY (`user_id`) " + 
                            " REFERENCES `my_bot`.`user_mail` (`user_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `pc_provider_id` " + 
                            " FOREIGN KEY (`provider_id`) " + 
                            " REFERENCES `my_bot`.`providers` (`provider_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");
              

                await connection.commit();
            
            ///return result[0];
        }catch(e){
             await connection.rollback();
            throw new Error(e);
        }finally{
            connection.release();
            return true;
        }
        

    }
    

    
////GET  DATA FROM xml file - NEW active functions!!!!!!!!!!!!!!!!!!!!!!
//Order when fill tables - 1
    async _utilConvertToJson (fname) {
        
        let xmlBuffer = await fs.readFile(fname);
        let xmlData = iconv.decode(xmlBuffer,"Windows-1251");
        //changing &apos; to ̕ 
        const outputString = xmlData.replace(/&apos;/g, "'");
        var parser = new xml2js.Parser({ emptyTag: null });
        let result = await parser.parseStringPromise(outputString);
        await fs.writeFile("28-ex.json", JSON.stringify(result.DATA.RECORD));
        console.log(new Date().toLocaleTimeString());
    }

    
//Order when fill tables - 2
    async _utilFillTypesOfStreetsLocalities () {

        let connection = await this.#bdPool.getConnection();
       try{
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (1,"м");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (2,"с");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (3,"сщ");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (4,"смт");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (5,"с/рада");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (6,"_EMPTY");`);

                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (1, "вул");`);//street
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (2, "пров");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (3, "пр");`);//prospect
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (4, "пл");`);//square
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (5, "б");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (6, "інш");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (7, "_EMPTY");`);
       } catch (e) {

       } finally {
         connection.release();
       }
    }

    ////order-3 new version with binary file:

    async _utilWriteAllRegionsDistrictsStreetsLocalitiesFromBinary (filename="28-ex.json") {
        let duplicated = 0;
        let created =0;
        let count=0;
        let data;
        let streetSet = new Set();
        let regionSet = new Set();
        let obltSet = new Set(); 
        let localitiesSet = new Set();
        let element;
        //creating a buffer for file I/O operations 
        let readBuffer = Buffer.allocUnsafe(1024);
        ///open a binary file
        let binFileDescryptor = await fs.open("28-ex.bin");
        //read an index table
        let indexTable = await this.binStore.readIndexTable(binFileDescryptor);
        //common count of cells in an array
        let amountOfCells = Number(indexTable.readBigUInt64BE(8));

        //get a SQL connection
        let connection = await this.#bdPool.getConnection();
       
       for (let recordNumber=0; recordNumber < amountOfCells; recordNumber++) {
            //read a record    from tthe bin file (a cell in an array)
            element = await this.binStore.readAndDecodeItem(binFileDescryptor, indexTable, readBuffer, recordNumber);
            count++;
            ///districts - районы
            if (element.REGION_NAME[0]) {
                let tmp = this._normalizeString(element.REGION_NAME[0]);
                    //is a record exists?
                    if ((! regionSet.has(tmp)) && (! tmp.includes("р."))) {
                        ///write into DB:
                            try {
                                    await connection.query(`INSERT INTO districts (district) VALUES (?)`, [tmp]);
                                    created++;
                            } catch(e) {
                                //there are villages with the same name
                                if (e.errno == 1062) {
                                        duplicated++;
                                }
                            }
                            regionSet.add(tmp);
                    }
                
            }  if (element.OBL_NAME[0]) {
                let tmp = this._normalizeString(element.OBL_NAME[0]);
                ///області - regions
                  if(! obltSet.has(tmp)) {
                        try {
                                await connection.query(`INSERT INTO regions (region) VALUES (?)`, [tmp]);
                                created++;
                                
                        } catch(e) {
                            //there are villages with the same name
                            if (e.errno == 1062) {
                                    duplicated++;
                            }
                        }
                        obltSet.add(tmp);
                  }
               
            }   if ( element.STREET_NAME[0]) {
                  let tmp = this._normalizeString(element.STREET_NAME[0]);
                //streets 
                    let fullName = tmp;
                    let stopSym = fullName.indexOf(".");
                    let onlyName;
                    if (stopSym > 0) {
                       onlyName = fullName.slice(stopSym + 1);
                    } else {
                        onlyName = fullName;
                    }
                    //is a record in Set?
                    if (! streetSet.has(onlyName)) {

                            try {
                                await connection.query(`INSERT INTO streets (street) VALUES (?)`, [onlyName]);
                                created++;
                            } catch (e) {
                                if (e.errno == 1062) {
                                    duplicated++;
                                } 
                            }       
                            //add a record in Set
                            streetSet.add(onlyName);
                    }         
                   
            } if (element.CITY_NAME[0])  {
                 let tmp = this._normalizeString(element.CITY_NAME[0]);
                 //city, village, etc 
                    let fullName = tmp;
                    let stopSym = fullName.indexOf(".");
                    let onlyName;
                    if (stopSym > 0) {
                       onlyName = fullName.slice(stopSym + 1);
                    } else {
                        onlyName = fullName;
                    }
                     //is a record in Set?
                    if (! localitiesSet.has(onlyName)) {

                           try {
                                await connection.query(`INSERT INTO names_of_localities (locality) VALUES (?)`, [onlyName]);
                                created++;
                            } catch (e) {
                                if (e.errno == 1062) {
                                    duplicated++;
                                } 
                            } 
                            localitiesSet.add(onlyName);
                    }


            }

            process.stdout.write(`ALL duplicated: ${duplicated}, created: ${created}, done:${ (count / (amountOfCells / 100))|0 } %    \r`);
       }

    
        ///insert Sevastopol city
      try{
            await connection.query("INSERT into names_of_localities (locality) VALUES ('Севастополь')"); 
            //insert "empty" names  
            await connection.query(`INSERT INTO names_of_localities (locality) VALUES (?)`, ['_EMPTY']);
            await connection.query(`INSERT INTO streets (street) VALUES (?)`, ['_EMPTY']);
            await connection.query(`INSERT INTO regions (region) VALUES (?)`, ['_EMPTY']);
            await connection.query(`INSERT INTO districts (district) VALUES (?)`, ['_EMPTY']);

      } catch(e) {
          console.log(e.errno);
      }
        connection.release();
        await binFileDescryptor.close()
    }

   

    ////new wersion - read binary file
    //Order when fill tables - 4
    async _utilWriteRegionDistrictRelationFromBinary (filename="28-ex.json") {
        let duplicated = 0;
        let created =0;
        let count=0;
        let element;
        let combinationSet = new Set();
      
        //get a SQL connection
        let connection = await this.#bdPool.getConnection();
        //creating a buffer for file I/O operations 
        let readBuffer = Buffer.allocUnsafe(1024);
        ///open a binary file
        let binFileDescryptor = await fs.open("28-ex.bin");
        //read an index table
        let indexTable = await this.binStore.readIndexTable(binFileDescryptor);
        //common count of cells in an array
        let amountOfCells = Number(indexTable.readBigUInt64BE(8));

      
       for (let cellIndex=0; cellIndex < amountOfCells; cellIndex++) {
            //read info from indexed store:
            element = await this.binStore.readAndDecodeItem (binFileDescryptor, indexTable, readBuffer, cellIndex);
             
            if (element.REGION_NAME[0] || element.OBL_NAME[0]) {
                if(! element.REGION_NAME[0]){
                    element.REGION_NAME[0]="_EMPTY";
                } if (! element.OBL_NAME[0]) {
                    element.OBL_NAME[0] = '_EMPTY';
                }
                //normalize strings
                let REG = this._normalizeString(element.REGION_NAME[0]);
                let OBL = this._normalizeString(element.OBL_NAME[0]);

                if (! combinationSet.has(`${OBL}${REG}`) && (! REG.includes("р."))) {
                        ///get identifiers
                        let regIdentifier, districtIdentifier;

                        regIdentifier = await connection.query(`SELECT region_id FROM regions WHERE region="${OBL}";`);
                        if (regIdentifier.length > 0) {
                             regIdentifier = regIdentifier[0][0].region_id;
                        }
                       
                        districtIdentifier = await connection.query(`SELECT district_id FROM districts WHERE district="${REG}";`)
                        if (districtIdentifier.length > 0) {
                            districtIdentifier = districtIdentifier[0][0].district_id;
                        }
                        
                        
                        ///write into DB:
                        try {
                                await connection.query(`INSERT INTO region_district (region_id,district_id) VALUES (?,?)`, [regIdentifier, districtIdentifier]);
                                created++;
                                
                        } catch (e) {
                            //there are villages with the same name
                            if (e.errno == 1062) {
                                    duplicated++;
                            }
                        }
                        combinationSet.add(`${OBL}${REG}`);
                }
                
                process.stdout.write(`duplicated: ${duplicated}, created: ${created}, done:${ (cellIndex / (amountOfCells / 100))|0 } %    \r`);
            }
       }

       ////At hthe end -add Kiev and Sevastopol
        //get identifier of a relation (region district)
        let kiewRdi = await connection.query (" SELECT  region_district.rdi FROM my_bot.region_district " + 
                " INNER JOIN regions ON regions.region_id=region_district.region_id " + 
                " INNER JOIN districts ON districts.district_id=region_district.district_id " + 
                " WHERE districts.district='_EMPTY' AND regions.region='м.Київ';");

        kiewRdi = kiewRdi[0][0].rdi;

         let sevastopolRdi = await connection.query (" SELECT  region_district.rdi FROM my_bot.region_district " + 
                    " INNER JOIN regions ON regions.region_id=region_district.region_id " + 
                    " INNER JOIN districts ON districts.district_id=region_district.district_id " + 
                    " WHERE districts.district='_EMPTY' AND regions.region='м.Севастополь';");
          sevastopolRdi=sevastopolRdi[0][0].rdi;//

          let kievNameCode = await connection.query("SELECT locality_id FROM names_of_localities"+
                                        " WHERE locality='Київ';");
              kievNameCode = kievNameCode[0][0].locality_id;
         let sevastopolNameCode = await connection.query("SELECT locality_id FROM names_of_localities"+
                                        " WHERE locality='Севастополь';");
                sevastopolNameCode = sevastopolNameCode[0][0].locality_id;
          // write Kiew and Sevastopol in "locations":
            await connection.query("INSERT INTO locations (loc_type, rdi, locality_id)"+
                    " VALUES (?,?,?);", [1, kiewRdi, kievNameCode]); 
                    
        // write Kiew and Sevastopol in "locations":
          await connection.query("INSERT INTO locations (loc_type, rdi, locality_id)"+
                    " VALUES (?,?,?);", [1, sevastopolRdi, sevastopolNameCode]); 
                  

       connection.release();
       await binFileDescryptor.close();
    }
   


    
  
   
/////new 
/////order -5
 async _utilWriteKiewSevastopolCitiesFromBinary (filename) {
        let errors=0;
        let duplicated=0;
        let written=0;
        let kiewRdi;
        let sevastopolRdi;
        let data;
        let connection = await this.#bdPool.getConnection();
        


        let kievSet = new Set();
        let sevastopolSet= new Set();

        //creating a buffer for file I/O operations 
        let readBuffer = Buffer.allocUnsafe(1024);
        ///open a binary file
        let binFileDescryptor = await fs.open("28-ex.bin");
        //read an index table
        let indexTable = await this.binStore.readIndexTable(binFileDescryptor);
        //common count of cells in an array
        let amountOfCells = Number(indexTable.readBigUInt64BE(8));    
       


        //get identifier of a relation (region district)
        kiewRdi = await connection.query(" SELECT  region_district.rdi FROM my_bot.region_district " + 
                " INNER JOIN regions ON regions.region_id=region_district.region_id " + 
                " INNER JOIN districts ON districts.district_id=region_district.district_id " + 
                " WHERE districts.district='_EMPTY' AND regions.region='м.Київ';");

        kiewRdi = kiewRdi[0][0].rdi;

         sevastopolRdi = await connection.query(" SELECT  region_district.rdi FROM my_bot.region_district " + 
                    " INNER JOIN regions ON regions.region_id=region_district.region_id " + 
                    " INNER JOIN districts ON districts.district_id=region_district.district_id " + 
                    " WHERE districts.district='_EMPTY' AND regions.region='м.Севастополь';");
          sevastopolRdi=sevastopolRdi[0][0].rdi;//

            
          let kievNameCode = await connection.query("SELECT locality_id FROM names_of_localities"+
                                        " WHERE locality='Київ';");
              kievNameCode = kievNameCode[0][0].locality_id;
         let sevastopolNameCode = await connection.query("SELECT locality_id FROM names_of_localities"+
                                        " WHERE locality='Севастополь';");
                sevastopolNameCode = sevastopolNameCode[0][0].locality_id;
          // write Kiew and Sevastopol in "locations":
          
          // read Kiew and Sevastopol in "locations":
          let kievLocalityKey = await connection.query("SELECT locality_key FROM locations "+
                    " WHERE rdi=? AND locality_id=?;", [ kiewRdi, kievNameCode]); 
                   kievLocalityKey = kievLocalityKey[0][0].locality_key;
        // read Kiew and Sevastopol in "locations":
          let sevastopolLocalityKey = await connection.query("SELECT locality_key FROM locations "+
                   " WHERE rdi=? AND locality_id=?;", [ sevastopolRdi, sevastopolNameCode]); 
                   sevastopolLocalityKey =  sevastopolLocalityKey[0][0].locality_key;

          //iterate an object
            for ( let itemNumber=0; itemNumber < amountOfCells; itemNumber++ ) {
                let item = await this.binStore.readAndDecodeItem(binFileDescryptor, indexTable, readBuffer, itemNumber);
                
                let normilized = this._normalizeString(item.OBL_NAME[0]);
                ///-----K I Y I V
                if (normilized.includes("м.Київ")) {
                    //is there any street?
                    if (item.STREET_NAME[0]) {
                        let normStreet= this._normalizeString(item.STREET_NAME[0]);
                        //what kind of street is there? 
                       let parts = normStreet.split(".").map(part => part.trim());
                       //is a record exists?
                         if (! kievSet.has(`${parts[0]}${parts[1]}`)) {

                               kievSet.add(`${parts[0]}${parts[1]}`)
                            ///load street/square/etc id:
                            let streetNameCode;
                            
                                switch(parts[0]){
                                    case "вул":
                                        try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                            if(streetNameCode[0][0]){
                                                streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 1])
                                                written++;
                                            }
                                            
                                        }catch(e){
                                          if (e.errno==1062) {
                                            duplicated++;
                                          } else{
                                            errors++;
                                          }
                                        }
                                    break;
                                    case "пл":
                                         try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                            if (streetNameCode[0][0]){
                                                streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 4])
                                                written++ 
                                            }
                                         
                                        }catch(e){
                                          if (e.errno==1062) {
                                            duplicated++;
                                          }else{
                                            errors++;
                                          }
                                        }
                                    break;
                                    case "пров":
                                         try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                            if(streetNameCode[0][0]){
                                                    streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 2])
                                                written++  
                                            }
                                          
                                        }catch(e){
                                          if (e.errno == 1062) {
                                            duplicated++;
                                          }else{
                                            errors++;
                                          }
                                        }
                                    break;
                                    case "пр":
                                         try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                            if(streetNameCode[0][0]){
                                                streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 3])
                                                written++ 
                                            }
                                           
                                        }catch(e){
                                          if (e.errno==1062) {
                                            duplicated++;
                                          }else{
                                            errors++;
                                          }
                                        }
                                    break;
                                    case "б":
                                         try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                            if(streetNameCode[0][0]){
                                                streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 5])
                                                written++ 
                                            }
                                           
                                        }catch(e){
                                          if (e.errno==1062) {
                                            duplicated++;
                                          }else{
                                            errors++;
                                          }
                                        }
                                    break;
                                    default:
                                         try{
                                            streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[0]]);
                                           
                                            if (streetNameCode[0][0]) {
                                                 streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                [kievLocalityKey, streetNameCode, 6])
                                                written++
                                            }
                                            
                                        }catch(e){
                                          if (e.errno==1062) {
                                            duplicated++;
                                          }else{
                                            errors++;
                                          }
                                        }
                                    break;
                                }
                         }
                    }
                    process.stdout.write(`ALL duplicated: ${duplicated}, created: ${written}, errors: ${errors}  \r`);

                } if (normilized.includes("м.Севастополь")) {
                    ///S E V A S T O P O L
                  //is there any street?
                  if (item.STREET_NAME[0]) {
                    let normStreet= this._normalizeString(item.STREET_NAME[0]);
                    //what kind of street is there? 
                   let parts = normStreet.split(".").map(part => part.trim());
                   //is a record exists?
                     if (! sevastopolSet.has(`${parts[0]}${parts[1]}`)) {
                        sevastopolSet.add(`${parts[0]}${parts[1]}`)
                        ///load street/square/etc id:
                        let streetNameCode;
                        
                            switch(parts[0]){
                                case "вул":
                                    try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                        
                                        if(streetNameCode[0][0]){
                                            streetNameCode = streetNameCode[0][0].street_id;
                                                await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                            [sevastopolLocalityKey, streetNameCode, 1])
                                            written++;
                                        }
                                       
                                    }catch(e){
                                      if (e.errno==1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                                case "пл":
                                     try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                        if (streetNameCode[0][0]) {
                                            streetNameCode = streetNameCode[0][0].street_id;
                                              await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                              [sevastopolLocalityKey, streetNameCode, 4])
                                             written++
                                        }
                                        
                                    }catch(e){
                                      if (e.errno==1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                                case "пров":
                                     try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[1]]);
                                        if (streetNameCode[0][0]) {
                                             streetNameCode = streetNameCode[0][0].street_id;
                                              await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                              [sevastopolLocalityKey, streetNameCode, 2])
                                             written++ 
                                        }
                                        
                                    }catch(e){
                                      if (e.errno == 1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                                case "пр":
                                     try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`, [parts[1]]);
                                        if(streetNameCode[0][0]){
                                             streetNameCode = streetNameCode[0][0].street_id;
                                            await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                            [sevastopolLocalityKey, streetNameCode, 3])
                                            written++
                                        }
                                       
                                    }catch(e){
                                      if (e.errno==1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                                case "б":
                                     try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`, [parts[1]]);
                                        if(streetNameCode[0][0]){
                                             streetNameCode = streetNameCode[0][0].street_id;
                                            await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                            [sevastopolLocalityKey, streetNameCode, 5]);
                                            written++
                                        }
                                       
                                    }catch(e){
                                      if (e.errno==1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                                default:
                                     try{
                                        streetNameCode = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[parts[0]]);
                                        if(streetNameCode[0][0]){
                                             streetNameCode = streetNameCode[0][0].street_id;
                                             await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                            [sevastopolLocalityKey, streetNameCode, 6]);
                                             written++  
                                        }
                                       
                                    }catch(e){
                                      if (e.errno==1062) {
                                        duplicated++;
                                      }else{
                                            errors++;
                                          }
                                    }
                                break;
                            }
                     }
                }
                process.stdout.write(`ALL duplicated: ${duplicated}, created: ${written}  errors: ${errors} \r`);

                }

            }
            /*****
            USE my_bot;
                SELECT streets.street FROM streets_in_localities 
                INNER JOIN streets ON streets.street_id=streets_in_localities.street_id 
                INNER JOIN locations ON locations.locality_key=streets_in_localities.locality_key
                INNER JOIN names_of_localities ON locations.locality_id=names_of_localities.locality_id
                WHERE names_of_localities.locality="Севастополь" ;
             */

         }






   /////modified!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Order-5
   async _utilWriteLocationsAndTheirStreetsAutomatically (filename) {
     let startTimeStamp = Date.now();
    let connection = await this.#bdPool.getConnection();
    let rdi, regionId, districtId;
    let errors=0;
    let count=0;
    let duplicated=0;
    let created =0;
    let loc_type, locality_id;
    let locationsSet = new Set();
    let streetsInLocationsSet= new Set();
    let data;
    let stage=0;
     let stepOfArray=10000;
     let startIndOfArray=0;
    let street_id, street_type;
    let locality_key;
  
  //creating a buffer for file I/O operations 
        let readBuffer = Buffer.allocUnsafe(1024);
        ///open a binary file
        let binFileDescryptor = await fs.open("28-ex.bin");
        //read an index table
        let indexTable = await this.binStore.readIndexTable(binFileDescryptor);
        //common count of cells in an array
        let amountOfCells = Number(indexTable.readBigUInt64BE(8));  
      //497464 - the length
   
      
         
        
         
            
                //iterate 

                for (let cellNumber=0; cellNumber < amountOfCells; cellNumber++) {
                    let record = await this.binStore.readAndDecodeItem(binFileDescryptor, indexTable, readBuffer, cellNumber);
                     
                    
                    //are OBL_NAME STREET_NAME exist?
                    if (record.OBL_NAME[0] && record.STREET_NAME[0]) {
                        //is RGION_NAME exists?
                        if (! record.REGION_NAME[0]) {
                            //when not - assign an empty constant 
                            record.REGION_NAME[0]="_EMPTY";
                        } 
                        //is a CITY_NAME exists?
                        if (! record.CITY_NAME[0]) {
                            //when not - assign an empty constant
                            record.CITY_NAME[0]="_EMPTY";
                        } 
                        ///normalize STREET_NAME, CITY_NAME, OBL_NAME
                        record.OBL_NAME[0] = this._normalizeString(record.OBL_NAME[0]);
                        record.CITY_NAME[0] = this._normalizeString(record.CITY_NAME[0]);
                        record.STREET_NAME[0] = this._normalizeString(record.STREET_NAME[0]);
                        record.REGION_NAME[0] = this._normalizeString(record.REGION_NAME[0]);
                        //split by the point "." symbol into two (or one) Array(s)
                        record.STREET_NAME = record.STREET_NAME[0].split(".").map(part => part.trim());
                        record.CITY_NAME = record.CITY_NAME[0].split(".").map(part => part.trim());
                        //record.OBL_NAME[0] = record.OBL_NAME[0].split(".").map(part => part.trim());
                        //get rdi for he {region, district} combination
                        
                        regionId = await connection.query(`SELECT region_id FROM regions WHERE region=?`,[record.OBL_NAME[0]]);
                        regionId = regionId[0][0].region_id;
                        districtId = await connection.query(`SELECT district_id FROM districts WHERE district=?`,[record.REGION_NAME[0]]);
                        if(!districtId[0][0]){
                            continue;
                        }
                        districtId = districtId[0][0].district_id;
                        rdi = await connection.query(`SELECT rdi FROM region_district WHERE region_id=? AND district_id=?`,[regionId, districtId]);
                        if (! rdi[0][0]){
                            //when RDI abscent - go to the next iteration
                            continue;
                        }
                        rdi = rdi[0][0].rdi;
                        ///select locality_id from "names_of_localities"
                        
                            //A)What kind of locality are there?
                            if (record.CITY_NAME.length == 2){  
                                //when a type of locality has been recognized
                                loc_type = await connection.query(`SELECT loc_type FROM type_of_localities WHERE descr=?`,[record.CITY_NAME[0]]);
                                locality_id = await connection.query(`SELECT locality_id FROM names_of_localities WHERE locality=?`,[record.CITY_NAME[1]]);
                            } else if(record.CITY_NAME[0]=="_EMPTY") {
                                //when a street without any locality
                                loc_type = await connection.query(`SELECT loc_type FROM type_of_localities WHERE descr="_EMPTY"`);
                                locality_id = await connection.query(`SELECT locality_id FROM names_of_localities WHERE locality=?`,[record.CITY_NAME[1]]);
                            } else {
                                    //when a 
                                loc_type = await connection.query(`SELECT loc_type FROM type_of_localities WHERE descr="інш"`); 
                                locality_id = await connection.query(`SELECT locality_id FROM names_of_localities WHERE locality=?`,[record.CITY_NAME[1]]);
                            }
                            if(! locality_id[0][0] || ! loc_type[0][0]){
                                continue
                            }

                            loc_type = loc_type[0][0].loc_type;
                            locality_id = locality_id[0][0].locality_id;
                            ///street type and street id
                        
                            if (record.STREET_NAME.length == 2){
                                //when a street type has been recognized
                                street_type = await connection.query(`SELECT street_type FROM street_type WHERE descr=?`,[record.STREET_NAME[0]]);
                                street_id = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[record.STREET_NAME[1]]);
                            } else {
                                street_type = await connection.query(`SELECT street_type FROM street_type WHERE descr="інш"`);
                                street_id = await connection.query(`SELECT street_id FROM streets WHERE street=?`,[record.STREET_NAME[0]]);
                            }
                            if(!  street_type[0][0] || ! street_id[0][0]){
                                continue;
                            }
                            street_type = street_type[0][0].street_type;
                            street_id = street_id[0][0].street_id;
                            /*------W R I T E   F I R S T   T R A N S A C T I O N  into "locations" table*/
                            if (!locationsSet.has(`${loc_type}${rdi}${locality_id}`)) {
                                //when a record isn`t  exists 
                                            //assign value
                                    locationsSet.add(`${loc_type}${rdi}${locality_id}`);
                                
                                    try{
                                        locality_key = await connection.query(`INSERT INTO locations (loc_type, rdi, locality_id) VALUES (?,?,?)`,
                                                            [loc_type, rdi, locality_id]);
                                        created++;
                                    } catch(e) {
                                        if(e.errno==1062){
                                            duplicated++;
                                        }
                                        errors++;
                                        continue;
                                    }
                                    locality_key=locality_key[0].insertId;  
                            }
                            

                            /***----W R I T E   S E C O N D   into "streets_in_locations" */
                            if (! streetsInLocationsSet.has(`${locality_key}${street_id}${street_type}`)) {
                                //when a record isn`t  exists  //assign value
                                    streetsInLocationsSet.add(`${locality_key}${street_id}${street_type}`);

                                    try {
                                        await connection.query(`INSERT INTO streets_in_localities (locality_key, street_id, street_type) VALUES (?,?,?)`,
                                                        [locality_key, street_id, street_type]);
                                        created++;
                                    } catch (e) {

                                        if (e.errno == 1062) {
                                            duplicated++;
                                        }else{
                                                    errors++;
                                                }
                                    }
                            } 
                            
                        
                            

                    }
                    
                    process.stdout.write(`processed:${cellNumber}, err:${errors}  duplicated: ${duplicated}, created: ${created}, done:${ (cellNumber / (amountOfCells / 100))|0 } %    \r`);
                }
             

      
   
  console.log(`Done by ${(Date.now()-startTimeStamp)/1000} seconds`);

}



 

    //********************OK! tested
    async closeDatabase () {
        return await this.#bdPool.end();
    }

    _normalizeString (str) {
        /**the function: removes spices in begin, removes spices after first point symbol".",
           cut anything after ",", or "(".
           EXAMPLE:
                before processing:    " с. Млинівка, Львівська тер.громада", " вул. Шкільна (Святошинський р-н)"
                after processing:     "с.Млинівка",                          "вул.Шкільна "
             */
             //нормализация вырезает пробелы в начале строки,
             //пробелы осле первой точки в строке
             //все что идет после запятой или открывающейся скобки
            // Remove spaces at the beginning of the string
        const trimmedString = str.replace(/^\s+/, '');

            // Remove spaces after a period
        const normalizedString = trimmedString.replace(/\.(\s*)/g, '.');

        // Remove everything after comma or opening parenthesis
    const stringWithoutExtraInfo = normalizedString.split(/,|\(/)[0].trim();

        return stringWithoutExtraInfo;

        
    }
   

}



module.exports ={ MysqlLayer};