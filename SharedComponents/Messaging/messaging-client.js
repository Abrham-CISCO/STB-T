// This js is used to chat online and load chat box when the page is refreshed.
var socket = io('/chat');
var Converation = "";
var EventTel="";

// Determine the user
// Secuirity Issue : you must not send password to me!

var myTel, myName,myPic;
var xhr = new XMLHttpRequest
xhr.onreadystatechange = function()
{
    if(xhr.readyState == 4)
    {
        var JSONResponse = (JSON.parse(xhr.responseText))
        myTel = JSONResponse.user.telephone
        myName = JSONResponse.user.name
        myPic = JSONResponse.user.pro_img
        socket.emit('client',myTel);
        LoadContacts(myTel)
    }
}
link = "http://localhost:3000/Accounts/MyInfo/";
xhr.open('GET',link)
xhr.send();

//For Message notification
function LoadMessagingNotification()
{
    var xhr2 = new XMLHttpRequest
    xhr2.onreadystatechange = function()
    {
        if(xhr2.readyState == 4)
        {
            var JSONResponse = (JSON.parse(xhr2.responseText))
            RenderMessagingNotification(JSONResponse.RNotification,5);
        }
    }
    link = "http://localhost:3000/Messaging/Notification/"+myTel;
    xhr2.open('GET',link)
    xhr2.send();
}
function RenderMessagingNotification(MessageNotificationObject,limit)
{
    console.log(MessageNotificationObject)
    var Message = "";
    var j = 0;
    for(var i = 0; i<MessageNotificationObject.length; i++)
    {

            j=j+1;
            Message += "<a href='#' onclick = LoadChatBox('"+MessageNotificationObject[i].telephone+"','"+MessageNotificationObject[i].pro_img+"')  class='dropdown-item'><!-- Message Start--><div class='media'>"
            Message += "<img src='"+MessageNotificationObject[i].pro_img+"' alt='User Avatar' class='img-size-50 mr-3 img-circle'>"
            Message += "<div class='media-body'><h3 class='dropdown-item-title'>"+MessageNotificationObject[i].name+"<span class='float-right text-sm text-danger'>"
            Message += "<i class='fas fa-star'></i></span></h3>"    
            Message += "<p class='text-sm'>"+MessageNotificationObject[i].message+"</p>"      
            Message += "<p class='text-sm text-muted'><i class='far fa-clock mr-1'>"
            Message += "</i> 4 Hours Ago</p></div></div><!-- Message End--></a>"
            Message += "<div class='dropdown-divider'></div>"

    }
    Message += "<a href='#' class='dropdown-item dropdown-footer'>See All Messages</a>";
    document.getElementById("messageNotification").innerHTML = Message;
}
// When Chat message arrives

socket.on('chat',function(message,reciever_address,sender_address){
    if(document.getElementById('hidden_div').innerHtml == sender_address)
    {
        messageAppender(message)
    }
    else
    {
        LoadChatBox(sender_address)
    }
    console.log(message,"from ",sender_address, " to ",reciever_address);
});

function LoadChatBox(Tel,pro_img)
{
    console.log(Tel)
    EventTel = "0923276844"
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
  Converation = ""
  if(xhr.readyState === 4){
    if(xhr.status === 200 ){
        var messageHistory = xhr.responseText;
        MessageRenderer(JSON.parse(messageHistory).response.History,Tel,pro_img)
        //Load COntacts first
    } else if (xhr.status === 404) {
       //file not found
    } else if (xhr.status === 500) {
       //server had a problem
    }
  }
  }
  link = "http://localhost:3000/Messaging/historyOf/"+Tel;
  xhr.open('GET',link);
  xhr.send();

}

// document.getElementById("send").addEventListener('click', (event) => {SendMyMessage("0923276844")});


function MessageRenderer(MessageObject,Tel,pro_img)
{
    Converation = "";
    document.getElementById('hidden_div').innerHtml = Tel;

    for(var i = 0; i<MessageObject.length; i++)
    {
        if(MessageObject[i].fromID == Tel  & MessageObject[i].toID == myTel )
        {
            // TO ME
            document.getElementById("chatwith").innerText = MessageObject[i].fromName;
            Converation += "<div class='direct-chat-msg right'><div class='direct-chat-infos clearfix'>";
            Converation += "<span class='direct-chat-name float-right'>"+MessageObject[i].fromName+"</span>";
            Converation += "<span class='direct-chat-timestamp float-left'>23 Jan 2:05 pm</span></div>";
            Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='"+pro_img+"' alt='Message User Image'>";
            Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+MessageObject[i].body+"</div><!-- /.direct-chat-text --></div>";
            document.getElementsByClassName("direct-chat-messages")[0].innerHTML = Converation;
            //keep the scroll bottom 
            document.getElementsByClassName("direct-chat-messages")[0].scrollTop=9999999;
        }
        else if(MessageObject[i].fromID == myTel   & MessageObject[i].toID == Tel  )
        {
            // FROM ME
            Converation += "<div class='direct-chat-msg'><div class='direct-chat-infos clearfix'>";
            Converation += "<span class='direct-chat-name float-left'>"+MessageObject[i].fromName+"</span>";
            Converation += "<span class='direct-chat-timestamp float-right'>23 Jan 2:00 pm</span></div>";
            Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='"+myPic+"' alt='Message User Image'>";
            Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+MessageObject[i].body+"</div>";
            Converation += "<!-- /.direct-chat-text --></div>";
            document.getElementsByClassName("direct-chat-messages")[0].innerHTML = Converation;
            //keep the scroll bottom 
            document.getElementsByClassName("direct-chat-messages")[0].scrollTop=9999999;
        }
    }       
    
}


function LoadContacts(tel)
{
    var xhr = new XMLHttpRequest
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState == 4)
        {
            var JSONresponse = JSON.parse(xhr.responseText)
            console.log(JSONresponse.contactList)
            document.getElementsByClassName("contacts-list")[0].innerHTML= (ContactRenderer(JSONresponse.contactList))
        }
    }
    link = "http://localhost:3000/Messaging/contacts/"+tel;
    xhr.open('GET',link)
    xhr.send()
}


function ContactRenderer(ContactObject)
{
 var output = "";
 console.log(ContactObject)
 for(var i = 0; i < ContactObject.length; i++)
 {
    output += "<li>" 
    output += "<button type='button' data-toggle='tooltip' title='Contacts' data-widget='chat-pane-toggle' class='btn btn-tool'>"
    output += "<a href='#' onclick=LoadChatBox('"+ContactObject[i].telephone+"','"+ ContactObject[i].pro_img +"')>"
    output += "<img class='contacts-list-img' src='"+ContactObject[i].pro_img+"'>"       
    output += "<div class='contacts-list-info' id="+ContactObject[i].telephone+">"
    output +="<span class='contacts-list-name'>"+ContactObject[i].name+"<small class='contacts-list-date float-right'>2/28/2015</small></span>"
    output +="<span class='contacts-list-msg'>How have you been? I was...</span></div>"
    output += "</a>"
    output += "</button>"
    output += "</li>"
 }

 return output;
 
}

function SendMyMessage(teli,callback)
{
    var Converation=""
    var msg = document.getElementById("message").value
    socket.emit('chat',msg,teli,myTel,"Personal");
    // FROM ME
           Converation += "<div class='direct-chat-msg'><div class='direct-chat-infos clearfix'>";
           Converation += "<span class='direct-chat-name float-left'>"+myName+"</span>";
           Converation += "<span class='direct-chat-timestamp float-right'>23 Jan 2:00 pm</span></div>";
           Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='../ADMINLITE/dist/img/user1-128x128.jpg' alt='Message User Image'>";
           Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+msg+"</div>";
           Converation += "<!-- /.direct-chat-text --></div>";
           callback(Converation)

}

function messageAppender(msg)
{
    var Converation=""
    Converation += "<div class='direct-chat-msg right'><div class='direct-chat-infos clearfix'>";
    Converation += "<span class='direct-chat-name float-right'>"+myName+"</span>";
    Converation += "<span class='direct-chat-timestamp float-left'>23 Jan 2:05 pm</span></div>";
    Converation += "<!-- /.direct-chat-infos --><img class='direct-chat-img' src='../ADMINLITE/dist/img/user3-128x128.jpg' alt='Message User Image'>";
    Converation += "<!-- /.direct-chat-img --><div class='direct-chat-text'>"+msg+"</div><!-- /.direct-chat-text --></div>";
    document.getElementsByClassName('direct-chat-messages')[0].innerHTML += Converation    
    //keep the scroll bottom 
    document.getElementsByClassName("direct-chat-messages")[0].scrollTop=9999999;

}