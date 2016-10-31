import unittest
from osmparser.graph import Edge, Node
from osmparser.osm_graph import OSMWay
from directions import generator

node_id_counter = 0
way_id_counter = 0

def get_node(lat, lng):
    return Node(curr_lat_long.lat, curr_lat_long.lng)

def create_edge(name, lat_long_pairs):
    global node_id_counter
    global way_id_counter
    node_id_counter += 1
    nodes = list(map(lambda pair: Node(node_id_counter, pair[0], pair[1]), lat_long_pairs))
    way_id_counter += 1
    return Edge(way_id_counter, nodes, 1, {"name": name})

def generate_route(locs):
    return list(map(lambda loc: {"lat": loc[0], "lng": loc[1]}, locs))

class DirectionsGeneratorTestCase(unittest.TestCase):

    def test_generate_simple_direction(self):
        loc_1 = [49, -123]
        loc_2 = [49, -124]
        loc_3 = [49, -122]
        loc_4 = [50, -124]
        edges = [create_edge("Main st", [loc_1, loc_2]), create_edge("Arbutus st", [loc_2, loc_3]), create_edge("Fir st", [loc_1, loc_4])]

        lat_lon_pairs = [{"lat": edges[0].nodes[0].lat, "lng": edges[0].nodes[0].lon}, {"lat": edges[0].nodes[1].lat, "lng": edges[0].nodes[1].lon}]
        direction = generator.generate_direction(edges[0], lat_lon_pairs[0], lat_lon_pairs[1], edges)
        self.assertEqual(direction, "Main st (Fir st - Arbutus st)")

    def test_generate_directions(self):
        loc_1 = [49, -123]
        loc_2 = [49, -124]
        loc_3 = [49, -122]
        loc_4 = [50, -124]
        loc_5 = [50, -127]
        loc_6 = [46, -120]
        edges = [create_edge("Main st", [loc_1, loc_2]), create_edge("Arbutus st", [loc_2, loc_3]), create_edge("Fir st", [loc_1, loc_4]), create_edge("Park st", [loc_5, loc_4]), create_edge("Wood st", [loc_6, loc_3])]

        route = generate_route([loc_5, loc_4, loc_1, loc_2, loc_3, loc_6])
        expectedDirections = [
            "Park st (? - Fir st)",
            "Fir st (Park st - Main st)",
            "Main st (Fir st - Arbutus st)",
            "Arbutus st (Main st - Wood st)",
            "Wood st (Arbutus st - ?)"
        ]
        directions = generator.generate_directions(route, edges)
        self.assertEqual(directions, expectedDirections)