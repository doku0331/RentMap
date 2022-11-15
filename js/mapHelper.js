const Icons = {
  REDICON: 1,
  GREENICON: 2,
  DEFAULT: 3,
};

/**
 * 地圖幫助物件
 */
function MapHelper() {
  //縮放度(預設16)
  this.zoom = 16;

  var greenIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  var redIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  /**
   * 創立一個圖標
   * @param {*} houseInfo 房屋資訊
   * @param {*} map 地圖本體
   * @param {Icons} icon 要哪種icon
   *
   */
  this.createPin = function createPin(map, houseInfo, icon) {
    if (!houseInfo.latitude || !houseInfo.longitude) {
      console.log(houseInfo.house_address + "不見了");
      return;
    }
    //設座標
    const center = [houseInfo.latitude, houseInfo.longitude];

    //訂製圖標的長相
    const marker = L.marker(center, {
      title: houseInfo.house_address,
      icon: getIcon(icon),
    })
      .bindPopup(houseInfo.house_address)
      .addTo(map);
    return marker;
  };

  /**
   * 飛到指定位置
   * @param {*} map 地圖
   * @param {Array} latlng 座標
   */
  this.flyToPoint = function flyToPoint(map, latlng, zoom, time) {
    map.flyTo(latlng, zoom || this.zoom, {
      animate: true, //要不要有動畫效果。
      duration: time || 0.25, // 移動的時間，預設是 0.25 秒。
      easeLinearity: 0.5, // 0-1 之間的值，1 代表線性，數字愈小曲線愈彎。
    });
  };

  /**
   * 
   * @param {L.marker} pin 
   */
  this.setCircle = function setCircle(map, pin, range) {
    var circle = L.circle(
      pin.getLatLng(), // 圓心座標
      range || 500, // 半徑（公尺）
      {
        color: "blue", // 線條顏色
        fillColor: "blue", // 填充顏色
        fillOpacity: 0.2, // 透明度
      }
    ).addTo(map);
    return circle;
  };
  /**
   * 求兩距離
   * @param {*} lat1 經度
   * @param {*} lng1 緯度
   * @param {*} lat2 經度
   * @param {*} lng2 緯度
   * @returns 
   */
  this.distanceByLnglat = function distanceByLnglat(lat1, lng1, lat2, lng2) {
    var radLat1 = Rad(lat1);
    var radLat2 = Rad(lat2);
    var a = radLat1 - radLat2;
    var b = Rad(lng1) - Rad(lng2);
    var s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = s * 6378137.0; // 取WGS84標準參考橢球中的地球長半徑(單位:m)
    s = Math.round(s * 10000) / 10000;
    return s;
    // //下面為兩點間空間距離（非球面體）
    // var value= Math.pow(Math.pow(lng1-lng2,2)+Math.pow(lat1-lat2,2),1/2);
    // alert(value);
  };

  /**
   * 回傳Icon物件
   * @param {Icons} icon 指定icon
   * @returns
   */
  function getIcon(icon) {
    let PinIcon = null;
    switch (icon) {
      case Icons.REDICON:
        PinIcon = redIcon;
        break;
      case Icons.GREENICON:
        PinIcon = greenIcon;
        break;
      default:
        PinIcon = null;
        break;
    }
    return PinIcon;
  }
}
