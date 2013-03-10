FList
=====

Simple and flexible animating filterable list using [jQuery](http://jquery.com).  The animations and filter can be specified to obtain desired functionality.  Documentation generated using [YUIDoc](http://yui.github.com/yuidoc/).

Initializing FList
------------------

To initialize FList, simply pass a jQuery object pointing to a `<ul>` or `<ol>` object into the constructor:

	var filter_list = new FList( $("#flist") );

And that's it!  Of course, to filter the list itself, some listeners should be setup.  For example, to filter a list everytime an `<input>` with id `qinput` is changed, we can do the following:

    $("#qinput").change( function () {
      filter_list.filter( $(this).val() );
    }).keyup( function ( ev ) {
      $(this).change();
    });

This simply calls the `filter` function of the FList object with the contents of the `<input>` every time it's changed or a keyup event is fired on the `<input>` element.

Specifying Animation Functions
------------------------------

When the list is filtered by a specified query, each list element that fails the query test will be hidden by the `hide` function and each list element that passes the query test will be shown by the `show` function.  FList will automatically stop and start these animations appropriately so that filtering appears smooth and continuous.

To specify new animation functions, we can override `Flist.show` and `Flist.hide` which are the functions to show and hide a list element respectively.  Each function takes a single argument, a `jQuery` that is a `<li>` element of the list.  So, we can initialize an FList object and override these two functions so that the elements appear to use the `jQuery` `slideUp` and `slideDown` animation functions:

    var filter_list = new FList( $("#flist") );

    // Modify the show and hide animations to mimic jQuery slideUp and slideDown
    filter_list.show = function(element) {
      element.animate({ height : filter_list.getDefaultHeight(element) }, 150 );
    }
    filter_list.hide = function(element) {
      element.animate({ height : "0px" }, 150 );
    }

    // Set the delay to 0, so all animations happen "instantly"
    filter_list.setAnimDelay( 0 );

The `hide` function simply animates the height of the element to 0 pixels, while the `show` function animates the height to its default size using a builtin function of FList.  The last line sets the animation delay, or the delay between animating each list element during a filter, to 0 milliseconds so all list elements animate immediately.  