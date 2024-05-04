function isInside(point, polygon) {
  const latitudePoint = point[0];
  const longitudePoint = point[1];

  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const latitudePolygonI = polygon[i][0];
      const longitudePolygonI = polygon[i][1];
      const latitudePolygonJ = polygon[j][0];
      const longitudePolygonJ = polygon[j][1];

      const intersects =
          (latitudePolygonI > latitudePoint) !== (latitudePolygonJ > latitudePoint) &&
          longitudePoint <
              ((longitudePolygonJ - longitudePolygonI) *
                  (latitudePoint - latitudePolygonI)) /
                  (latitudePolygonJ - latitudePolygonI) +
                  longitudePolygonI;

      if (intersects) {
          inside = !inside;
      }
  }

  return inside;
}


function getCenter(points) {
  const centroid = points.reduce((acc, point) => {
    return [acc[0] + point[0], acc[1] + point[1]];
  }, [0, 0]);
  centroid[0] /= points.length;
  centroid[1] /= points.length;

  return [centroid[0], centroid[1]]
}

export { isInside, getCenter };