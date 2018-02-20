$(document).ready(function(){
    $('.ui.left.sidebar').sidebar({
        transition: 'overlay'
    });
    // left is opened by button
    $('.ui.left.sidebar')
        .sidebar('attach events', '.open.button');
    $('.ui .dropdown').dropdown();
});

