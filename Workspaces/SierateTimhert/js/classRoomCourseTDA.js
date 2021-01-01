// const { data } = require("pdfkit/js/reference");

// const { json } = require("body-parser");

// document.getElementById('3').className = "nav-link active"
// document.getElementById('#{user.GubayeID}').className = "nav-link active"
  $(function () {
  $("#example1").DataTable();
  $("#example3").DataTable();
  $('#example2').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false,
  });
});

var courseData = (document.getElementById('courseData').value);
var classRoomData = (document.getElementById('classRoomData').value);

console.log(courseData);
console.log(classRoomData);

