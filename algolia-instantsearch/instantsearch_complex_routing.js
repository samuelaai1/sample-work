  var search;
  var lists;
  
function init_search() {
    lists = instantsearch({
      indexName: 'heylearn_live_custom.list',
      searchClient: algoliasearch(
        'J64J0JCBXM', 
        '6827b6789c5fe107adcc17b2529d78b2'
        ),
    });   
    search = instantsearch({
      indexName: 'heylearn_live_custom.approvedresources',
      searchClient: algoliasearch(
        'J64J0JCBXM', 
        '6827b6789c5fe107adcc17b2529d78b2'
        ),
      routing: {
        router: instantsearch.routers.history({
          createURL({ qsModule, location, routeState }) {
            // current search params 
            const indexState = routeState['heylearn_live_custom.approvedresources'] || {};
            const { origin, pathname, hash, search } = location;
            // grab current query string and convert to object
            const queryParameters = qsModule.parse(search.slice(1)) || {};
            // if there is an active search
            if (Object.keys(indexState).length ){
              // merge the search params with the current query params
              Object.assign(queryParameters, routeState);
            }else{
              // remove the search params
              Object.assign(queryParameters, routeState);
            }
            let queryString = qsModule.stringify(queryParameters);
            if(queryString.length){
              queryString = `?${queryString}`;
            }
            return `${origin}${pathname}${queryString}${hash}`;
          },
        }),
        stateMapping: {
          stateToRoute(uiState) {
            const indexUiState = uiState['heylearn_live_custom.approvedresources'];
            return {
              q: indexUiState.query,
              learnpracticetext_text:indexUiState.refinementList && indexUiState.refinementList.learnpracticetext_text,
              resourcetypetext_text:indexUiState.refinementList && indexUiState.refinementList.resourcetypetext_text,
            };
          },
          routeToState(routeState) {
            return {
              ['heylearn_live_custom.approvedresources']: {
                query: routeState.q,
                refinementList: {
                  learnpracticetext_text: routeState.learnpracticetext_text,
                  resourcetypetext_text: routeState.resourcetypetext_text,
                },
              },
            };
          },
        },
      },
      initialUiState: {
       'heylearn_live_custom.approvedresources': {
          query: 'pythagoras',
          refinementList: {
            learnpracticetext_text: ['Learn'],
          },
        },
      },
      searchFunction: function (helper) {
              helper.search();
              if (lists.helper) {
                lists.helper.setQuery(helper.getQuery().query);
                
                lists.helper.search();
              }
      },
    });


    // initialize RefinementList
    const refinementList1 = instantsearch.widgets.refinementList({
        container: '#refinement-list',
        attribute: 'learnpracticetext_text' 
    });

    const refinementList2 = instantsearch.widgets.refinementList({
        container: '#refinement-list-2',
        attribute: 'learnpracticetext_text' 
    });

    const refinementList3 = instantsearch.widgets.refinementList({
        container: '#refinement-list-3',
        attribute: 'resourcetypetext_text' 
    });

    const refinementList4 = instantsearch.widgets.refinementList({
        container: '#refinement-list-4',
        attribute: 'resourcetypetext_text' 
    });

    // initialize searchBox
    const searchbox1 = instantsearch.widgets.searchBox({
        container: '#search-box',
        placeholder: 'Search for resources'
    });

    const searchbox2 = instantsearch.widgets.searchBox({
        container: '#search-box-2',
        placeholder: 'Search for resources'
    });

    const configure1 = instantsearch.widgets.configure({
        filters: ""
    });

    const configure2 = instantsearch.widgets.configure({
          filters: "privacyleveltext_text:public",
    });

    search.addWidgets([
      refinementList1, 
      refinementList2, 
      refinementList3, 
      refinementList4, 
      searchbox1, 
      searchbox2, 
      configure1,
    ]);

   lists.addWidget(
      configure2,
    ); 


    const makeHits = instantsearch.connectors.connectHits(
      function renderHits({hits}) {
        const hitlist = [];
        hits.forEach(function(hit) {
          hitlist.push(JSON.stringify(hit));
        });
        bubble_fn_search_result(hitlist);
      }
    );

    search.addWidget(makeHits());

    const listHits = instantsearch.connectors.connectHits(function renderHits({ hits }) {
      var hitlist = [];
      hits.forEach(function (hit) {
        hitlist.push(JSON.stringify(hit));
      });
      bubble_fn_list_result(hitlist);
    });    

    lists.addWidget(listHits());


    search.start();
    lists.start();
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
  