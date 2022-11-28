(function ($) {
  //共用變數
  let map;
  let mapHelper;
  const $infoCardBlock = $("#infoCardBlock");
  let houseData = yzuHouseData;
  let facilitiesData = yzuFacilitiesData;
  let dangerousData = yzuDangerousData;
  $(document).ready(function () {
    initMap();
    loadData();
  });

  /**
   * 初始化地圖物件
   */
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
  }

  //載入資料
  function loadData() {
    //跳到學校
    const yzuCoordinate = [24.9703173, 121.2612535];
    mapHelper.flyToPoint(yzuCoordinate, mapHelper.zoom, 2);

    const school = "YZU";
    const houseUrl = `http://house.nfu.edu.tw/${school}/`;
    //載入房屋資料
    loadHouseData(houseUrl, houseData);
    LoadFacilitiesData(facilitiesData);
  }

  /**
   * 載入房屋資料
   * @param {*} url 房屋詳細資訊的url
   * @param {Array} houseData 房屋的資料
   */
  function loadHouseData(url, houseData) {
    //設定點
    for (const index in houseData) {
      const data = houseData[index];
      if (!data["latitude"] || !data["longitude"]) {
        continue;
      }
      const latLng = [data["latitude"], data["longitude"]];
      const houseHtml = `
        <div class="card">
            <div class="card-body">
              <h5 class="card-title">${
                data["house_title"] || data["house_desc"]
              }</h5>
              <p class="card-text">
                位置:${data["house_address"]}<br>
                大小:${data["house_area"]}<br>
                類型:${data["house_type"]}<br>
                描述:${data["house_desc"]}<br>
                租金:${data["rental"]}元<br>
              </p>
              <a href="
              ${url + data["house_id"]}" 
              target="_blank">查看原始租屋網站</a>
            </div>
          </div>
      `;
      const pin = mapHelper.createPin(
        latLng,
        data["house_address"],
        houseHtml,
        Icons.GREENICON
      );
      houseFeatureGroup.addLayer(pin);
      if (!pin) continue;

      $(pin).on("click", housePinEvent);
    }
    houseFeatureGroup.addTo(map);
  }

  /**
   * 載入事件資料
   * @param {*} pinLatLng 中心點的房屋的座標
   * @param {*} range 範圍大小
   * @param {*} eventData 事件的資料
   */
  function LoadEventOfPin(pinLatLng, range, eventData) {
    const eventHtmlArray = [];

    eventData.forEach((data) => {
      //算出距離
      const latlng = [data.latitude, data.longitude];
      const distance = mapHelper.distanceByLnglat(pinLatLng, latlng);
      if (distance > range) return;

      const descriptionHtml = `
        <div class="card">
            <div class="card-body">
              <h5 class="card-title">${data.address}</h5>
              <p class="card-text">
                描述:${data.description}<br>
                距離:${Math.floor(distance)}公尺
              </p>
            </div>
          </div>
      `;

      const eventPin = mapHelper.createPin(
        latlng,
        data.address,
        descriptionHtml,
        Icons.REDICON
      );
      deleteFeatureGroup.addLayer(eventPin);
      eventHtmlArray.push(descriptionHtml);
      eventPins.push(eventPin);
    });
    //畫出事件區
    eventHtmlArray.forEach(function (item, index) {
      const $infoCard = $(item);
      $infoCardBlock.append($infoCard);
      //事件區點選會做的事情
      $infoCard.click(() => {
        //點下去會跳資訊
        eventPins[index].openPopup();
        // //畫線
        // var latlngs = [pinLatLng, eventPins[index].getLatLng()];
        // let line = mapHelper.setLine(latlngs, "red");
        // deleteFeatureGroup.addLayer(line);
      });
    });
  }
  /**
   * 載入周圍設施的資料
   * @param {*} facilitiesData 設施的資料
   */
  function LoadFacilitiesData(facilitiesData) {
    facilitiesData.forEach((data) => {
      const latLng = [data.latitude, data.longitude];
      const label = mapHelper.createLabel(latLng, data.title);
      facilitiesFeatureGroup.addLayer(label);
    });

    facilitiesFeatureGroup.addTo(map);
  }

  /**
   * 對點下去的房屋，畫上到設施的直線
   * @param {*} pinLatLng 中心點的座標
   * @param {*} facilitiesData 設施的資料
   */
  function DrawLineToFacilities(pinLatLng, facilitiesData) {
    facilitiesData.forEach((data) => {
      const latLng = [data.latitude, data.longitude];
      var latlngs = [pinLatLng, latLng];
      let line = mapHelper.setLine(latlngs, "yellow");
      deleteFeatureGroup.addLayer(line);
    });
  }

  //事件區

  //存危險事件的圖標陣列
  let eventPins = [];
  //每次點選都會刪除的圖層
  let deleteFeatureGroup = new L.featureGroup();
  //房子的圖層
  let houseFeatureGroup = new L.featureGroup();
  //設施的圖層
  let facilitiesFeatureGroup = new L.featureGroup();

  //房屋點事件
  function housePinEvent(e) {
    //清除所有需要被清除的
    eventPins = [];
    $infoCardBlock.children().remove();
    deleteFeatureGroup.clearLayers();

    let pin = e.target;
    let pinLatLng = [pin.getLatLng().lat, pin.getLatLng().lng];
    let range = 400;

    //畫圈圈
    searchCircle = mapHelper.setCircle(pin, range);
    deleteFeatureGroup.addLayer(searchCircle);
    //載入危險事件
    LoadEventOfPin(pinLatLng, range, dangerousData);
    //畫線到重要設施
    DrawLineToFacilities(pinLatLng, facilitiesData);
    map.removeLayer(houseFeatureGroup);
    pin.addTo(map);
    deleteFeatureGroup.addTo(map);
  }
  //針對 查看其他房屋的按鈕
  $("#checkAnotherHouseBtn").click(function (e) {
    if (map.hasLayer(houseFeatureGroup)) {
      return;
    }
    $infoCardBlock.children().remove();
    $infoCardBlock.html(` 
      <p style="text-align: center; color: white">
        請點選畫面上的租屋點查看周圍危險環境
      </p>
    `);
    deleteFeatureGroup.clearLayers();
    map.addLayer(houseFeatureGroup);
  });
})($);
