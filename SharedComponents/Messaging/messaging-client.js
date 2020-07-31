// This js is used to chat online and load chat box when the page is refreshed.
var socket = io('/chat');
console.log(socket.connected);
function Send(message,rec_address)
{
var message = document.getElementById("message").value;
    socket.emit('chat',message,rec_address);
}

// When Chat message arrives
socket.on('chat',function(message,address){
    console.log(message);
});

function LoadChatBox(Tel)
{
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
  
  if(xhr.readyState === 4){
    if(xhr.status === 200 ){
        var messageHistory = xhr.responseText;
        //Load COntacts first
        
    } else if (xhr.status === 404) {
       //file not found
    } else if (xhr.status === 500) {
       //server had a problem
    }
  }
  }
  link = "http://localhost:3000/Messaging/historyOf/"+Tel;
  console.log(link)
  xhr.open('GET',link);
  xhr.send();
}

function MessageRenderer(MessageObject)
{

    JSONResponse = JSON.parse(MessageObject);
    var Converation = "";
    for(var i = 0; i<JSONResponse.response.Messages.length; i++)
    {
        if(JSONResponse.response.Messages[i].fromID == ReId  & JSONResponse.response.Messages[i].toID == myTel )
        {
            // TO ME
            Converation += "<div class='direct-chat-msg right'><div class='direct-chat-infos clearfix'>";
            Converation += "<span class='direct-chat-name float-right'>"+ReName+"</span>";
            Converation += "<span class='direct-chat-timestamp float-left'>23 Jan 2:05 pm</span></div>";
            Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='static/dist/img/user3-128x128.jpg' alt='Message User Image'>";
            Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+JSONResponse.response.Messages[i].body+"</div><!-- /.direct-chat-text --></div>";
            document.getElementById("direct-chat-messages").innerHTML = Converation;
            //keep the scroll bottom 
            document.getElementsByClassName("direct-chat-messages")[0].scrollTop=9999999;
            console.log("Evaluated");                   
        }
        else if(JSONResponse.response.Messages[i].fromID == myTel   & JSONResponse.response.Messages[i].toID == ReId  )
        {
            // FROM ME
            Converation += "<div class='direct-chat-msg'><div class='direct-chat-infos clearfix'>";
            Converation += "<span class='direct-chat-name float-left'>"+myName+"</span>";
            Converation += "<span class='direct-chat-timestamp float-right'>23 Jan 2:00 pm</span></div>";
            Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='static/dist/img/user1-128x128.jpg' alt='Message User Image'>";
            Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+JSONResponse.response.Messages[i].body+"</div>";
            Converation += "<!-- /.direct-chat-text --></div>";
            document.getElementById("direct-chat-messages").innerHTML = Converation;
            //keep the scroll bottom 
            document.getElementsByClassName("direct-chat-messages")[0].scrollTop=9999999;
            console.log("Evaluated");
        }
    }       
    
}
LoadChatBox("0923276844")