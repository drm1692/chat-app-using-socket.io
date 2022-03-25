const socket = io();

//elements
const form = document.querySelector('#message-form');
const formInput = form.querySelector('input');
const formBtn = form.querySelector('button');
const locationBtn = document.querySelector('#location')
const messages = document.querySelector('#messages');


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML
const {uname, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoScroll = () => {

    // //new message element
    // const newMessage = messages.lastElementChild;

    // //height of new message
    // const newMessageStyles = getComputedStyle(newMessage);
    // const newMessageMargine = parseInt(newMessageStyles.marginBottom);
    // const newMessageHeight = newMessage.offsetHeight + newMessageMargine;

    // //visable height
    // const visibleHeight = messages.offsetHeight

    // //Height of messages container
    // const containerHeight = messages.scrollHeight

    // //how far have i scrolled
    // const scrollOffset = messages.scrollTop + visibleHeight

    // if(containerHeight - newMessageHeight <= scrollOffset){

        //this line is only needed to always scrolldown to bottom of the chat.
        messages.scrollTop = messages.scrollHeight;
    // }
}
socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:a')
    });
    messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

socket.on('locationMessage', (url) => {
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm:a')
    })
    messages.insertAdjacentHTML("beforeend", html)
    autoScroll();
});

socket.emit('join',{uname, room}, (error) => {
    if(error){
        alert(error);
        location.href='/'
    }
});

socket.on('roomData', ({room, users}) => {

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
})

form.addEventListener('submit', (e) => {

    e.preventDefault();
    formBtn.setAttribute('disabled', 'disabled')
    const message = e.target.elements.msg.value
    socket.emit('sendMessage', message, (msg) => {

        formBtn.removeAttribute('disabled','disabled');
        formInput.value = '';
        formInput.focus();
    });
    
});
locationBtn.addEventListener('click', (e) => {

    locationBtn.setAttribute('disabled', 'disabled');
    if(!navigator.geolocation){
        return alert('geoLocation is not support in your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {

        // console.log(position)
        socket.emit('sendLocation',position.coords.latitude,position.coords.longitude, () => {
            console.log("location shared")
            locationBtn.removeAttribute('disabled')
        });
    })
});

