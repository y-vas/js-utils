<script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>

<script type="text/javascript">

$( document ).ready( function( ){

    $( ".btn-danger" ).click( function(event) {
      if ( $( this ).attr('alert') == 'false' ) {
        return true;
      }else{
        if (!confirm(confirm_text)){ event.preventDefault(); }
      }
    });


    $('.search .searchinpage').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){ search_params();  }
    });

    $('.searchinpage-single').keypress(function(event){
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if(keycode == '13'){ search_params();  }
    });

    $('.searchinpage-update').change(function(event){
      search_params();
    });

    $(".searchinpage").each(function(){
      var url = new URL( window.location.href );
      var query_string = url.search;
      var search_params = new URLSearchParams(query_string);
      $(this).val(search_params.get(this.name));
    });

    $( ".page-link" ).click(function() {
      var url = new URL( window.location.href );
      var query_string = url.search;
      var search_params = new URLSearchParams(query_string);
      search_params.set('page', $(this).attr('search'));
      url.search = search_params.toString();
      window.location.replace(url.toString())
    });

    // ajax forms
    $(".ajaxfrom").submit(function(event){
      event.preventDefault(); //prevent default action
      ajaxform(this);
    });

    $(".ajaxfrom-single").click(function(event){
      event.preventDefault(); //prevent default action
      var post_url = $(this).attr("action"); //get form action url
      var request_method = $(this).attr("method"); //get form GET/POST method
      var func = $(this).attr("callback");

      $.ajax({
        url : post_url,
        type: request_method,
      }).done(function(response){ //
        window[func]({
          'data':response,
          'obj': this
        });
      });

    });

    $( ".sidebar-but" ).click(function() {
      e = $( "#sidebar-nav" );

      if ($( e ).css( "display" ) != 'block'){
        $( e ).css( "display" ,'block');
        return;
      }

      $( e ).css( "display", 'none');
    });
});

function ajaxform(elem){
  var post_url = $(elem).attr("action"); //get form action url
  var request_method = $(elem).attr("method"); //get form GET/POST method
  var func = $(elem).attr("callback");
  var enctype = $(elem).attr("enctype");
  var form_data = new FormData(elem);

  $.ajax({
    url : post_url,
    type: request_method,
    enctype: enctype,
    data : form_data,
    contentType: false,
    processData: false,
    success: function (response) {
      window[func]({
        'data':response,
        'obj': elem
      });
    }
  });
}

function search_params(){
  var url = new URL(window.location.href);
  var query_string = url.search;
  var search_params = new URLSearchParams(query_string);
  $( ".searchinpage,.searchinpage-single, .searchinpage-update" ).each(function( index ) {
    name = $( this ).attr('name');
    val = $( this ).val();
    if (val != ''){
      search_params.set(name, val);
    }else{
      search_params.delete(name);
    }
  });
  url.search = search_params.toString();
  window.location.replace(url.toString())
}

</script>
