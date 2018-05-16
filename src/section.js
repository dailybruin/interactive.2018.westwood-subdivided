document.onreadystatechange = function () {
  if (document.readyState === "complete") {
      initApplication();
  }
}

function initApplication() {
  let itemList = document.getElementsByClassName("item");
  // We have to use this instead of a straight forEach, because
  // getElementsByClassName returns an HTMLCollection, not a NodeList
  [].forEach.call(itemList, function (item) {
    let image = item.querySelector("img");
    console.log(image);
    image.crossOrigin = "Anonymous";
    let vibrant = new Vibrant(image);
    let swatches = vibrant.swatches();
    let color = swatches["DarkVibrant"].getHex();
    let card = item.querySelector("a");
    card.style.backgroundColor = color;
  });
}
