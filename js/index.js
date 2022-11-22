(function ($) {
  $(document).ready(function () {
    initMap();
    loadData();
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
  }

  function loadData() {
    //跳到學校
    const yzuCoordinate = [24.9703173, 121.2612535];
    mapHelper.flyToPoint(yzuCoordinate, mapHelper.zoom, 2);

    const school = "YZU";
    const houseUrl = `http://house.nfu.edu.tw/${school}/`;
    //載入房屋資料
    loadHouseData(houseUrl, yzuHouseData);
  }

  //載入房屋資料
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

      if (!pin) continue;

      $(pin).on("click", housePinEvent);
    }
  }

  //事件區

  //存搜尋圈圈的範圍
  let searchCircle = new L.circle();
  //房屋點事件
  function housePinEvent(e) {
    let pin = e.target;
    //畫圈圈
    map.removeLayer(searchCircle);
    searchCircle = mapHelper.setCircle(pin, 400);
    map.addLayer(searchCircle);
    //長危險事件
    //切換旁邊結果列
  }
})($);
