import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || process.env.DB_HOST || 'b1ezlaur3p9lf21vog7q-mysql.services.clever-cloud.com',
    user: process.env.MYSQL_ADDON_USER || process.env.DB_USER || 'usy8u1h3vv09n2mw',
    password: process.env.MYSQL_ADDON_PASSWORD || process.env.DB_PASSWORD || 'H6elF83xSRsPeRC7MVBf',
    database: process.env.MYSQL_ADDON_DB || process.env.DB_NAME || 'b1ezlaur3p9lf21vog7q',
    port: Number(process.env.MYSQL_ADDON_PORT || process.env.DB_PORT || 3306),
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
    waitForConnections: true,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('Conectado a la base de datos MySQL');
        connection.release();
    })
    .catch(error => {
        console.error('Error de conexión a la base de datos:', error.message);
    });

export default pool;

