const Icons = {
  REDICON: 1,
  GREENICON: 2,
  DEFAULT: 3,
};

/**
 * 地圖幫助物件
 */
function MapHelper(map) {
  //縮放度(預設16)
  this.zoom = 16;
  this.map = map;

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
   * 飛到指定位置
   * @param {Array} latlng 座標
   * @param {float} zoom 縮放大小
   * @param {float} time 時間
   *
   */
  this.flyToPoint = function flyToPoint(latlng, zoom, time) {
    map.flyTo(latlng, zoom || this.zoom, {
      animate: true, //要不要有動畫效果。
      duration: time || 0.25, // 移動的時間，預設是 0.25 秒。
      easeLinearity: 0.5, // 0-1 之間的值，1 代表線性，數字愈小曲線愈彎。
    });
  };

  /**
   * 創立一個圖標
   * @param {*} latLng 座標
   * @param {string} title 標題
   * @param {string} popUpHtml 彈出來的html
   * @param {Icons} icon 指定哪種icon
   * @returns marker
   */
  this.createPin = function createPin(latLng, title, popUpHtml, icon) {
    //訂製圖標的長相
    const marker = L.marker(latLng, {
      title: title,
      icon: getIcon(icon),
    })
      .bindPopup(popUpHtml)
      .addTo(map);
    return marker;
  };

  /**
   * 劃出一個label
   * @param {Array} latlng 座標
   * @param {string} labelText label的字
   * @param {string} labelClass label的class
   * @returns {L.divIcon}
   */
  this.createLabel = function createLabel(latlng, labelText, labelClass) {
    L.marker(latlng, {
      icon: L.divIcon({
        className: labelClass || "labelClass",
        html: labelText,
      }),
    }).addTo(map);
  };
  /**
   * 畫一個圓
   * @param {L.marker} pin 圖標
   * @param {*} range 需要的大小(不傳的話預設500)
   * @returns 圓圈圈
   */
  this.setCircle = function setCircle(pin, range) {
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
   * 求AB兩距離
   * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
   * @param {Array} latLng1 A點座標
   * @param {Array} latLng2 B點座標
   * @returns
   */
  this.distanceByLnglat = function distanceByLnglat(latLng1, latLng2) {
    const deg2rad = (d) => {
      return (d * Math.PI) / 180.0;
    };
    lat1 = latLng1[0];
    lon1 = latLng1[1];
    lat2 = latLng2[0];
    lon2 = latLng2[1];

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
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
