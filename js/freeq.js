'use strict';
// Initialize collapse button
$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
//$('.collapsible').collapsible();
$(document).ready(function(){
     $('.parallax').parallax();
   });

$( document ).ready(function() {
    console.log( "ready!" );

    $(".dropdown-button").dropdown();
    $(".parallax" ).fadeTo( "slow" , 0.3);


});
