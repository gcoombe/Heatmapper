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

class DirectionsGeneratorTestCase(unittest.TestCase):

    def test_generate_simple_direction(self):
        loc_1 = [49, -123]
        loc_2 = [49, -124]
        loc_3 = [49, -122]
        loc_4 = [50, -124]
        edges = [create_edge("Main st", [loc_1, loc_2]), create_edge("Arbutus st", [loc_2, loc_3]), create_edge("Fir st", [loc_1, loc_4])]

        direction = generator.generate_direction(edges[0], edges[0].nodes[0], edges[0].nodes[1], edges)
        self.assertEqual(direction, "Main st (Fir st - Arbutus st)")