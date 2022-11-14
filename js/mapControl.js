(function ($) {
  $(document).ready(function () {
    initMap();

  });


  function initMap() {
    const centerPoint = [25.0334722,121.5648333];
    const zoom = 12 // 0-18
    const map = L.map("map").setView(centerPoint, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© OpenStreetMap <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    const marker = L.marker(centerPoint);
    marker.addTo(map);
    for (const index in yzuHouseData) {
      createPin(yzuHouseData[index], map);
    }
  }
  
  /**
   * 創立一個圖標
   * @param {*} houseInfo 房屋資訊
   * @param {*} map 地圖本體
   */
  function createPin(houseInfo, map) {  
    if(!houseInfo.latitude || !houseInfo.longitude){
      console.log(houseInfo.house_address+"不見了")
      return;
    }
    //設座標
    const center = [houseInfo.latitude, houseInfo.longitude];
    //訂製圖標的長相
    const marker = L.marker(center, {
      title: houseInfo.house_address, 
    }).addTo(map);
  }

  function setCircle() {
    var circle = L.circle(
        [mylat, mylon],   // 圓心座標
        range,                // 半徑（公尺）
        {
            color: 'blue',      // 線條顏色
            fillColor: 'blue', // 填充顏色
            fillOpacity: 0.2   // 透明度
        }
    ).addTo(layerGroup);
}

})($);
