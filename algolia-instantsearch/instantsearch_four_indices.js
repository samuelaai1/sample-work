var search;
var movies;
var hotsauce;
var avengers;

function init_search() {

    movies = instantsearch({
        appId: 'J64J0JCBXM',
        apiKey: '6827b6789c5fe107adcc17b2529d78b2',
        indexName: 'heylearn_test_custom.topic'
    });

    hotsauce = instantsearch({
        appId: 'J64J0JCBXM',
        apiKey: '6827b6789c5fe107adcc17b2529d78b2',
        indexName: 'heylearn_test_custom.subject'
    });

    avengers = instantsearch({
        appId: 'J64J0JCBXM',
        apiKey: '6827b6789c5fe107adcc17b2529d78b2',
        indexName: 'heylearn_test_custom.approvedresources'
    });

    // Query length restriction not working but not really the outcome I want anyway
    search = instantsearch({
        appId: 'J64J0JCBXM',
        apiKey: '6827b6789c5fe107adcc17b2529d78b2',
        indexName: 'heylearn_test_custom.author',
        routing: true,
        searchFunction: function (helper) {
        helper.search();
        if (movies.helper) {
            movies.helper.setQuery(helper.getQuery().query);
            if (helper.state.query.length < 3) {                         
            return; // no search if less than 2 character               
        }
            movies.helper.search();
        }
        if (hotsauce.helper) {
            hotsauce.helper.setQuery(helper.getQuery().query);
            if (helper.state.query.length < 3) {                         
            return; // no search if less than 2 character               
        }
            hotsauce.helper.search();
        }
        if (avengers.helper) {
            avengers.helper.setQuery(helper.getQuery().query);
            if (helper.state.query.length < 3) {                         
            return; // no search if less than 2 character               
        }
            avengers.helper.search();
        }
        }
    });

    search.addWidget(
        instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search for resources'
        })
    );

    var makeHits = instantsearch.connectors.connectHits(function renderHits({ hits }) {
        var hitlist = [];
        hits.forEach(function (hit) {
        hitlist.push(JSON.stringify(hit));
        });
        bubble_fn_search_result(hitlist);
    });

    search.addWidget(makeHits());

    var movieHits = instantsearch.connectors.connectHits(function renderHits({ hits }) {
        var hitlist = [];
        hits.forEach(function (hit) {
        hitlist.push(JSON.stringify(hit));
        });
        bubble_fn_movies_result(hitlist);
    });

    movies.addWidget(movieHits());

    var hotsauceHits = instantsearch.connectors.connectHits(function renderHits({ hits }) {
        var hitlist = [];
        hits.forEach(function (hit) {
        hitlist.push(JSON.stringify(hit));
        });
        bubble_fn_hotsauce_result(hitlist);
    });

    hotsauce.addWidget(hotsauceHits());

    var avengersHits = instantsearch.connectors.connectHits(function renderHits({ hits }) {
        var hitlist = [];
        hits.forEach(function (hit) {
        hitlist.push(JSON.stringify(hit));
        });
        bubble_fn_avengers_result(hitlist);
    });

    avengers.addWidget(avengersHits());

    movies.start();
    search.start();
    hotsauce.start();
    avengers.start();
}

$(document).ready(function(){

    $.getScript("https://cdn.jsdelivr.net/npm/algoliasearch@4.14.2/dist/algoliasearch-lite.umd.js" ).done( function() {
      $.getScript("https://cdn.jsdelivr.net/npm/instantsearch.js@4.46.2/dist/instantsearch.production.min.js" ).done( function() {
        console.log("about to run");
        init_search();
        console.log("has run");
      });
    });
  });
