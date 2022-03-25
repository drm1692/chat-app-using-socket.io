const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const port = process.env.PORT || 3000
const publiDirPath = path.join(__dirname, '../public');
const io = socketio(server);
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users');

app.use(express.static(publiDirPath));

io.on('connection', (socket) => {


    socket.on('join', ({uname, room}, callback) => {

        const {error, user} = addUser({id: socket.id, uname, room})

        if(error){
           return callback(error)
        }
        socket.join(user.room);
        socket.emit('message',generateMessage('Admin','Welcome!'));

        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.uname} has joined room!`))
        
        io.to(user.room).emit('roomData', {

            room: user.room,
            users:  getUserInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id);

        io.to(user.room).emit('message', generateMessage(user.uname,message));
        callback();
    })
   
    socket.on('sendLocation', (latitude, longitude, callback) => {

        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.uname,`https://google.com/maps?q=${latitude},${longitude}`));
        callback()
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)
        if(user){

            io.to(user.room).emit('message', generateMessage('Admin',`${user.uname} is left`))
            socket.to(user.room).emit('roomData', {

                room: user.room,
                users:  getUserInRoom(user.room)
            })
        }
    })

})

server.listen(port, () => {

    console.log("server is up on port:",port);
})