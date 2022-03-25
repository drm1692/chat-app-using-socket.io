const users = [];

//add user
const addUser = ({id, uname,  room}) => {

    //clean data
    uname = uname.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate data
    if(!uname || !room){
        return{
            error: "uname and room are required"
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        
        return (user.room === room && user.uname === uname)
    })

    //validate uname
    if(existingUser){

        return{
            error: 'uname is in use!'
        }
    }

    //store user
    const user = {id, uname , room}
    users.push(user);
    console.log(users);
    return { user }

}

//remove user
const removeUser = (id) => {

    const index = users.findIndex((user) => user.id === id);

    if(index != -1){

        return users.splice(index, 1)[0];
    }
}

//get user

const getUser = (id) => {

    const user = users.find((user) => {

        return (user.id === id);
    });
    return user;
}

//get user in room
const getUserInRoom = (room) => {

    const usersInRoom = users.filter((user) => user.room === room);

    if(!usersInRoom){
        return {
            error: "No user found in room"
        }
    }
    return usersInRoom;
}
module.exports = {

    addUser,
    removeUser,
    getUser,
    getUserInRoom
}