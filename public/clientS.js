const socket = io('http://localhost:3000'); //location of where server is hosting socket app

socket.on('chat-message', data =>{
    console.log(data)
});

// query DOM
const message = document.getElementById('message');
      handle = document.getElementById('handle');
      button =  document.getElementById('submit');
      output = document.getElementById('output');


// Emit events

button.addEventListener('click', () =>
{
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
})

// Listen to events

socket.on('chat', (data)=>{
    output.innerHTML += '<p> <strong>' + data.handle + ': </strong>' + data.message + '</p>'
})


//video call
//get the local video and displays it with permission
function getLVideo(callbacks){
navigator.getUserMedia =navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var constraints={
  audio:true,
  video:true
}
navigator.getUserMedia(constraints,callbacks.success,callbacks.error)

}
function recStream(stream,elemid){
  var video= document.getElementById(elemid);

  video.srcObject =stream;
  window.peer_stream = stream;
}
getLVideo({
  success: function(stream){
    window.localstream=stream;
    recStream(stream,'lVideo');

  },
   error: function(err){
     alert("canot access your camera");
     console.log(err);
   }
})

var conn;
var peer_id;

//creat a peer connection wit peer obj
var peer = new Peer();

//display the peer id on the DOM
peer.on('open',function(){
    document.getElementById("displayId").innerHTML=peer.id
})

peer.on('connection',function(connection) {
  conn=connection;
  peer_id=connection.peer
  document.getElementById('connId').value=peer_id;
});
peer.on('error',function(err){
   alert("an error has happened:" + err);
   console.log(err);
})

// onclick with the connection butt
document.getElementById('conn_button').addEventListener('click',function(){
   peer_id=document.getElementById("connId").value;

   if(peer_id){
      conn=peer.connect(peer_id)
   }else{
     alert("enter an id");
     return false;
   }
})

 // call on the click
 peer.on('call',function(call){
   var acceptCall=confirm("Do you want to answer the call?");

   if(acceptCall){
     call.answer(window.localstream);
     call.on('stream',function(stream){
       window.peer_stream=stream;
       recStream(stream,'rVideo')
     });
     call.on('close',function(){
       alert('the call has behind');
     })
   }else{
     console.log("call denied");
   }
 });


 // ask to calls
 document.getElementById('call_button').addEventListener('click',function(){
   console.log("calling a peer:"+peer_id);
   console.log(peer);

   var call=peer.call(peer_id,window.localstream);

   call.on('stream',function(stream){
     window.peer_stream = stream;

     recStream(stream,'rVideo');
   })
 })
