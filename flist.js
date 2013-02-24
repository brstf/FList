/*
 * flist.js
 */
 
/**
 * @constructor
 * Initializes an FList filter list on an unordered list DOM element.
 * @requires jQuery
 * @param list (jQuery) A jQuery DOM <ul> or <ol> to create an FList around
 */
function FList( list ) {
  this.list = list;
  this.mtime = 5;
  this.list.css({"overflow" : "hidden"});
  
  // Wrap each list element's contents with a div to use to restore height
  $(list.find("li")).wrapInner('<div />').addClass("showing");
  var child_height = $($(list.find("li")).find("div")).children().outerHeight();
  $($(list.find("li")).find("div")).css({ "max-height" : child_height });
}

/* Add a case insensitive contains method to jQuery. */
jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
};

/**
 * @method filter
 * Filter the filter list by a given filter string, with animations.
 * @param filter_string String to filter the list by
 */
FList.prototype.filter = function( filter_string ) {
  // Hide unmatched elements
  var elements = this.list.find( "a:not(:Contains('" + filter_string + "'))" ).closest("li");
  for( var i = 0; i < elements.length; i++ ) {
    if( this.hasHiding( $(elements.get(i)) ) ) continue;
    $(elements.get(i)).removeClass().addClass("hide");
    setTimeout( this.hideElement( $(elements.get(i)) ), i * this.mtime );
  }
  
  // Show matched elements
  elements = this.list.find( "a:Contains('" + filter_string + "')" ).closest("li");
  for( var i = 0; i < elements.length; i++ ) {
    if( this.hasShowing( $(elements.get(i)) ) ) continue;   
    $(elements.get(i)).removeClass().addClass("show");
    setTimeout( this.showElement( $(elements.get(i)) ), i * this.mtime );
  }
}

/**
 * @method getVisibleElements
 * Retrieves a jQuery list of all visible elements depending on the filter.
 * @return (jQuery) List of visible elements in the list
 */
FList.prototype.getVisibleElements = function() {
  return this.list.find(".show, .showing");
}

/**
 * @method getInvisibleElements
 * Retrieves a jQuery list of all invisible/hidden elements depending on the filter.
 * @return (jQuery) List of invisible/hidden elements in the list
 */
FList.prototype.getInisibleElements = function() {
  return this.list.find(".hide, .hidden");
}

/**
 * @method hasShowing
 * Function to check if an element has one of the "showing" classes.
 * @param element (jQuery) List element to check the classes of
 * @return (Boolean) True if element has the class "show" or "showing", false otherwise
 */
FList.prototype.hasShowing = function( element ) {
  return element.hasClass("show") || element.hasClass("showing");
}

/**
 * @method hasHiding
 * Function to check if an element has one of the "hiding" classes.
 * @param element (jQuery) List element to check the classes of
 * @return (Boolean) True if element has the class "hide" or "hiding", false otherwise
 */
FList.prototype.hasHiding = function( element ) {
  return element.hasClass("hide") || element.hasClass("hiding");
}

/**
 * @method hide
 * Hides a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one parameter,
 * which is the jQuery list element to hide.
 * @param element (jQuery) List element to show
 */
FList.prototype.hide = function( element ) {
  var left_pos = element.closest("li").parent().parent().width();
  element.find("div").stop().animate({ 
    paddingLeft : left_pos,
    opacity : 0.0
  },
  250,
  function() {
    element.find("div").animate({maxHeight : "0px"}, 100 );
  });
}

/**
 * @method hideElement
 * Create a function to hide an element.
 * @param list_element jQuery list element to hide
 * @return (function) A function that hides the list element when called
 */
FList.prototype.hideElement = function( list_element ) {
  if( !list_element.hasClass("hide") )
    return function() {};
  list_element.removeClass("hide").addClass("hiding");
  list_element.stop();
  var flist_this = this;
  
  return function() {
    // If this element has been "hidden" before this callback was reached, stop
    flist_this.hide( list_element );
  }
}

/**
 * @method show
 * Shows a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one parameter,
 * which is the jQuery list element to show.
 * @param element List element to show
 */
FList.prototype.show = function( element ) {
  var nheight = element.find("div").children().outerHeight();
  element.find("div").stop().animate({ maxHeight : nheight }, 
  100,
  function() {
   element.find("div").animate({ 
      paddingLeft : "0px",
      opacity : 1.0
    },
    250 );
  });
}

/**
 * @method showElement
 * Create a function to show an element.
 * @param list_element jQuery list element to show
 * @return (function) A function that shows the list element when called
 */
FList.prototype.showElement = function( list_element ) {
  if( !list_element.hasClass("show") )
    return function() {};
  list_element.removeClass("show").addClass("showing");
  list_element.stop();
  var flist_this = this;
  
  return function() {
    // If this element has been "shown" before this callback was reached, stop
    flist_this.show( list_element );
  }
}
