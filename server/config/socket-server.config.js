import { Server as SocketServer } from "socket.io";

let io = null;
const initSocketServer = (server) => {
    io = new SocketServer(server, {
        cors: {
            origin: "*",
        },
    });
};

const getEventsSocket = () => {
    io.sockets.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });

        socket.on("subscribe", (room) => {
            socket.join(room);
        });

        socket.on("unsubscribe", (room) => {
            socket.leave(room);
        });
    });
};

export {
    io,
    initSocketServer,
    getEventsSocket,
};