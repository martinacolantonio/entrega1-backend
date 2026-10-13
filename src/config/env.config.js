import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
    console.error("❌ Error crítico: Falta la variable PORT en el archivo .env");
    process.exit(1);
}

export default {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || 'development'
};