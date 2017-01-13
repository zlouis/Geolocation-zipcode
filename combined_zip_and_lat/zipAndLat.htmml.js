<!DOCTYPE html>
<html>
  <head>


      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">


<!--   <link rel="stylesheet" href="assets/css/style.css"> -->
  <script src="https://code.jquery.com/jquery-2.2.1.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

  <!-- Firebase Reference -->
  <script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>

  <!-- Moment.js Reference -->
  <script src="https://cdn.jsdelivr.net/momentjs/2.12.0/moment.min.js"></script>
    <meta charset="utf-8">
    <title>Search for up to 200 places with Radar Search</title>

    

    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 100%;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
    <script>
      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      var map;
      var infoWindow;
      var service;
    //storage for latitude and longitude of searched zipcode
    var lats=0;
    var longs=0;
   //user input zip from form 
   var resultsBank=[];


//searches lat and long of user based on current location
function currentlocation(lat, long) {
        var queryURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=museums&location="+lat+","+long+"&radius=50000&key=AIzaSyB57N6LfRt0KPZjKV9f0U-rxCaNF4KLL-k";
      return queryURL;
}

function getMuseum (queryURL) {
    $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
    var results = response.data;
    // for (var i=0; results.length;i++) {
    //   var museums= $('<div class="text-m>');
    //   var museumhere=value.name;
    //   museums.attr('src', results[i].object.name)
    // }

    console.log(queryURL);
    console.log(response);
  });
}  




 function queryUrlConstructor (zipcode) {
  var queryURL="https://crossorigin.me/https://maps.googleapis.com/maps/api/geocode/json?&address="+ zipcode +"&key=AIzaSyAZsRAVEPtigI7SzB_QnCuY92bdh0OpefY";
  return queryURL;
 }
//queryURL with ajax call to pull latitude and longitude out of JSON
//deleted crossoriginme to have the query URL work
  var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?&address=08854&key=AIzaSyAZsRAVEPtigI7SzB_QnCuY92bdh0OpefY";
      
  $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
   var results = response.data;
   console.log(queryURL);
   console.log(response);
   var latlongs=[];
   var latlong= $('<div class="latlong">'); //does nothing
    lats=response.results[0].geometry.location.lat//grabs lats of zipcode
    longs=response.results[0].geometry.location.lng//grabs long of zipcode
    //prints out lat and long
    console.log(lats)
    console.log(longs)
    initMap();
 });
  //start map with latitude and longitude
    function initMap() {
    var userInputPosition={lat: lats, lng:longs}
    //user zipcode location through lat and longs
    console.log(userInputPosition) 
        map = new google.maps.Map(document.getElementById('map'), {
          //view centered at zipcode location
          center: userInputPosition, 
          //map zoom
          zoom: 5,
          styles: [{
            stylers: [{ visibility: 'simplified' }]
          }, {
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }]
        });
        infoWindow = new google.maps.InfoWindow();
        service = new google.maps.places.PlacesService(map);
        // The idle event is a debounced event, so we can query & listen without
        // throwing too many requests at the server.
        map.addListener('idle', performSearch);
    }
     
      //search inputs of venue 
     function performSearch() {
       var request = {
         bounds: map.getBounds(),
         keyword: "museum", //radarsearch, 
         // query:'hiking_trail' //text search
          placeId:'ChIJN1t_tDeuEmsRUsoyG83frY4'
      };
        service.radarSearch(request, callback);
        // service.textSearch(request, callback);
        // console.log(serice.radarSearch(request, callback))
        // service.getDetails(request, callback);
      }
      function callback(results, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          console.error(status);
          return;
        }
        for (var i = 0, result; result = results[i]; i++) {
          //adds marker to results of venues
          addMarker(result);
          createPhotoMarker(result);

          // rating(result.rating);
          // createMarker(place);
          // shows array of objects related to the venue, able to pull anything
          // console.log(result.rating) 
          

          // console.log(result) 
           // console.log(result.text)
        }
  //       else (status == google.maps.places.PlacesServiceStatus.OK) {
  //         createMarker(place);
  // }
      }
     //creates photo of venue
      function createPhotoMarker(place) {
        var photos = place.photos;
          if (!photos) {
           return;
           }
        var marker = new google.maps.Marker({
           map: map,
           position: place.geometry.location,
           title: place.name,
           icon: photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
        });
      }
       
      
        //adds marker
         function addMarker(place) {
           var marker = new google.maps.Marker({
             map: map,
             position: place.geometry.location,
             icon: {
               title: place.name,
               url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
               anchor: new google.maps.Point(10, 10),
               scaledSize: new google.maps.Size(10, 17)
             }
          });
      
        google.maps.event.addListener(marker, 'click', function() {
          service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
              console.error(status);
              return;
            }
            infoWindow.setContent(result.name);
            infoWindow.open(map, marker);
            // infoWindow.setContent(result.rating) //rating of venue
            });
        });
      }
    </script>
  </head>
  <body>
    <div id="map"></div>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB57N6LfRt0KPZjKV9f0U-rxCaNF4KLL-k&callback=initMap&libraries=places,visualization" ></script>
  </body>
</html>