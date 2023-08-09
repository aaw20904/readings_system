const mysql = require('mysql2'); //database mamnagement system MySQL---------------------------

const mysqlPromise = require('mysql2/promise');

class MysqlLayer {
    #bdPool;
      constructor(par={basename:"basename", password:"psw", user:"usr",host:"host"}){
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

                let result = await connection.query(
                    "CREATE TABLE IF NOT EXISTS `user_mail` ("+
                        " `email` VARCHAR(45) NOT NULL, "+
                        " `user_id` BIGINT UNSIGNED NULL AUTO_INCREMENT," +
                        " PRIMARY KEY (`email`),"+
                        " UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE);"
                );
                result = result[0];

                result = await connection.query(
                    "CREATE TABLE IF NOT EXISTS `users` ("+
                            " `user_id` BIGINT UNSIGNED NOT NULL,"+
                            " `passw` BLOB NULL, "+
                            " `picture` BLOB NULL, "+
                            " `uname` VARCHAR(32) NULL, "+
                            " `salt` BLOB NULL, "+
                            " `fail_a` INT DEFAULT 0, "+
                            " `fail_date`BIGINT  UNSIGNED DEFAULT 0, "+
                            " `phone` VARCHAR(32) NULL, "+
                        " PRIMARY KEY (`user_id`),"+
                        // " CONSTRAINT `fk_user_id_user_m` "+
                            " FOREIGN KEY (`user_id`) "+
                            " REFERENCES `my_bot`.`user_mail` (`user_id`)" +
                            " ON DELETE CASCADE "+
                            " ON UPDATE NO ACTION);"
                );

                await connection.query("CREATE TABLE IF NOT EXISTS`areas` ("+
                             "`area_id` BIGINT UNSIGNED NOT NULL, "+
                            "`area` VARCHAR(32) NULL,"+
                            "PRIMARY KEY (`area_id`),"+
                            "UNIQUE INDEX `area_UNIQUE` (`area` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `regions` ("+
                            "`region_id` BIGINT UNSIGNED NOT NULL,"+
                            "`region` VARCHAR(32) NULL,"+
                            " PRIMARY KEY (`region_id`),"+
                            " UNIQUE INDEX `region_UNIQUE` (`region` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `streets` ("+
                            "`street_id` BIGINT UNSIGNED NOT NULL,"+
                            "`street` VARCHAR(32) NULL, "+
                            " PRIMARY KEY (`street_id`), "+
                            " UNIQUE INDEX `street_UNIQUE` (`street` ASC) VISIBLE);");

                await connection.query("CREATE TABLE  IF NOT EXISTS `villages` ("+
                            " `village_id` BIGINT UNSIGNED NOT NULL,"+
                            " `village` VARCHAR(32) NULL, "+
                            " PRIMARY KEY (`village_id`), "+
                            " UNIQUE INDEX `villages_UNIQUE` (`village` ASC) VISIBLE);");

                await connection.query("CREATE TABLE  IF NOT EXISTS `cities` ("+
                            " `city_id` BIGINT UNSIGNED NOT NULL,"+
                            " `city` VARCHAR(32) NULL, "+
                            " PRIMARY KEY (`city_id`),"+
                            " UNIQUE INDEX `city_UNIQUE` (`city` ASC) VISIBLE);");

                await connection.query("CREATE TABLE  IF NOT EXISTS `providers` ("+
                            "`provider_id` BIGINT UNSIGNED NOT NULL,"+
                            "`provider` VARCHAR(32) NULL, "+
                            " PRIMARY KEY (`provider_id`),"+
                            " UNIQUE INDEX `provider_UNIQUE` (`provider` ASC) VISIBLE);");

                await connection.query("CREATE TABLE IF NOT EXISTS `counter_type` ("+
                            " `counter_type` BIGINT UNSIGNED NOT NULL, "+
                            " `descr` VARCHAR(45) NULL, "+
                            " PRIMARY KEY (`counter_type`), "+
                            " UNIQUE INDEX `descr_UNIQUE` (`descr` ASC) VISIBLE);");
                            
                await connection.query(" CREATE TABLE IF NOT EXISTS `real_estate` ( " + 
                            " `estate_id` BIGINT UNSIGNED NOT NULL, " + 
                            " `user_id` BIGINT UNSIGNED NULL, " + 
                            " `city_id` BIGINT UNSIGNED NULL, " + 
                            " `village_id` BIGINT UNSIGNED NULL, " + 
                            " `region_id` BIGINT UNSIGNED NULL, " + 
                            " `area_id` BIGINT UNSIGNED NULL, " + 
                            " `street_id` BIGINT UNSIGNED NULL, " + 
                            " `house` VARCHAR(16) NULL, " + 
                            " `flat` INT UNSIGNED NULL, " + 
                            " PRIMARY KEY (`estate_id`), " + 
                            " INDEX `re_user_id_idx` (`user_id` ASC) VISIBLE, " + 
                            " INDEX `re_city_id_idx` (`city_id` ASC) VISIBLE, " + 
                            " INDEX `re_village_id_idx` (`village_id` ASC) VISIBLE, " + 
                            " INDEX `re_region_id_idx` (`region_id` ASC) VISIBLE, " + 
                            " INDEX `re_area_id_idx` (`area_id` ASC) VISIBLE, " + 
                            " INDEX `re_street_id_idx` (`street_id` ASC) VISIBLE, " + 
                            " CONSTRAINT `re_user_id` " + 
                            " FOREIGN KEY (`user_id`) " + 
                            " REFERENCES `my_bot`.`users` (`user_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `re_city_id` " + 
                            " FOREIGN KEY (`city_id`) " + 
                            " REFERENCES `my_bot`.`cities` (`city_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `re_village_id` " + 
                            " FOREIGN KEY (`village_id`) " + 
                            " REFERENCES `my_bot`.`villages` (`village_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `re_region_id` " + 
                            " FOREIGN KEY (`region_id`) " + 
                            " REFERENCES `my_bot`.`regions` (`region_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `re_area_id` " + 
                            " FOREIGN KEY (`area_id`) " + 
                            " REFERENCES `my_bot`.`areas` (`area_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE NO ACTION, " + 
                            " CONSTRAINT `re_street_id` " + 
                            " FOREIGN KEY (`street_id`) " + 
                            " REFERENCES `my_bot`.`streets` (`street_id`) " + 
                            " ON DELETE NO ACTION " + 
                            " ON UPDATE CASCADE); ");

                await connection.commit();
            
            ///return result[0];
        }catch(e){
             await connection.rollback();
            throw new Error(e);
        }finally{
            connection.release();
        }
        

    }

   
    //********************OK! tested
    async closeDatabase(){
        return await this.#bdPool.end();
     }
    ///***************OK! tested!! */
     async createNewUser (par={name:"",password:"", email:"example@mail.com", picture:"123", passw:0, salt:0, phone:"911"}) {
        let connection, generated_identifier;
         
            connection = await this.#bdPool.getConnection();
            await connection.beginTransaction();
            try{
             //firstly fill a user_mail table:
                generated_identifier = await  connection.query('INSERT INTO user_mail ( email) VALUES (?)', [par.email]);
                //get generated Id by system
                generated_identifier = generated_identifier[0].insertId;
                //write user info using gnerated by MySQL user_id:
                await connection.query('INSERT INTO users ( user_id, passw, picture, uname,  salt, phone) VALUES (?, ?, ?, ?, ?, ?)',
                                          [generated_identifier, par.password, par.picture, par.name, par.salt, par.phone]);
                //apply 
                await connection.commit();
                
            }catch(err){
                 let myErr = new Error(err);
               //has a user already exists?
                if(err.errno === 1062){
                    myErr.alrEx = true;
                } else{
                    myErr.alrEx =false;
                }
                
                await connection.rollback();
               
                
                throw myErr;
            }finally{
                connection.release();
            }
  
     }

   
     //OK!****************** tested
    async getUserByEmail (email) {
        let connection = await this.#bdPool.getConnection();
        let result = await connection.query(
            `SELECT * FROM users INNER JOIN user_mail WHERE user_mail.email="${email}" AND users.user_id=user_mail.user_id;`
        );
        connection.release();
        return result[0][0];
    }
///OK!*******tested
    async incrementFailLogins (user_id) {
        let connection = await this.#bdPool.getConnection();
        let result = await connection.query(`UPDATE users SET fail_a=fail_a+1, fail_date=UNIX_TIMESTAMP()*1000 WHERE user_id=?;`,[ user_id]);
        connection.release();
        if(result.length >= 1){
            return result[0].affectedRows;
        }else {
            return false;
        }
    }

//OK!*****tested
    async  clearUserBlocking (user_id) {
        let connection = await this.#bdPool.getConnection();
        let result = await  connection.query(`UPDATE users SET fail_a=0 WHERE user_id=? ;`,[user_id]);
        connection.release();
        if(result.length >= 1){
            return result[0].affectedRows;
        }else {
            return false;
        }

    }
   

}



module.exports ={ MysqlLayer};