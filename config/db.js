import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const sequelize = new Sequelize( //Create Sequelize instance
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", //Dialect means: which database type?
    logging: false, //Stops Sequelize from printing raw SQL queries in the console.
    define: {
      timestamps: false,
      freezeTableName: true, //Sequelize defalts pluralizes table names
      underscored: false,
    },
  }
);

try {
  await sequelize.authenticate(); // checking database credentials are correct.
  console.log("** MySQL Connected via Sequelize **");
} catch (error) {
  console.error(" Unable to connect to the database:", error);
}

export default sequelize;
