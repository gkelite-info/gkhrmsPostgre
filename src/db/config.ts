import { Sequelize } from "sequelize"
import dotenv from 'dotenv'
dotenv.config();

const dbName = process.env.DB_NAME as string
const dbHost = process.env.DB_HOST
const dbUsername = process.env.DB_USERNAME as string
const dbPassword = process.env.DB_PASSWORD
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;

function getConnection() {
    return new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres'
    })
}

const sequelizeConnection = getConnection()

export default sequelizeConnection;