/**
 * FList is a filterable list created over an HTML unordered list that allows
 * extremely simple filtering with animation support.
 *
 * @class FList
 * @constructor
 * Initializes an FList filter list on an unordered list DOM element.
 * @requires jQuery
 * @param list {jQuery} A jQuery DOM `<ul>` or `<ol>` to create an FList around
 */
function FList( list ) {
  this.list = list;
  this.mtime = 1;
  this.textQuery = "div";
  this.list.css({"overflow" : "hidden"});
  this.timeout = null;
  
  // Wrap each list element's contents with a div to use to restore height
  $(list.find("li")).wrapInner('<div />').data('FList.show', true);
  var child_height = $($(list.find("li")).find("div")).children().outerHeight();
  $($(list.find("li")).find("div")).css({ "max-height" : child_height });
  $(list.find("li")).css({"overflow" : "hidden" });
}

/* Add a case insensitive contains method to jQuery. */
jQuery.expr[':'].Contains = function(a,i,m){
    return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase())>=0;
};

/**
 * Filter the filter list by a given filter string, with animations.
 * @method filter
 * @param filter_string {String} Query to filter the list by
 */
FList.prototype.filter = function( query ) {
  // Show matched elements
  clearTimeout( this.timeout );
  var updateFunction = function(){};
  var elements = this.list.find(this.textQuery).filter(this.selector(true, query)).closest("li");
  for( var i = elements.length - 1; i >= 0; i-- ) {
    updateFunction = this.update( updateFunction, $(elements.get(i)), true );
  }
  
  // Hide unmatched elements
  elements = this.list.find(this.textQuery).filter(this.selector(false, query)).closest("li");
  for( var i = elements.length - 1; i>= 0; i-- ) {
    updateFunction = this.update( updateFunction, $(elements.get(i)), false );
  }
  updateFunction();
}

/**
 * Constructs a function to test a DOM element by the filter query.
 * @method selector
 * @param positive {Boolean} True if a positive match should indicate a true 
 *        return value, false if a positive match should indicate a false
 *        return value.
 * @param query {String} Query to test the DOM Element on
 * @return {function} Function to test a DOM Element by the query, modifying 
 *         the return value by whether or not this should be a "positive" 
 *         function
 */
FList.prototype.selector = function( positive, query ) {
  var flist_this = this;
  return function( index ) {
    var pos_select = flist_this.positiveSelector(this, index, query);
    if( positive ) return pos_select;
    else return !pos_select;
  }
}

/**
 * Determines if a given element is positively selected by the filter query.
 * @method positiveSelector
 * @param el {HTMLElement} The element to test for positivity
 * @param index {Integer} Index of the element in the filter list
 * @param query {String} Query to test the given element on
 * @return {Boolean} True if the element matches the query, false otherwise
 */
FList.prototype.positiveSelector = function( el, index, query ) {
  return $(el).is( ":Contains('" + query + "')" );
}

/**
 * Gets the default height of an element in the list.
 * @method getDefaultHeight
 * @param {jQuery} List element to retrieve the default height of
 * @return {Integer} Default height (in pixels) of the list element
 */
FList.prototype.getDefaultHeight = function( list_element ) {
  return list_element.find("div").children().outerHeight();
}

/**
 * Retrieves a jQuery list of all invisible/hidden elements depending on the filter.
 * @method getInvisibleElements
 * @return {jQuery} List of invisible/hidden elements in the list
 */
FList.prototype.getInvisibleElements = function() {
  return this.list.find(".hide, .hidden");
}

/**
 * Retrieves a jQuery list of all visible elements depending on the filter.
 * @method getVisibleElements
 * @return {jQuery} List of visible elements in the list
 */
FList.prototype.getVisibleElements = function() {
  return this.list.find(".show, .showing");
}

/**
 * Function to set the delay (in milliseconds) between animations as elements 
 * are filtered out of a list.  For example, if this is set to 5 ms, the first 
 * filtered out element will immediately start its animation, the second one 
 * will start the animation in 5 ms, the third in 10 ms, etc.
 * @method setAnimDelay
 * @param dt {Integer} Animation delay (in ms)
 */
FList.prototype.setAnimDelay = function( dt ) {
  this.mtime = dt;
}

/**
 * Hides a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one 
 * parameter, which is the jQuery list element to hide.
 * @method hide
 * @param element {jQuery} List element to show
 */
FList.prototype.hide = function( element ) {
  var left_pos = element.closest("li").parent().parent().width();
  element.animate({ 
    paddingLeft : left_pos,
    opacity : 0.0
  },
  250 );
  element.animate({maxHeight : "0px"}, 100 );
}

/**
 * Shows a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one 
 * parameter, which is the jQuery list element to show.
 * @method show
 * @param element {jQuery} List element to show
 */
FList.prototype.show = function( element ) {
  element.animate({ maxHeight : this.getDefaultHeight(element) }, 100 );
  element.animate({ 
    paddingLeft : "0px",
    opacity : 1.0
  },
  250 );
}

/**
 * Create a function to update an element; hide an element if it should be 
 * hidden, show an element if it should be shown.
 * @method updateElement
 * @param list_element {jQuery} List element to update
 * @return {function} A function that hides/shows the list element when called
 */
FList.prototype.updateElement = function( list_element ) {
  // Hide or show element based the 'Flist.show' data
  if(!list_element.data('FList.show') ) {
    list_element.queue([]);
    this.hide( list_element );
  } else {
    list_element.queue([]);
    this.show( list_element );
  }
}

/**
 * Compounds an update function that shows/hides all elements.  The resulting
 * update function is a function that calls an update function for each list
 * element in turn to hide/show the element as specified.
 * @method update
 * @param updateFunction {function} The composite update function that updates 
 *        all of the list elements so far
 * @param list_element {jQuery} An element of the list to potentially update.
 *        If the element is showing, but should be hidden, compound its update 
 *        into the function and vice versa.
 * @param show {Boolean} Indicates whether this list element should be shown 
 *        or not
 * @return {function} An updated composite function that updates all elements 
 *         in the list appropriately when called, with a proper timeout 
 *         between each animation/update
 */
FList.prototype.update = function( updateFunction, list_element, show ) {
  var flist_this = this;
  
  // Only add to the update function if this element is changing state
  if( list_element.data('FList.show') != show ) {
    return function() {
      list_element.data( 'FList.show', show );
      flist_this.updateElement( list_element );
      if( flist_this.mtime === 0 ) {
        updateFunction();
      } else {
        flist_this.timeout = setTimeout( updateFunction, flist_this.mtime );
      }
    }
  } else {
    return updateFunction;
  }
}
