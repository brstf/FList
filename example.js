$(document).ready( function() {
  var filter_list = new FList( $("#flist") );
  filter_list.setAnimDelay(0);
  $("input").change( function () {
    filter_list.filter( $(this).val() );
  }).keyup( function ( ev ) {
    $(this).change();
  });
});
