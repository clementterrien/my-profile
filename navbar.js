const $ = require('jquery');
var prevScrollpos = window.pageYOffset;
var viewportHeight = window.innerHeight;
var viewportWidth = window.innerWidth;
var largest = getMostVisibleElement('section', 'main-section');
var navbar = document.getElementById('navbar');
var topbar = document.getElementById('topbar');
var sticky_nav =  navbar.offsetTop+topbar.offsetTop;
const firstname = document.getElementById('firstname-text').innerText;
const lastname = document.getElementById('lastname-text').innerText;
var firstname_div = document.getElementById('firstname-text');
var lastname_div = document.getElementById('lastname-text');
var title_div = document.getElementById('navbar-title-div');
const title_transition_duration = 30;
const scroll_transparency_duration = 30;
const menu_navigation_swipe_duration = 30;
var prevVisibleSection = getMostVisibleElement('section', 'main-section');
var timer = null;

window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  
  if(window.matchMedia("(min-width: 646px)").matches) {
    onScrollfullScreenNavbarBehaviour(currentScrollPos);
  } else {
    colorizeSectionButton()
  }

  prevScrollpos = currentScrollPos;
  mostVisibleSection = getMostVisibleElement('section', 'main-section');
}

/* Hamburger behaviour */
var btn = $('.btn');
var menu = $('#navbar-pagination-div');
var my_navbar = $('#navbar');
btn.on('click', function() {
  $(this).toggleClass('active');
  $(this).toggleClass('not-active');
  menu.toggleClass('active');
  menu.toggleClass('not-active');
  my_navbar.toggleClass('developed');
  my_navbar.toggleClass('not-developed');
});

function reduceFirstname(firstname_div, title_transition_duration){
  var text = firstname;
  var limit = text.length;
  for (let i = 0; i < limit-1; i++) {
    setTimeout(() => {
      text = text.substring(0, text.length-1);
      firstname_div.innerText = text+'/';
    }, title_transition_duration * i);
  }
}

function developFirstname(firstname_div, title_transition_duration){
  var text = firstname.substring(0, 1);

  for (let i = 1; i < firstname.length; i++) {
    setTimeout(() => {
      text = text+firstname[i];
      firstname_div.innerText = text;
    }, title_transition_duration * i);
  }
}

function developLastname(lastname_div, title_transition_duration){
  var text = lastname.substring(0, 1);

  for (let i = 1; i < lastname.length; i++) {
    setTimeout(() => {
      text = text+lastname[i];
      lastname_div.innerText = text;
    }, title_transition_duration * i);
  }

}

function reduceLastname(lastname_div, title_transition_duration){
  var text = lastname;
  for (let i = 0; i < text.length-1; i++) {
    setTimeout(() => {
      text = text.substring(0, text.length-1);
      lastname_div.innerText = text;
    }, title_transition_duration * i);
  }
}

function setDivToDevelopedState(){
  title_div.classList.add('developed');
  title_div.classList.remove('reduced');
}

function setDivToReducedState(){
  title_div.classList.add('reduced');
  title_div.classList.remove('developed');
}

// Returns the most visible element of a certain class in the viewport
function getMostVisibleElement(ElementTagName, ElementClassName){
  
  var selector = ElementTagName+"."+ElementClassName, 
      elements = document.querySelectorAll(selector),
      largest_element,    
      viewportHeight = window.innerHeight,
      max = 0;

    elements.forEach(element => {
      var visiblePx = getVisibleHeightPx(element, viewportHeight);

      if (visiblePx > max) {
          max = visiblePx;
          largest_element = element;
        }
    });

    return largest_element;
}

function getVisibleHeightPx($element, viewportHeight) {
    var rect = $element.getBoundingClientRect(),
        height = rect.bottom - rect.top,
        visible = {
            top: rect.top >= 0 && rect.top < viewportHeight,
            bottom: rect.bottom > 0 && rect.bottom < viewportHeight
        },
        visiblePx = 0;

    if (visible.top && visible.bottom) {
        // Whole element is visible
        visiblePx = height;
    } else if (visible.top) {
        visiblePx = viewportHeight - rect.top;
    } else if (visible.bottom) {
        visiblePx = rect.bottom;
    } else if (height > viewportHeight && rect.top < 0) {
        var absTop = Math.abs(rect.top);

        if (absTop < height) {
            // Part of the element is visible
            visiblePx = height - absTop;
        }
    }
    return visiblePx;
}

function isThisElementVisible(element){
  var visiblePx = getVisibleHeightPx(element, viewportHeight);
  if (visiblePx > (viewportHeight-navbar.offsetHeight)/2){
    return true;
  } else {
    return false;
  }
}

function onScrollfullScreenNavbarBehaviour(currentScrollPos){

  var reduced_title_state = title_div.classList.contains('reduced');
  var developed_title_state = title_div.classList.contains('developed');
  
  //******* Navigation bar colorisation *******/
  colorizeSectionButton();

  //******* Title reduction/development behaviour *****//
  if (prevScrollpos > currentScrollPos) {
    if (developed_title_state == false){ // Develop title
      developFirstname(firstname_div, title_transition_duration);
      developLastname(lastname_div, title_transition_duration);
      setDivToDevelopedState();
    }
  } else {
    if (reduced_title_state == false && currentScrollPos > sticky_nav){ // Reduce title
      reduceFirstname(firstname_div, title_transition_duration);
      reduceLastname(lastname_div, title_transition_duration);
      setDivToReducedState();
    }
  }
}

function colorizeSectionButton(){
    var element = getMostVisibleElement('section', 'main-section');
    var activeCell = document.getElementsByClassName('nav-link active')[0];
    if(activeCell == null ){
      active_cell_id = 0;
    } else {
      active_cell_id = activeCell.parentElement.id;
    }

    //1. Is there an element to activate ??
    if (isThisElementVisible(element)){
      cellToActivate = document.querySelector("a[href='#"+element.id+"']");
      
      //Is it activated ?? 
      if (cellToActivate.parentElement.classList.contains('active') == false){
        
        activeCell = document.getElementsByClassName('nav-link active')[0];
        if(activeCell){ // remove previous active Cell   
          activeCell.classList.remove('active');
          activeCell.parentElement.classList.remove('active');
        }
        cellToActivate.parentElement.classList.add('active');
        cellToActivate.classList.add('active');
        changeMenu();
      } else {
        return;
      }

    } else {// No element to display // Delete active Cell
      if (activeCell != null){
        activeCell.classList.remove('active');
        activeCell.parentElement.classList.remove('active');
        changeMenu();
    } else {
      return;
    }
}
}

function changeMenu(){
    var activeCell = document.getElementsByClassName('nav-link active')[0];

    if(activeCell == null || activeCell == undefined){
      document.getElementsByClassName('nav-button-div').forEach(function(element){
        removeAllPositions(element);
        element.classList.add('position-0');
      });
      return;
    } else {
      position = activeCell.parentElement.classList[1].slice(-1);
      document.getElementsByClassName('nav-button-div').forEach(function(element){
        removeAllPositions(element);
        element.classList.add('position-'+position);
    });
    }
}

function removeAllPositions(element){
  element.classList.remove(
          'position-0',
          'position-1',  
          'position-2', 
          'position-3', 
          'position-4');
}