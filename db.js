const mysql = require('mysql2'); //database mamnagement system MySQL---------------------------
const fs = require("fs").promises;
const simpleFs = require("fs");
var xml2js = require('xml2js');
var iconv = require('iconv-lite');
/// making database    https://data.gov.ua/dataset/a2d6c060-e7e6-4471-ac67-42cfa1742a19
const mysqlPromise = require('mysql2/promise');

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
                            " UNIQUE INDEX `provider_UNIQUE` (`provider` ASC) VISIBLE);");

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
    //--'https://overpass-api.de/api/interpreter'  , OpenStreetMap
    //----Admin`s utility: export names of cities into the DB:
    async _utilWriteCities(filename="cities_ua.json"){
        let data;
        try{
            data = await fs.readFile(filename,{encoding:"utf8"});
        }catch(e){
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
        ///write into DB:
          await connection.query(`INSERT INTO cities (city) VALUES (?)`,[element.tags.name])
       }

       connection.release();
        
    }

        //--'https://overpass-api.de/api/interpreter'  , OpenStreetMap
    //----Admin`s utility: export names of cities into the DB:
    async _utilWriteVillages (filename="villages_ua.json") {
        let duplicated = 0;
        let data;
        try {
            data = await fs.readFile(filename,{encoding:"utf8"});
        } catch(e) {
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
        ///write into DB:
            try{
                await connection.query(`INSERT INTO villages (village) VALUES (?)`,[element.tags.name])
            }catch(e){
                //there are villages with the same name
                if(e.errno == 1062){
                    duplicated++;
                    process.stdout.write(`duplicated: ${duplicated}        \r`);
                }
            }     
       }
       connection.release();
    }

        //--'https://overpass-api.de/api/interpreter'  , OpenStreetMap
    //----Admin`s utility: export names of cities into the DB:
    async _utilWriteVillagesStreets(filename="villages_streets.json"){
        let duplicated = 0;
        let data;
        try {
        data = await fs.readFile(filename,{encoding:"utf8"});
        } catch(e) {
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
            if (element.type == "way") {
                ///write into DB:
                try {
                    if(element.tags.name){
                        await connection.query(`INSERT INTO streets (street) VALUES (?)`,[element.tags.name])
                    }
                    
                } catch(e) {
                    //there are villages with the same name
                     if (e.errno == 1062) {
                            duplicated++;
                            process.stdout.write(`duplicated: ${duplicated}        \r`);
                     }
                }
            }
       }

       connection.release();
 
    }

//----Admin`s utility: export names of cities into the DB:
    async _utilWriteCitiesStreets(filename="cities_streets.json"){
        let duplicated = 0;
        let data;
        try {
        data = await fs.readFile(filename,{encoding:"utf8"});
        } catch(e) {
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
            if (element.type == "way") {
                ///write into DB:
                try {
                    if(element.tags.name){
                        await connection.query(`INSERT INTO streets (street) VALUES (?)`,[element.tags.name])
                    }
                    
                } catch(e) {
                    //there are villages with the same name
                     if (e.errno == 1062) {
                            duplicated++;
                            process.stdout.write(`duplicated: ${duplicated}        \r`);
                     }
                }
            }
       }

       connection.release();
 
    }
//****  */



    

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

    ////GET  DATA FROM xml file - NEW active functions!!!!!!!!!!!!!!!!!!!!!!

    async _utilFillTypesOfStreetsLocalities () {
        //let jsonData = await fs.readFile('./28-ex.json');
       //  let mainObj = JSON.parse(jsonData);
        //
        let connection = await this.#bdPool.getConnection();
       try{
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (1,"м.");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (2,"с.");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (3,"сщ.");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (4,"смт.");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (5,"с/рада.");`);
                await connection.query(`INSERT INTO type_of_localities (loc_type, descr) VALUES (6,"_EMPTY");`);

                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (1, "вул.");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (2, "пров.");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (3, "пр.");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (4, "пл.");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (5, "інш");`);
                await connection.query(`INSERT INTO street_type (street_type, descr) VALUES (6, "_EMPTY");`);
       } catch (e) {

       } finally {
         connection.release();
       }
    }
    //admin`s function to fill the database
    
    /////////////////////////////////////////

    async _utilWriteRegionDistrictRelation(filename="28-ex.json"){
        let duplicated = 0;
        let created =0;
        let count=0;
        let combinationSet = new Set();
        let data;
        try {
             data = await fs.readFile(filename,{encoding:"utf8"});
        } catch(e) {
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
            count++;
            if (element.REGION_NAME[0] || element.OBL_NAME[0]) {
                if(! element.REGION_NAME[0]){
                    element.REGION_NAME[0]="_EMPTY";
                } if (! element.OBL_NAME[0]) {
                    element.OBL_NAME[0] = '_EMPTY';
                }
                //normalize strings
                let REG = this._normalizeString(element.REGION_NAME[0]);
                let OBL = this._normalizeString(element.OBL_NAME[0]);

                if (! combinationSet.has(`${OBL}${REG}`)) {
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
                
                process.stdout.write(`duplicated: ${duplicated}, created: ${created}, done:${ (count / (mainObject.length / 100))|0 } %    \r`);
            }
       }

       connection.release();
       console.log('******')
    }
   //////complex function to get all the streets districts (райони) regions (області)
   /////****************************************************************************
    async _utilWriteAllRegionsDistrictsStreetsLocalities (filename="28-ex.json") {
        let duplicated = 0;
        let created =0;
        let count=0;
        let data;
        let streetSet = new Set();
        let regionSet = new Set();
        let obltSet = new Set(); 
        let localitiesSet = new Set();

        try {
             data = await fs.readFile (filename,{encoding:"utf8"});
        } catch (e) {
            throw new Error(e);
        }
        //get a connection
        let connection = await this.#bdPool.getConnection();
        //converting to Object
        let mainObject = JSON.parse(data);
       for (const element of mainObject) {
            count++;
            ///districts - районы
            if (element.REGION_NAME[0]) {
                let tmp = this._normalizeString(element.REGION_NAME[0]);
                    //is a record exists?
                    if (! regionSet.has(tmp)) {
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

            process.stdout.write(`ALL duplicated: ${duplicated}, created: ${created}, done:${ (count / (mainObject.length / 100))|0 } %    \r`);
       }


        await connection.query(`INSERT INTO names_of_localities (locality) VALUES (?)`, ['_EMPTY']);
        await connection.query(`INSERT INTO streets (street) VALUES (?)`, ['_EMPTY']);
        await connection.query(`INSERT INTO regions (region) VALUES (?)`, ['_EMPTY']);
        await connection.query(`INSERT INTO districts (district) VALUES (?)`, ['_EMPTY']);

        connection.release();
        console.log('******')
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