$(document).ready( function() {
  var filter_list = new FList( $("#flist") );
  $("#qinput").change( function () {
    filter_list.filter( $(this).val() );
  }).keyup( function ( ev ) {
    $(this).change();
  });
});
