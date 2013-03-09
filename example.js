$(document).ready( function() {
  var filter_list = new FList( $("#flist") );
  $("input").change( function () {
    filter_list.filter( $(this).val() );
  }).keyup( function ( ev ) {
    $(this).change();
  });
});
