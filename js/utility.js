let houseData = yzuHouseData;
let coordinate = yzuCoordinate;

//距離
let map = "";
const mapHelper = new MapHelper(map);
targetCorridate = coordinate;
houseData.forEach((data) => {
  const latLng = [data.latitude, data.longitude];
  data.distinceToSchool = Math.floor(
    mapHelper.distanceByLnglat(latLng, targetCorridate)
  );
});

houseData.forEach((data) => {
  const pinLatLng = [data.latitude, data.longitude];
  let eventCount = 0;
  taoyuanDangerousData.forEach((data) => {
    //算出距離
    const latlng = [data.latitude, data.longitude];
    const distance = mapHelper.distanceByLnglat(pinLatLng, latlng);
    if (distance < 400) eventCount++;
  });
  data.dangerousCount = eventCount;
});

//處裡距離排序
function distenceCompare(a, b) {
  if (a.distinceToSchool < b.distinceToSchool) {
    return -1;
  }
  if (a.distinceToSchool > b.distinceToSchool) {
    return 1;
  }
  return 0;
}

houseData.sort(distenceCompare);
distenceRank = houseData.map((data) => {
  return {
    id: data.house_id,
    dangerous: data.dangerousCount,
    rental: data.rental_min,
    distence: data.distinceToSchool,
  };
});
console.log("距離排序", houseData);

//處理租金排序
function rantalCompare(a, b) {
  if (a.rental_min < b.rental_min) {
    return -1;
  }
  if (a.rental_min > b.rental_min) {
    return 1;
  }
  return 0;
}

houseData.sort(rantalCompare);
rentRank = houseData.map((data) => {
  return {
    id: data.house_id,
    dangerous: data.dangerousCount,
    rental: data.rental_min,
    distence: data.distinceToSchool,
  };
});
console.log("租金排序", houseData);

//處理危險排序
function dangerousCompare(a, b) {
  if (a.dangerousCount < b.dangerousCount) {
    return -1;
  }
  if (a.dangerousCount > b.dangerousCount) {
    return 1;
  }
  return 0;
}

houseData.sort(dangerousCompare);
dangerousRank = houseData.map((data) => {
  return {
    id: data.house_id,
    dangerous: data.dangerousCount,
    rental: data.rental_min,
    distence: data.distinceToSchool,
  };
});
console.log("危險排序", houseData);
