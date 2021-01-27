var delete_button_class = '.delete-alert'
var confirmation_default_text = 'Are your sure?'

var url = new URL( window.location.href );
var query_string = url.search;
var search_params = new URLSearchParams(query_string);

$( document ).ready( function( ){

  // trigers a confirm to continue the event
  $( delete_button_class ).click( function( event ){
    if (!confirm(confirmation_default_text)){ event.preventDefault(); }
  });

  // search params helpers
  $('*[serach-params="enter"]').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){ search_params();  }
  });

  $('*[serach-params]').change(function(event){
    search_params();
  });

  $('*[serach-params]').each(function(){
    $(this).val(search_params.get(this.name));
  });

  $( "*[set-page]" ).click(function() {
    search_params.set('page', $(this).attr('set-page'));
    url.search = search_params.toString();
    window.location.replace(url.toString())
  });

  // ---------------------------------------------
  $(".print-me").click(()=>{
    window.print();
  });

  // ajax forms
  // $(".ajaxfrom").submit(function(event){
  //   event.preventDefault(); // prevent default action
  //   ajaxform( this );
  // });
  //
  // $(".ajaxfrom-single").click(function(event){
  //   event.preventDefault(); //prevent default action
  //   var post_url = $(this).attr("action"); //get form action url
  //   var request_method = $(this).attr("method"); //get form GET/POST method
  //   var func = $(this).attr("callback");
  //
  //   $.ajax({
  //     url : post_url,
  //     type: request_method,
  //   }).done(function(response){ //
  //     window[func]({
  //       'data':response,
  //       'obj': this
  //     });
  //   });
  //
  // });

});

function delay(callback, ms) {
  var timer = 0;
  return function() {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, ms || 0);
  };
}

// function ajaxform(elem){
//   var post_url = $(elem).attr("action"); //get form action url
//   var request_method = $(elem).attr("method"); //get form GET/POST method
//   var func = $(elem).attr("callback");
//   var enctype = $(elem).attr("enctype");
//   var form_data = new FormData(elem);
//
//   $.ajax({
//     url : post_url,
//     type: request_method,
//     enctype: enctype,
//     data : form_data,
//     contentType: false,
//     processData: false,
//     success: function (response) {
//       window[func]({
//         'data':response,
//         'obj': elem
//       });
//     }
//   });
// }

function search_params(){
  
  $( ".searchinpage,.searchinpage-single, .searchinpage-update" ).each(function( index ) {
    let name = $( this ).attr('name');
    let val = $( this ).val();
    if ( val != ''){
      search_params.set(name, val);
    }else{
      search_params.delete(name);
    }
  });

  url.search = search_params.toString();
  window.location.replace(url.toString())
}
