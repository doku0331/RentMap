(function ($) {
  $(document).ready(function () {
    initMap();
  });

  function initMap() {
    let mapHelper = new MapHelper();
    const initPoint = [23.97565, 120.9738819];
    const initZoom = 7;
    const map = L.map("map").setView(initPoint, initZoom);

    //設定圖層
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© OpenStreetMap <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom: 20,
    }).addTo(map);

    //跳到學校
    const yzuCoordinate = [24.9703173, 121.2612535];
    mapHelper.flyToPoint(map, yzuCoordinate, mapHelper.zoom, 3);

    //設定點
    for (const index in yzuHouseData) {
      const pin = mapHelper.createPin(
        map,
        yzuHouseData[index],
        Icons.GREENICON
      );

      if (!pin) continue;
      $(pin).on("click", function (e) {
        debugger;
        mapHelper.setCircle(map, pin, 400)
      });
    }
  }
})($);
