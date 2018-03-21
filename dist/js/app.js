(function(){
    document.addEventListener("DOMContentLoaded", init);
    function init(){
        http.get('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json').then(function(response){
            let parkingArray = [];
            for(let i = 0, l = response.length; i<l; i++){
                let p = new Parking(
                    response[i].name,
                    response[i].description,
                    response[i].latitude,
                    response[i].longitude,
                    response[i].address,
                    response[i].parkingStatus.availableCapacity,
                    response[i].parkingStatus.totalCapacity
                );

                parkingArray.push(p);
            }
            renderHtml(parkingArray);
            renderMap(parkingArray);
        });
    }

    function renderHtml(parkings){
        let bobTheHTMLBuiler = ``;
        for(let i = 0, l = parkings.length; i<l; i++){
            bobTheHTMLBuiler += `
            <li class="parkings__parking ${renderAvailabilityClass(parkings[i].availableCapacity, parkings[i].totalCapacity)}">
                <div class="parkings__parking__logo">${parkings[i].name}</div>
                <div class="parkings__parking__name">${parkings[i].description}</div>
                <div class="parkings__parking__info">${parkings[i].availableCapacity} / ${parkings[i].totalCapacity}</div>
            </li>
            `;
        }
        document.querySelector(".parkings").innerHTML = bobTheHTMLBuiler;
    }

    function renderAvailabilityClass(avail, total){
        if(avail == 0){
            return "error";
        }

        let result = total - avail;
        if(result > total /2){
            return "danger";
        }
    }

    function renderMap(parkings){
        let markerArray = [];
        for(let i = 0, l = parkings.length; i<l; i++){
            let m = new Pin(
                parkings[i].name,
                parkings[i].latitude,
                parkings[i].longitude, 
                parkings[i].address
            );
            markerArray.push(m);
        }
        
        maps.maping(markerArray);
    }

})();
(function () {
    "use strict";

    function get(url){
        let promise = new Promise(function(ok, nok){
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", url);
            xmlHttp.onload = () => {
                let json = JSON.parse(xmlHttp.responseText);
                ok(json);
            };
            xmlHttp.onerror = () => {
                nok("Er is iet misgelopen, contacteer de administrator");
            };

            xmlHttp.send(null);
        });
        return promise;
    }
    window.http = {
        get: get
    };

})();
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
function Parking(name, description, latitude, longitude, address, availableCapacity, totalCapacity){
    this.name = name;
    this.description = description;
    this.availableCapacity = availableCapacity;
    this.totalCapacity = totalCapacity;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
}
function Pin(name, latitude, longitude, address){
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
}