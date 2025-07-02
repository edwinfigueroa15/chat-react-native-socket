import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { mongoDB, socketServer } from './config/index.js';

// Configuración de variables de entorno
const envExtension = process.env.NODE_ENV || 'dev';
dotenv.config({ path: `./.env.${envExtension}` });

// Configuración del servidor
const app = express();
const server = http.createServer(app);
socketServer.initSocketServer(server);

// Configuración middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar carpeta de archivos
app.use(express.static("uploads"));

// Conectar a MongoDB
// mongoDB.connectMongoDB();

// Iniciar el servidor
const PORT = process.env.PORT_SERVER || 3000;
server.listen(PORT, () => {
  console.log(`SERVER IN LISTENING: ${process.env.HOST_SERVER}:${PORT}`);
  socketServer.getEventsSocket();
});