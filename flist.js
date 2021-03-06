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
  this.textQuery = "li";
  this.list.css({"overflow" : "hidden"});
  this.timeout = null;
  
  // Set list element to showing and overflow hidden
  $(list.find("li")).wrapInner("<div />");
  $(list.find("li")).data('FList.show', true).css({"overflow" : "hidden" });
  this._css = $(list.find("li")).css("*");
  console.log( this._css );
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
  return list_element.children().outerHeight();
}

/**
 * Gets the default width of an element in the list.
 * @method getDefaultWidth
 * @param {jQuery} List element to retrieve the default width of
 * @return {Integer} Default width (in pixels) of the list element
 */
FList.prototype.getDefaultWidth = function( list_element ) {
  return list_element.children().outerWidth();
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
 * Retrieves the maximum height of all child elements.  This is calculated by
 * looping through all elements to compare heights.
 * @method getMaxElementHeight
 * @return {Integer} Max height of all elements in the list
 */
FList.prototype.getMaxElementHeight = function() {
  return Math.max.apply(Math, this.list.find('li').map(function(){ return $(this).height(); }).get());
}

/**
 * Retrieves the maximum width of all child elements.  This is calculated by
 * looping through all elements to compare widths.
 * @method getMaxElementWidth
 * @return {Integer} Max width of all elements in the list
 */
FList.prototype.getMaxElementWidth = function() {
  return Math.max.apply(Math, this.list.find('li').map(function(){ return $(this).width(); }).get());
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
 * Generates a function to hide a list element immediately by shrinking
 * its heigth to 0px, for use with the FList.hide function.
 * @method hideImmediate
 * @return {function} A function that takes a jQuery list element and 
 *         shrinks its height to 0px to hide it from view.
 */
FList.prototype.hideImmediate = function() {
  return function(element) {
    element.css({ height : "0px " });
  };
}

/**
 * Generates a function to hide a list element by sliding it to the left
 * for use with the FList.hide function.
 * @method hideLeft
 * @param [xtime=250] {Integer} Time in milliseconds it takes to slide the 
 *        element to the left
 * @param [htime=100] {Integer} Time in milliseconds it takes to shrink the 
 *        height of the element
 * @return {function} A function that takes a jQuery list element and
 *         animates it by sliding it to the left and decreasing its 
 *         height to hide it from view.  
 */
FList.prototype.hideLeft = function( xtime, htime ) {
  xtime = typeof xtime !== 'undefined' ? xtime : 250;
  htime = typeof htime !== 'undefined' ? htime : 100;

  return function(element) {
    element.animate({
      paddingLeft : -this.list.width(),
      opacity : 0.0
    },
    xtime );
    element.animate({maxHeight : "0px"}, htime );
  };
}

/**
 * Generates a function to hide a list element by sliding it to the right
 * for use with the FList.hide function.
 * @method hideRight
 * @param [xtime=250] {Integer} Time in milliseconds it takes to slide the 
 *        element to the right
 * @param [htime=100] {Integer} Time in milliseconds it takes to shrink the 
 *        height of the element
 * @return {function} A function that takes a jQuery list element and 
 *         animates it by sliding it to the right and decreasing its 
 *         height to hide it from view.
 */
FList.prototype.hideRight = function( xtime, htime ) {
  xtime = typeof xtime !== 'undefined' ? xtime : 250;
  htime = typeof htime !== 'undefined' ? htime : 100;

  return function(element) {
    element.animate({ 
      paddingLeft : this.list.width(),
      opacity : 0.0
    },
    xtime );
    element.animate({maxHeight : "0px"}, htime );
  };
}

/**
 * Generates a function to hide a list element by imitating jQuery's
 * slideUp function, for use with the FList.hide function.
 * @method hideSlide
 * @param [htime=150] {Integer} Time in milliseconds it takes to shrink
 *        the height of the element
 * @return {function} A function that takes a jQuery list element and
 *         animates it by sliding it up like jQuery's slideUp function.
 */
FList.prototype.hideSlide = function( htime ) {
  htime = typeof htime !== 'undefined' ? htime : 150;

  return function( element ) {
    element.animate({height : "0px"}, htime);
  };
}

/**
 * Generates a function to show a list element immediately by unshrinking
 * its heigth to its default value, for use with the FList.show function.
 * @method showImmediate
 * @return {function} A function that takes a jQuery list element and 
 *         unshrinks its height to its default value to show the element.
 */
FList.prototype.showImmediate = function() {
  var flist_this = this;
  return function(element) {
    element.css({height : flist_this.getDefaultHeight(element) });
  };
}

/**
 * Generates a function to show a list element by sliding it from the left
 * for use with the FList.hide function.
 * @method showLeft
 * @param [xtime=250] {Integer} Time in milliseconds it takes to slide the
 *        element from the right
 * @param [htime=100] {Integer} Time in milliseconds it takes to unshrink
 *        the height of the element
 * @return {function} A function that takes a jQuery list element and
 *         animates it by increasing its height and sliding it from the
 *         left.
 */
FList.prototype.showLeft = function( xtime, htime ) {
  xtime = typeof xtime !== 'undefined' ? xtime : 250;
  htime = typeof htime !== 'undefined' ? htime : 100;

  return function(element) {
    element.css({
      paddingLeft : -this.list.width(),
      opacity : 0.0
    });
    element.animate({ maxHeight : this.getDefaultHeight(element) }, htime );
    element.animate({
      paddingLeft : "0px",
      opacity : 1.0
    }, 
    xtime );
  };
}

/**
 * Generates a function to show a list element by sliding it from the right
 * for use with the FList.show function.
 * @method showRight
 * @param [xtime=250] {Integer} Time in milliseconds it takes to slide the
 *        element from the left
 * @param [htime=100] {Integer} Time in milliseconds it takes to unshrink 
 *        the element
 * @return {function} A function that takes a jQuery list element and 
 *         animates it by increasing its height and sliding it from the 
 *         right.
 */
FList.prototype.showRight = function( xtime, htime ) {
  xtime = typeof xtime !== 'undefined' ? xtime : 250;
  htime = typeof htime !== 'undefined' ? htime : 100;

  return function(element) {
    element.css({
      paddingLeft : this.list.width(),
      opacity : 0.0
    });
    element.animate({ maxHeight : this.getDefaultHeight(element) }, htime );
    element.animate({ 
      paddingLeft : "0px",
      opacity : 1.0
    },
    xtime );
  };
}

/**
 * Generates a function to show a list element by imitating jQuery's
 * slideDown function, for use with the FList.show function.
 * @method showSlide
 * @param [htime=150] {Integer} Time in milliseconds it takes to unshrink
 *        the height of the element
 * @return {function} A function that takes a jQuery list element and
 *         animates it by imitating jQuery's slideDown function.
 */
FList.prototype.showSlide = function( htime ) {
  var flist_this = this;
  htime = typeof htime !== 'undefined' ? htime : 150;

  return function(element) {
    element.css({
      paddingLeft : "0px",
      height : "0px",
      opacity : 1.0
    });
    element.animate({ height : flist_this.getDefaultHeight(element) }, htime );
  };
}


/**
 * Hides a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one 
 * parameter, which is the jQuery list element to hide.
 * @method hide
 * @param element {jQuery} List element to show
 */
FList.prototype.hide = FList.prototype.hideImmediate();

/**
 * Shows a given jQuery element of the filter list.  Change this function to 
 * change animation behavior.  The replacing function must accept one 
 * parameter, which is the jQuery list element to show.
 * @method show
 * @param element {jQuery} List element to show
 */
FList.prototype.show = FList.prototype.showImmediate();

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
