@php
  $goto = 10;
  $page = Request::get('page') ?? 0;
@endphp


<script type="text/javascript">
@if ($page > $max && $page > 1)

var url = new URL( window.location.href );
var query_string = url.search;
var search_params = new URLSearchParams(query_string);
search_params.set('page', 1 );
url.search = search_params.toString();
window.location.replace(url.toString())

@endif
</script>

@if ($max > 1)

<nav aria-label="">
<ul class="pagination justify-content-end">

  <li class="page-item">
    <a class="page-link" search="1">&laquo;</a>
  </li>


  @for ($i = 0; $i < $goto; $i++)
    @if (($i + ($page -5)) <= 0)
      @php
        $goto++
      @endphp
      @continue
    @endif

    @if (($i + ($page -5)) > $max)
      @php
        $goto--
      @endphp
      @continue
    @endif

    <li class="page-item
    @if ($page == ($i + ($page -5)))
      active
    @endif
    "><a class="page-link" search="{{$i + ($page -5)}}">{{$i + ($page -5)}}</a></li>
  @endfor

  <li class="page-item">
    <a class="page-link" search="{{ $max }}">&raquo;</a>
  </li>
</ul>
</nav>
@endif
