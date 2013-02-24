/*
 * flist.js
 */
 
/**
 * Initializes an flist filter list on an unordered list DOM element.
 */
function flist( list ) {
  this.list = list;
  this.mtime = 5;
  
  // Wrap each list element's contents with a div to use to restore height
  $(list.find("li")).wrapInner('<div />').addClass("shown");
  var child_height = $($(list.find("li")).find("div")).children().outerHeight();
  $($(list.find("li")).find("div")).css({ "max-height" : child_height });
}

/**
 * Filter the filter list by a given filter string, with animations.
 */
flist.prototype.filter = function( filter_string ) {
  console.log( "Filter by: [" + filter_string + "]" );
  if( filter_string ) {
    // Hide unmatched elements
    var elements = this.list.find( "a:not(:contains(" + filter_string + "))" ).closest("li");
    for( var i = 0; i < elements.length; i++ ) {
      if( this.hasHiding( $(elements.get(i)) ) ) continue;
      $(elements.get(i)).removeClass().addClass("hide");
      setTimeout( this.hideElement( $(elements.get(i)) ), i * this.mtime );
    }
    
    // Show matched elements
    elements = this.list.find( "a:contains(" + filter_string + ")" ).closest("li");
    for( var i = 0; i < elements.length; i++ ) {
      if( this.hasShowing( $(elements.get(i)) ) ) continue;   
      $(elements.get(i)).removeClass().addClass("show");
      setTimeout( this.showElement( $(elements.get(i)) ), i * this.mtime );
    }
  } else {
    // Show all elements
    var elements = this.list.find("li");
    for( var i = 0; i < elements.length; i++ ) {
      if( this.hasShowing( $(elements.get(i)) ) ) continue;
      $(elements.get(i)).removeClass().addClass("show");
      setTimeout( this.showElement( $(elements.get(i)) ), i * this.mtime );
    }
  }
}

/**
 * Returns a function that slides a list element and squishes / unsquishes based on mod
 */
flist.prototype.hideElement = function( list_element ) {
  if( !list_element.hasClass("hide") )
    return function() {};
  var left_pos = list_element.width();
  var nheight = "0px";
  var nopacity = 0.0;
  list_element.removeClass("hide").addClass("hiding");
  list_element.stop();
  
  return function() {
    list_element.find("div").stop().animate({ 
      paddingLeft : left_pos,
      opacity : nopacity
    },
    250,
    function() {
      list_element.find("div").animate({
        maxHeight : nheight
      },
      100,
      function() {
        list_element.removeClass("hiding").addClass("hidden");
      });
    });
  }
}

/**
 * Returns a function that slides a list element and squishes / unsquishes based on mod
 */
flist.prototype.showElement = function( list_element ) {
  if( !list_element.hasClass("show") )
    return function() {};
  var left_pos = "0px";
  var nopacity = 1.00;
  var nheight = list_element.find("div").children().outerHeight();
  list_element.removeClass("show").addClass("showing");
  list_element.stop();
  
  return function() {
    list_element.find("div").stop().animate({
      maxHeight : nheight
    },
    100,
    function() {
      list_element.find("div").animate({ 
        paddingLeft : left_pos,
        opacity : nopacity
      },
      250,
      function() {
        list_element.removeClass("showing").addClass("shown");
      });
    });
  }
}

/**
 * Function to check if an element has one of the "showing" classes.
 */
flist.prototype.hasShowing = function( element ) {
  return element.hasClass("show") || element.hasClass("showing") || element.hasClass("shown");
}

/**
 * Function to check if an element has one of the "hiding" classes.
 */
flist.prototype.hasHiding = function( element ) {
  return element.hasClass("hide") || element.hasClass("hiding") || element.hasClass("hidden");
}
