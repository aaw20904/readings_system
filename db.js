const mysql = require('mysql2'); //database mamnagement system MySQL---------------------------
const fs = require("fs").promises;
const simpleFs = require("fs");
var xml2js = require('xml2js');
var iconv = require('iconv-lite');
/// making database    https://data.gov.ua/dataset/a2d6c060-e7e6-4471-ac67-42cfa1742a19
const mysqlPromise = require('mysql2/promise');

class MysqlLayer {
    #bdPool;
      constructor(par={basename:"name_of_database", password:"psw", user:"usr",host:"host"}){
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
                        " UNIQUE INDEX `district_UNIQUE` (`district` ASC) VISIBLE); ");


                await connection.query("CREATE TABLE IF NOT EXISTS `regions` ("+
                            "`region_id` BIGINT UNSIGNED AUTO_INCREMENT  NOT NULL,"+
                            "`region` VARCHAR(45) NULL,"+
                            " PRIMARY KEY (`region_id`),"+
                            " UNIQUE INDEX `region_UNIQUE` (`region` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `streets` ("+
                            "`street_id` BIGINT UNSIGNED  AUTO_INCREMENT  NOT NULL,"+
                            "`street` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`street_id`), "+
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
                            " UNIQUE INDEX `provider_UNIQUE` (`provider` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `counter_type` ("+
                            " `counter_type` BIGINT UNSIGNED  AUTO_INCREMENT  NOT NULL, "+
                            " `descr` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`counter_type`), "+
                            " UNIQUE INDEX `descr_UNIQUE` (`descr` ASC) VISIBLE);");
                            ///***new */
                await connection.query("")
                            
                await connection.query(" CREATE TABLE IF NOT EXISTS `real_estate` ( " + 
                            " `estate_id` BIGINT UNSIGNED AUTO_INCREMENT NOT NULL, " + 
                            " `user_id` BIGINT UNSIGNED NULL, " + 
                            " `city_id` BIGINT UNSIGNED NULL, " + 
                            " `village_id` BIGINT UNSIGNED NULL, " + 
                            " `region_id` BIGINT UNSIGNED NULL, " + 
                            " `district_id` BIGINT UNSIGNED NULL, " + 
                            " `street_id` BIGINT UNSIGNED NULL, " + 
                            " `house` VARCHAR(16) NULL, " + 
                            " `flat` INT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`estate_id`), " + 
                            " INDEX `re_user_id_idx` (`user_id` ASC) VISIBLE, " + 
                            " INDEX `re_city_id_idx` (`city_id` ASC) VISIBLE, " + 
                            " INDEX `re_village_id_idx` (`village_id` ASC) VISIBLE, " + 
                            " INDEX `re_region_id_idx` (`region_id` ASC) VISIBLE, " + 
                            " INDEX `re_district_id_idx` (`district_id` ASC) VISIBLE, " + 
                            " INDEX `re_street_id_idx` (`street_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `re_user_id` " + 
                            " FOREIGN KEY (`user_id`) " + 
                            " REFERENCES `my_bot`.`users` (`user_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE , " + 
                            " CONSTRAINT `re_city_id` " + 
                            " FOREIGN KEY (`city_id`) " + 
                            " REFERENCES `my_bot`.`cities` (`city_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE , " + 
                            " CONSTRAINT `re_village_id` " + 
                            " FOREIGN KEY (`village_id`) " + 
                            " REFERENCES `my_bot`.`villages` (`village_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `re_region_id` " + 
                            " FOREIGN KEY (`region_id`) " + 
                            " REFERENCES `my_bot`.`regions` (`region_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `re_district_id` " + 
                            " FOREIGN KEY (`district_id`) " + 
                            " REFERENCES `my_bot`.`districts` (`district_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE, " + 
                            " CONSTRAINT `re_street_id` " + 
                            " FOREIGN KEY (`street_id`) " + 
                            " REFERENCES `my_bot`.`streets` (`street_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");

                await connection.query(" CREATE TABLE IF NOT EXISTS `counter` ( " + 
                            " `counter_id` BIGINT UNSIGNED  AUTO_INCREMENT NOT NULL, " + 
                            " `factory_num` BIGINT UNSIGNED NULL, " + 
                            " `estate_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `verified` BIGINT UNSIGNED NULL, " + 
                            " `counter_type` BIGINT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`counter_id`), " + 
                            " INDEX `co_estate_id_idx` (`estate_id` ASC) VISIBLE, " + 
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

                await connection.query(" CREATE TABLE  IF NOT EXISTS `readings` ( " + 
                            " `read_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, " + 
                            " `counter_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `readings` BIGINT UNSIGNED NULL, " + 
                            " `time_s` BIGINT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`read_id`), " + 
                            " INDEX `rd_counter_id_idx` (`counter_id` ASC) VISIBLE, " + 
                            " INDEX `rd_time_s` (`time_s` ASC) VISIBLE, " + 
                            " CONSTRAINT `rd_counter_id` " + 
                            " FOREIGN KEY (`counter_id`) " + 
                            " REFERENCES `my_bot`.`counter` (`counter_id`) " + 
                            " ON DELETE CASCADE " + 
                            " ON UPDATE CASCADE); ");
                
                await connection.query(" CREATE TABLE   IF NOT EXISTS `counter_provider` ( " + 
                            " `counter_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `provider_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `account` BIGINT UNSIGNED NOT NULL, " + 
                            " INDEX `cop_cnt_id_idx` (`counter_id` ASC) VISIBLE, " + 
                            " INDEX `cop_prov_id_idx` (`provider_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `cop_cnt_id` " + 
                            " FOREIGN KEY (`counter_id`) " + 
                            " REFERENCES `my_bot`.`counter` (`counter_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `cop_prov_id` " + 
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
//******** */

//----Admin`s utility: export names of cities into the DB:
    async _utilWriteRegions(filename="regions_ua.json"){
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
       for (const element of mainObject.elements) {
            if (element.tags["ISO3166-2"]) {
                ///write into DB:
                try {
                    if(element.tags.name){
                        await connection.query(`INSERT INTO regions (region) VALUES (?)`,[element.tags.name])
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
    async _utilWriteDistricts(filename="districts_ua.json"){
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
       for (const element of mainObject.elements) {
            if ( ! element.tags["addr:country"]) {
                ///write into DB:
                try {
                    if(element.tags.name){
                        await connection.query(`INSERT INTO districts (district) VALUES (?)`,[element.tags.name])
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

    async _utilTest(fname){
        
        let xmlBuffer = await fs.readFile(fname);
        let xmlData = iconv.decode(xmlBuffer,"Windows-1251");
        //changing &apos; to ̕ 
        const outputString = xmlData.replace(/&apos;/g, "'");
        var parser = new xml2js.Parser({ emptyTag: null });
        let result = await parser.parseStringPromise(outputString);
        await fs.writeFile("28-ex.json", JSON.stringify(result.DATA.RECORD));
        console.log(new Date().toLocaleTimeString());
    }
 

    //********************OK! tested
    async closeDatabase(){
        return await this.#bdPool.end();
    }
   

}



module.exports ={ MysqlLayer};