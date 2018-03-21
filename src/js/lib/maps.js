(function () {
    "use strict";

    function maping(markerArray){      
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            scrollwheel: false,
            center: new google.maps.LatLng(51.0823564, 3.5744026),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        var infowindow = new google.maps.InfoWindow();
        var bounds = new google.maps.LatLngBounds();

        var marker, i;
    
        var bounds = new google.maps.LatLngBounds();

        for (i = 0; i < markerArray.length; i++) { 
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(markerArray[i].latitude, markerArray[i].longitude),
                map: map
            });

            bounds.extend(marker.position);
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(markerArray[i].name +"<br>" + markerArray[i].address );
                    infowindow.open(map, marker);
                }
            })(marker, i));
        
        }
        map.fitBounds(bounds);


    }
    window.maps = {
        maping: maping
    };

})();