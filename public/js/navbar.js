$('.ui.left.sidebar').sidebar({
    transition: 'overlay'
});

// Sidebar opens when clicked
$('#toggle').click(()=>{
    $('.ui.sidebar').sidebar('toggle');
});

//Inside menu dropdown
$('.ui .dropdown').dropdown();


// Get months
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];



