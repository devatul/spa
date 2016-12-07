(function(){
  "use strict";

  var purl = window.location.href.substring(window.location.href.lastIndexOf("/"));
  var navItem = document.querySelectorAll('.menu-button');
  var dashboard = document.querySelector('.menu-button:nth-of-type(1)');
  var infrastructure = document.querySelector('.menu-button:nth-of-type(2)');
  var alerts = document.querySelector('.menu-button:nth-of-type(3)');
  var performance = document.querySelector('.menu-button:nth-of-type(4)');
  var ninja = document.querySelector('.menu-button:nth-of-type(5)');

  /*jQuery stuff*/

  $(document).ready(function() {
    $(infrastructure).click(function() {$(navItem).removeClass('nb-active');$(this).addClass('nb-active');});
    
    $(alerts).click(function() {$(navItem).removeClass('nb-active');$(this).addClass('nb-active');});
    
    $(performance).click(function() {$(navItem).removeClass('nb-active');$(this).addClass('nb-active');});
    
    $(ninja).click(function() {$(navItem).removeClass('nb-active');$(this).addClass('nb-active');});
    
    $(dashboard).click(function() {$(navItem).removeClass('nb-active');$(this).addClass('nb-active');});          
  });

})();
