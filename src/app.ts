import axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDcPAiz3cOtGCJRjKeaKE42i9jbK3tX73M";

type GoogleGeoCodingResponse = {
  results: Array<{ geometry: { location: { lan: number; lng: number } } }>;
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
  console.log("url", url);

  axios
    .get<GoogleGeoCodingResponse>(url)
    .then((response) => {
      if (response.data.status !== "OK") {
        throw new Error("Ouch");
      }
      console.log("response", response);
      const coordinates = response.data.results[0].geometry.location;
      console.log("coordinates", coordinates);
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
    });
}

form.addEventListener("submit", searchAddressHandler);
