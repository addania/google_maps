import axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDcPAiz3cOtGCJRjKeaKE42i9jbK3tX73M";

type GoogleGeoCodingResponse = {
  results: Array<{
    geometry: {
      location: { lat: number; lng: number };
    };
  }>;
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
    enteredAddress
  )}&key=${GOOGLE_API_KEY}`;

  /* How we can use globally available fetch function (without use of 3rd party library)
  
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => console.log("my data", data.results[0].geometry.location));
  */

  axios
    .get<GoogleGeoCodingResponse>(url)
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error(
          "Something went wrong. Your IP address might not be allowed to use this API key. Contact Support"
        );
      }
      const coordinates = response.data.results[0].geometry.location;
      let map: google.maps.Map;
      async function initMap(): Promise<void> {
        const { Map } = (await google.maps.importLibrary(
          "maps"
        )) as google.maps.MapsLibrary;
        map = new Map(document.getElementById("map") as HTMLElement, {
          center: {
            lat: coordinates.lat,
            lng: coordinates.lng,
          },
          zoom: 13,
        });

        new google.maps.Marker({
          // The below line is equivalent to writing:
          // position: new google.maps.LatLng(-34.397, 150.644)
          position: { lat: coordinates.lat, lng: coordinates.lng },
          map: map,
        });
      }

      initMap();
    })
    .catch((error) => {
      alert(error.message);
    });
}

form.addEventListener("submit", searchAddressHandler);
