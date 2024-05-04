def is_point_inside_polygon(point, polygon):
    """
    Check if a point is inside a polygon.

    :param point: Tuple of (latitude, longitude) for the point
    :param polygon: List of tuples representing the polygon vertices [(lat1, lon1), (lat2, lon2), ...]
    :return: True if the point is inside the polygon, False otherwise
    """
    lat, lon = point

    # Check if the point is outside the bounding box of the polygon
    min_lat = min(p[0] for p in polygon)
    max_lat = max(p[0] for p in polygon)
    min_lon = min(p[1] for p in polygon)
    max_lon = max(p[1] for p in polygon)

    if lat < min_lat or lat > max_lat or lon < min_lon or lon > max_lon:
        return False

    # Ray casting algorithm
    inside = False
    n = len(polygon)

    for i in range(n):
        j = (i + 1) % n
        if ((polygon[i][1] > lon) != (polygon[j][1] > lon)) and \
           (lat < (polygon[j][0] - polygon[i][0]) * (lon - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]):
            inside = not inside

    return inside
