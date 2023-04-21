  var search;
  var lists;
  
function init_search() {
    lists = instantsearch({
      indexName: 'heylearn_test_custom.list',
      searchClient: algoliasearch(
        'J64J0JCBXM', 
        '6827b6789c5fe107adcc17b2529d78b2'
        )
    });   
    search = instantsearch({
      indexName: 'heylearn_test_custom.approvedresources',
      searchClient: algoliasearch(
        'J64J0JCBXM', 
        '6827b6789c5fe107adcc17b2529d78b2'
        ),
      routing: true
    });


    // initialize RefinementList
    
    const refinementList5 = instantsearch.widgets.refinementList({
        container: '#refinement-list-5',
        attribute: 'subjectname_text' 
    });
    
    const refinementList6 = instantsearch.widgets.refinementList({
        container: '#refinement-list-6',
        attribute: 'subject_text' 
    });
    
    const refinementList7 = instantsearch.widgets.refinementList({
        container: '#refinement-list-7',
        attribute: 'examtype_text_text' 
    });
    
    const refinementList8 = instantsearch.widgets.refinementList({
        container: '#refinement-list-8',
        attribute: 'examboardname_list_text'
    });
    
    const refinementList9 = instantsearch.widgets.refinementList({
        container: '#refinement-list-9',
        attribute: 'subarea_text_list_text', 
        limit: 100,
        sortBy: ["name:asc"]
    });
    
    const refinementList10 = instantsearch.widgets.refinementList({
        container: '#refinement-list-10',
        attribute: 'learnpracticetext_text' 
    });

    const refinementList11 = instantsearch.widgets.refinementList({
        container: '#refinement-list-11',
        attribute: 'resourcetypetext_text' 
    });

    const refinementList2 = instantsearch.widgets.refinementList({
        container: '#refinement-list-2',
        attribute: 'learnpracticetext_text' 
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


    const configure2 = instantsearch.widgets.configure({
          filters: "privacyleveltext_text:public"
    });

    search.addWidgets([
      refinementList2, 
      refinementList4, 
      refinementList5, 
      refinementList7,
      refinementList8,
      refinementList9,
      refinementList10,
      refinementList11, 
      searchbox1, 
      searchbox2,
    ]);

   lists.addWidgets([
      configure2,
      refinementList6
   ]); 


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