console.log("Javascript Stuff here...");

const events = new EventSource('http://localhost:8000/events');
events.onmessage = (event) => {
  if (event) {
    console.log("incoming event:", event);
    const data = JSON.parse(event.data);
    console.log(data);
  }
}
events.onerror = (err) => {
  console.error("EventSource failed:", err);
};


function createSampleItem() {
  console.log("Button has been clicked!");
  fetch("http://localhost:8000/createSample").then(function (response) {
    return response;
  }).then(function (data) {
    alert("Sample Item created!");
    console.log(data);
  }).catch(function (err) {
    console.log('Fetch Error :-S', err);
  });
}