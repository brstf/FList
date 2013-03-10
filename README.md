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

This simply calls the `filter` function of the FList object with the contents of the `<input>` every time it's changed or a keyup event is fired on the `<input>` element.  See this example running [here](http://homepages.rpi.edu/~staufb/flist/example1/).

Specifying a Filter
-------------------

To use a different filter for the FList, we can override the `FList.positiveSelector` function.  For example, if we have a list of links with similar text, we can filter by the `href` of the link using a custom filter as follows:

    // Set the positive selector function to also filter by href
    filter_list.positiveSelector = function( el, index, query ) {
        return $(el).is( ":Contains('" + query + "')" ) || $(el).find('a[href*=' + query+']').size() > 0;
    }

The `positiveSelector` function takes 3 arguments, `el`, `index`, and `query`.  The first, `el` is the `HTMLElement` to filter on, the second, `index`, is the index of the list element, and the last, `query` is the text query to test against.  The return value should be `true` if the element matches, or `false` if the list element fails the test.  So, in our filter, we return true if any of the inner text matches, or if more than one inner `href` matches the query.  See this example running [here](http://homepages.rpi.edu/~staufb/flist/example2/)

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

The `hide` function simply animates the height of the element to 0 pixels, while the `show` function animates the height to its default size using a builtin function of FList.  The last line sets the animation delay, or the delay between animating each list element during a filter, to 0 milliseconds so all list elements animate immediately.  See this example running [here](http://homepages.rpi.edu/~staufb/flist/example3/).