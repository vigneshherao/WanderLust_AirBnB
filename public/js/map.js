mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: locationMaker, // starting position [lng, lat]
  zoom: 15, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "red", rotation: 15 })
  .setLngLat(locationMaker)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML((`<div>
        <h5>Villa Location</h5>
        <p>Exact location provided after booking</p>
      </div>`))
  )
  .addTo(map);
