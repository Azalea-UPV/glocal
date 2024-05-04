import unittest
from server.utils.map import is_point_inside_polygon

class TestIsPointInsidePolygon(unittest.TestCase):
    def test_point_inside_polygon(self):
        polygon = [(0, 0), (0, 3), (3, 3), (3, 0)]
        point_inside = (1, 1)
        self.assertTrue(is_point_inside_polygon(point_inside, polygon))

    def test_point_outside_polygon(self):
        polygon = [(0, 0), (0, 3), (3, 3), (3, 0)]
        point_outside = (4, 4)
        self.assertFalse(is_point_inside_polygon(point_outside, polygon))

    def test_point_on_polygon_edge(self):
        polygon = [(0, 0), (0, 3), (3, 3), (3, 0)]
        point_on_edge = (0, 1.5)
        self.assertTrue(is_point_inside_polygon(point_on_edge, polygon))

    def test_complex_polygon(self):
        polygon = [(0, 0), (0, 5), (2, 3), (4, 5), (4, 0)]
        point_inside = (2, 2)
        self.assertTrue(is_point_inside_polygon(point_inside, polygon))

    def test_crossing_vertices_polygon(self):
        polygon = [(0, 0), (0, 3), (3, 3), (1.5, 1.5), (3, 0)]
        point_inside = (1, 1)
        self.assertTrue(is_point_inside_polygon(point_inside, polygon))

if __name__ == '__main__':
    unittest.main()
