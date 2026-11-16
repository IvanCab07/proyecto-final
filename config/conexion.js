import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST || 'localhost',
    user: process.env.MYSQL_ADDON_USER || 'root',
    password: process.env.MYSQL_ADDON_PASSWORD || '',
    database: process.env.MYSQL_ADDON_DB || 'crud_juegos',
    port: process.env.MYSQL_ADDON_PORT || 3306,
    connectionLimit: 5
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
