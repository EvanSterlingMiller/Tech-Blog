const Sequelize = require("sequelize"); // ORM library for SQL
require("dotenv").config();

let sequelize;

if (process.env.JAWSDB_URL) { // checks to see if JawsDB is available
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else { // if not it will use the information in the .env to set up the SQL database
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    })
}

sequelize
    .authenticate()
    .then(() => { // lets toe user know if it worked
        console.log("Connection has been established successfully.");
    })
    .catch((err) => { // lets the user know that it did not work
    console.error("Unable to connect to the database:", err);
});

module.exports = sequelize;
