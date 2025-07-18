// Importar después de cargar las variables de entorno
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { mongoDB, socketServer, swaggerSpecs } from './config/index.js';
import * as routes from './routes/index.js';

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
await mongoDB.connectMongoDB();

// Rutas
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));
app.use('/api/auth', routes.authRoute);
app.use('/api/chatMessage', routes.chatMessageRoute);
app.use('/api/chat', routes.chatRoute);
app.use('/api/group', routes.groupRoute);
app.use('/api/user', routes.userRoute);

// Iniciar el servidor
const PORT = process.env.PORT_SERVER || 3000;
server.listen(PORT, () => {
  console.log(`*** Server in listening: ${process.env.HOST_SERVER}:${PORT} ***`);
  socketServer.getEventsSocket();
});