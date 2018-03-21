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