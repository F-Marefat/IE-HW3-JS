// open popup window
// send starting msg to server, to start new chat
// add action listener
 function open_popup_window(){
    document.getElementById("popwindow").style.display = "block";
    document.getElementById("popbox").style.display = "none";
    start();
    // set enter key as action listener
     var input = document.getElementById("message");
     // Execute a function when the user releases a key on the keyboard
     input.addEventListener("keyup", function(event) {
       // Cancel the default action, if needed
       event.preventDefault();
       // Number 13 is the "Enter" key on the keyboard
       if (event.keyCode === 13) {
         // Trigger the button element with a click
         document.getElementById("send-but").click();
       }
     });
 }
// close popup window
 function close_popup_window(){
    document.getElementById("popwindow").style.display = "none";
    document.getElementById("popbox").style.display = "block";
 }
// start chating with server
 function start(){
    var xmlhttp=new XMLHttpRequest();
    url = "http://51.15.59.130:46260/start";
    xmlhttp.open("GET",url,false);
    xmlhttp.send(null);
    var res = JSON.parse(xmlhttp.responseText)
    if(xmlhttp.status == 200)
        getbackupdetail();
    else
        window.alert(xmlhttp.status)
 }
// get profile of backup
 function getbackupdetail(){
	var xmlhttp=new XMLHttpRequest();
    url = "http://51.15.59.130:46260/support"
    xmlhttp.open("GET",url,false);
    xmlhttp.send(null);
    var msg = JSON.parse(xmlhttp.responseText);
    document.getElementById("backup-img").src = msg.support.picture;
    picture = msg.support.picture;
    document.getElementById("backup-name").innerHTML = msg.support.first+"</br>" + msg.support.last;
 }
// get msg from client , show it on pop up window, send it asynchronous to server
 function sendmessage(){
     var message_body = document.getElementById("message").value;
     if(message_body.length > 0){
        document.getElementById("message").value= "";
        var element = '<div class="chat-message"><div class="chat-prof"><img class="user-prof-img" src="img/profile.png"></div><div class="chat-text">';
        element = element + message_body + '</div></div>';
        document.getElementById("chatroom").innerHTML = document.getElementById("chatroom").innerHTML + element;
        document.getElementById("chatroom").scrollTop += 100;
        send_msg_Asynch(message_body);
     }
 }
 // send msg asynchronously to server, call interval to check server every 3s for response
function send_msg_Asynch(msg){
    var xmlhttp=new XMLHttpRequest();
    url = "http://51.15.59.130:46260/send"
    xmlhttp.open("POST",url,true);
    var jsonMsg = {message:msg};
    xmlhttp.send(jsonMsg);
    checknewmsg();
}
// recieve msg from server
function receive_msg_Asynch(msg){
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange = process;
    url = "http://51.15.59.130:46260/fetch"
    xmlhttp.open("GET",url,true);
    xmlhttp.send(null);
}
// if response of backup received, call receive-msg func to show it to client
function process(){
    if(this.readyState == 4){
        if(this.status == 200){
            parse_msg(this.responseText);
        }
        else{window.alert("Error "+ xmlhttp.statusText); }
    }
}
// show recieved msg to client in pop up window
function receive_msg(msg){
    var element = '<div class="chat-message-backup"><div class="chat-prof-backup"><img class="user-prof-img" src='+picture+'>';
    element = element + '</div><div class="chat-text-backup">';
    element = element + msg + '</div></div>';
    document.getElementById("chatroom").innerHTML = document.getElementById("chatroom").innerHTML + element;
    document.getElementById("chatroom").scrollTop += 100 ;
}
// parse json msg that recieved from server
 function parse_msg(msg){
    var jsonData = JSON.parse(msg);
    for(i=0;i<jsonData.responses.length;i++)
        msg = jsonData.responses[i];
        receive_msg(msg.message);
 }
 // check server every 3s for new msg
 function checknewmsg(){
    setInterval(receive_msg_Asynch(),3000);
 }
