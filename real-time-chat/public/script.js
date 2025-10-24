const socket = io();
let username = '';
let currentRoom = '';

function joinRoom() {
  username = document.getElementById('username').value;
  currentRoom = document.getElementById('room').value;

  if (!username || !currentRoom) {
    alert('Please enter both name and room');
    return;
  }

  socket.emit('joinRoom', currentRoom);
  document.getElementById('chat').innerHTML = '';
}

function sendMessage() {
  const message = document.getElementById('message').value;
  if (!message) return;

  socket.emit('chatMessage', {
    sender: username,
    message,
    room: currentRoom
  });

  document.getElementById('message').value = '';
}

socket.on('loadMessages', (messages) => {
  messages.forEach(msg => displayMessage(msg));
});

socket.on('message', (msg) => {
  displayMessage(msg);
});

function displayMessage(msg) {
  const chat = document.getElementById('chat');
  const div = document.createElement('div');
  div.innerHTML = `<strong>${msg.sender}</strong>: ${msg.message} <small>${new Date(msg.timestamp).toLocaleTimeString()}</small>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
