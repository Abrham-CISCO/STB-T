function LoadNotification()
{
    var not_xhr = new XMLHttpRequest
    not_xhr.onreadystatechange = function()
    {
        if(not_xhr.readyState == 4)
        {
            NotificationRenderer(JSON.parse(not_xhr.responseText).Notifications)
        }
    }
    var link_not = "http://localhost:3000/Notifications/load/0923276844";
    console.log(link_not)
    not_xhr.open('GET',link_not)
    not_xhr.send()
}
function NotificationRenderer(NotificationObject)
{
    var Result = ""
    for(var i = 0; i<NotificationObject.length; i++)
    {
        Result += "<a href='#' class='dropdown-item'>"
        Result += "<div class='media'>"
        Result += "<img src='"+NotificationObject[i].nImage+"' alt='User Avatar' class='img-size-50 mr-3 img-circle'>"
        Result += "<div class='media-body'>"
        Result += "<h3 class='dropdown-item-title'>ትምህርት ክፍል<span class='float-right text-sm text-danger'></span>"
        Result += "</h3><p class='text-sm'>"+NotificationObject[i].body+"</p>"
        Result += "<p class='text-sm text-muted'><i class='far fa-clock mr-1'></i> 4 Hours Ago</p></div></div><div class='dropdown-divider'></div>"
        Result += "</a>"
    }
    Result += "<a href='#' class='dropdown-item dropdown-footer'>See All Notifications</a>"
    console.log(Result)
    document.getElementById("Notification").innerHTML = Result;
}