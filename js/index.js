(function ($) {
  $(document).ready(function () {
    initMap();
  });
  let map;
  let mapHelper;

  function initMap() {
    const initPoint = [23.97565, 120.9738819];
    const initZoom = 7;
    map = L.map("map").setView(initPoint, initZoom);
    mapHelper = new MapHelper(map);
    //設定圖層
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© OpenStreetMap <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom: 20,
    }).addTo(map);

    //跳到學校
    const yzuCoordinate = [24.9703173, 121.2612535];
    mapHelper.flyToPoint(yzuCoordinate, mapHelper.zoom, 3);

    //設定點
    for (const index in yzuHouseData) {
      const pin = mapHelper.createPin(yzuHouseData[index], Icons.GREENICON);

      if (!pin) continue;

      $(pin).on("click", pinEvent);
    }
  }

  //存搜尋圈圈的範圍
  let searchCircle = new L.circle();
  function pinEvent(e) {
    let pin = e.target;
    //畫圈圈
    map.removeLayer(searchCircle);
    searchCircle = mapHelper.setCircle(pin, 400);
    map.addLayer(searchCircle);
    //長危險事件
    //切換旁邊結果列
  }
})($);
