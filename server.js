const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const { setupMaster, setupWorker } = require('@socket.io/sticky');

// Cria uma aplicação Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuração do Redis
const pubClient = redis.createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// Servir arquivos estáticos
app.use(express.static('public'));

// Configuração do Socket.io
io.on('connection', (socket) => {
    console.log('Novo usuário conectado');

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
