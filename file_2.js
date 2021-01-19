Colors = {};
Colors.names = {
    azure: "#f0ffff",
    cyan: "#00ffff",
    darkblue : "#00008b",
    darkcyan : "#008b8b",
    darkgrey : "#a9a9a9",
    darkgreen: "#006400",
    gold     : "#ffd700",
    khaki    : "#f0e68c",
    orange   : "#ffa500",
    violet   : "#800080",
    yellow   : "#ffff00"
};
Colors.random = function() {
    var result; var count = 0;
    for ( var prop in this.names )
        if ( Math.random() < 1/++count )
           result = prop;
    return Colors.names[result];
};

const locale = navigator.languages != undefined ? navigator.languages[0] : navigator.language;
const month_names=[];
const day_names  =[];
const NOMS_DIES  ={};

var _search_ticks = +Date.now();
var last_selected = 0;

for (var i = 0; i < 12; i++) {
  dat = new Date( 2000 , i , 1 );
  month_name = dat.toLocaleDateString(locale, { month: 'long'})
  month_names.push( month_name )

  dat = new Date( 2000 , 1 , i );
  day_name = dat.toLocaleDateString( locale, { weekday: 'long'})
  if (!day_names.includes(day_name)) {
    day_names.push( day_name )
    NOMS_DIES[dat.getDay()] = day_name
  }
}

///////////////////////////////// modal slides /////////////////////////////////
const urlParams = new URLSearchParams( window.location.search );
function setParam( key ,  val ){
  urlParams.set( key , val );
  window.location.search = urlParams;
}

function removeParam(key) {
    sourceURL = location.search
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) { params_arr.splice(i,1); }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

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

function selected_instrument( elem ,event=undefined){
  $('#ric-name').removeClass('d-none');
  $('#instruments-found li ').removeClass('active')
  $(elem).addClass('active')

  $('#search-instrument').val(
    $(elem).html().replace(/(<([^>]+)>)/gi, "").split('/')[1].trim()
  )

  $('#i-name, .i-name').html( $( elem ).html() )

  id = $(elem).data('id')
  fav = $(elem).data('fav')

  $('#search-instrument').data('selected', id )
  $('*[favorite]').removeClass('d-none')

  if ( fav ){
    $('*[favorite]').addClass('text-warning')
  } else {
    $('*[favorite]').removeClass('text-warning')
  }

  if ( window.on_click_instrument ){
    on_click_instrument( elem )
  }

  if (event != undefined){
    $('#search-dropdown').addClass('d-none');
    $('.more-instruments,.not-found').remove()
    event.stopPropagation();
  }
}

function get_more_instruments(){
  page = $('#search-instrument').data('page')
  page += 1
  $('#search-instrument').data('page', page )
  get_instruments()
  $('#search-instrument').data('page', page )
}

function get_instruments(){
  $('#search-dropdown').removeClass('d-none');
  $('#search-group').removeClass('no-data');
////////////////////////////////////////////////////////////////////////////////
  search_val = $('#search-instrument').val()

  $.ajax({
    dataType: "json",
    url: '/ajax/instruments',
    data: {
      'ric': search_val,
      'country': $('#country').val(),
      'index': $('#index').val(),
      'sector': $('#sector').val(),
      'page': $('#search-instrument').data('page'),
      'favs': $("li[show-part='fav']").hasClass( "selected" )
    } ,
    success: function( data ){
      more = data.get_more
      fetc = data.found
      html = ''
      for ( var i = 0; i < fetc.length; i++ ){

        html += `
          <li data-id='${fetc[i]['id']}' data-country='${fetc[i]['pais']}' data-fav='${fetc[i]['fav']}'>
            <b>${fetc[i]['ric']}</b> / ${fetc[i]['name']}
          </li>`
      }

      if (data.page == 0){
        $('#instruments-found').html(html)
      } else {
        $('.more-instruments,.not-found').remove()
        $('#instruments-found').append(html)
      }

      $('#instruments-found li').click( function (event) {
        selected_instrument( this , event )
      });

      if (search_val.length >= 5 && data.elems == 1 ){
        fst = $('#instruments-found li').first()
        selected_instrument( fst )
        $('#search-dropdown').addClass('d-none');
      }

      if ( more ){
        more = $(`
          <li class='more-instruments'>
              <b>
                <i class="fa fa-chevron-down"></i>
              </b>
          </li>
         `);
        $('#instruments-found').append( more )
        $(more).click( get_more_instruments )
      } else if (html == ''){
        text = $('#search-instrument').attr('not-found-text')
        $('#instruments-found').append(`<li class='not-found'> <b>${text}</b> </li>` )
      }
    },
    error: function(e){
      console.log( e.responseText );
    }
  });

  $('#search-instrument').data('page', 0 )
}

// /////////////////////////////////////////////////////////////////////////////
$( document ).ready(function(){
// autoupdate //////////////////////////////////////////////////////////////////
  $('.update-header').change( function(){
  selection = $(this).val()
  if (last_selected != selection){
    last_selected = selection
    name = $(this).attr('name');

    if ( selection == 'all' ) {
      urlParams.delete( name )
      window.location.search = urlParams;
      return
    }

    if (urlParams.get(name) != selection){
      setParam( name , selection );
    }
  }});

  $('.update-header').each(function(){
    deff = $(this).attr( 'default' )
    name = $(this).attr( 'name' )
    val = urlParams.get( name )

    if (deff != 'null') {
      sl = ''
      if ( deff == undefined ) { deff = 'All'}
      if ( val == undefined) { sl = 'selected' }
      $(this).prepend(`<option ${sl} value='all'>${deff}</option>`)
    }

    if (val != undefined ) {
      $(this).val(val)
    }

    $(this).select2();
  });

//////////////////////////////////////////////////////////////////////////////
  $("*[data-group]").click(function(){
    $(this).parent().children().children().removeClass('bg-main')
    $(this).children().addClass('bg-main')

    $('.'+$( this ).data('group')).addClass('d-none')
    $('.'+$( this ).data('group')+'[group-id="'+$( this ).data('target')+'"]').removeClass('d-none')
  });
  $(".selection-group").children().click(function(){
    $(this).parent().children().removeClass('selected')
    $(this).addClass('selected')
    id =$(this).attr('group-id')
    if ( id != undefined ){
      tc = $('*[group-act="'+id+'"]').parent().attr('toggle-class')
      if (tc == undefined ){
        tc = 'selected'
      }
      $('*[group-act="'+id+'"]').parent().children().removeClass( tc )
      $('*[group-act="'+id+'"]').addClass( tc )
    }
  });
  $("select.selection-group").change(function(){
    id = $(this).val()
    tc = 'selected'
    $('*[group-act="'+id+'"]').parent().children().removeClass( tc )
    $('*[group-act="'+id+'"]').addClass( tc )
  });
// ///////////////////////////////////////////////////////////////////////////
  // add to favorites
  $("*[favorite]").click(function(){
    $.ajax({
      dataType: "json",
      url: '/ajax/set_fav',
      data: {
        'id': $('#search-instrument').data( 'selected' ),
      } ,
      success: ( data )=>{
        $('*[favorite]').toggleClass('text-warning')
      }
    });
  });
  // print page on click events
  $("*[print='click']").click(()=>{
    window.print();
  });
  $('.custom-control-label').on('click',function(){
    forr = $(this).attr('for')
    if ($('#'+forr)[0].hasAttribute('selected')){
      $('#'+forr).removeAttr('selected')
    }else {
      $('#'+forr).attr('selected','true')
    }
  })

  // buscador /////////////////////////////////////////////////////////////////
  if ( $('#card-search').length ) {
    search_offset = $( '#card-search' ).parent().offset().top
    if (search_offset < $( '#card-search' ).offset().top ){
      $( '#card-search' ).addClass( 'sticky-search' );
      $( '#print-and-fav' ).removeClass( 'd-none' );
    }else{
      $( '#card-search' ).removeClass('sticky-search');
      $( '#print-and-fav' ).addClass( 'd-none' );
    }

    $(document).scroll(()=>{
      dn = +Date.now()
      if (search_offset < $( '#card-search' ).offset().top ){
        if ((dn -_search_ticks) < 100){ return }
        $( '#card-search' ).addClass( 'sticky-search' );
        $( '#print-and-fav' ).removeClass( 'd-none' );
      }else{
        $( '#card-search' ).removeClass('sticky-search');
        $( '#print-and-fav' ).addClass( 'd-none' );
      }
      _search_ticks = dn;
    }).bind( search_offset );

    // stikiy

    $(document).on('click', function(){
      $( '#search-dropdown' ).addClass( 'd-none' );
    });

    $('#search-group, #search-dropdown').click(function( event ){
      $('#search-dropdown').removeClass('d-none');
      event.stopPropagation();
    });

    $('li[show-part]').click(function(){
      $('li[show-part]').removeClass('selected');
      $(this).addClass( 'selected' );
      $('#search-instrument').data('page', 0 )
      get_instruments()
    });

    $('#search-instrument').keyup(delay(function(){
      $('#search-instrument').data('page', 0 )
      get_instruments()
    }, 300 ));

    $('#country').change(delay(function(){
      country = parseInt($(this).val())
      countryval = $(this).val()

      $('#index option[data-country]').each(function(){
        $(this).unwrap('div')
        if (countryval != '' ) {
          if ($(this).data('country') != country ) {
            $(this).wrap('<div></div>')
          } else {
            $(this).unwrap('div')
          }
        }
      });

      $('#search-instrument').data('page', 0 )
      $('#index').val($('#index option').first().val())
      $('#index').select2()

      get_instruments()
    }, 150 ));

    $('#index, #sector').change(delay(function(){
      $('#search-instrument').data('page', 0 )
      get_instruments()
    }, 150 ));


    $('#search-dropdown').addClass('d-none');
  }
  // buscador /////////////////////////////////////////////////////////////////


  get_instruments()
});
