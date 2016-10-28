import unittest
from unittest.mock import patch
import app as heatmapper_app
import json
from osmparser.graph import Graph, Node, Edge
from views import route_api

class RoutApiTestCase(unittest.TestCase):

    def setUp(self):
        heatmapper_app.app.config['TESTING'] = True
        self.app = heatmapper_app.app.test_client()

    # def tearDown(self):
    #     os.close(self.db_fd)
    #     os.unlink(flaskr.app.config['DATABASE'])

    def generate_simple_graph(self):
        nodes = {"1": Node("1", 49.278868, -123.125652), "2": Node("2", 49.279932, -123.124053), "3": Node("3", 49.279281, -123.123034)};
        edges = [Edge("e1", [nodes["1"], nodes["2"]], 1), Edge("e2", [nodes["2"], nodes["3"]], 1)]
        return Graph(nodes, edges)

    def generate_disconnected_graph(self):
        nodes = {"1": Node("1", 49.278868, -123.125652), "2": Node("2", 49.279932, -123.124053), "3": Node("3", 49.279281, -123.123034), "4": Node("4", 49.579281, -123.523034)};
        edges = [Edge("e1", [nodes["1"], nodes["2"]], 1), Edge("e2", [nodes["3"], nodes["4"]], 1)]

        return Graph(nodes, edges)

    def mock_returns(self, mock_graph_fetcher, sucessfull_path=True):
        if sucessfull_path == True:
            mock_graph_fetcher.fetch_bounded_box_graph.return_value = self.generate_simple_graph()
        else:
            mock_graph_fetcher.fetch_bounded_box_graph.return_value = self.generate_disconnected_graph()

    def test_missing_params(self):
        rv = self.app.post("/a/1/path")
        self.assertEqual(rv.status_code, 400)

    @patch('views.route_api.fetcher', spec=True)
    def test_simple_route(self, mock_graph_fetcher):
        self.mock_returns(mock_graph_fetcher, True)
        #Lat/long values are placeholder, dummy values
        rv = self.app.post("/a/1/path", data=json.dumps({
            'NW': {'lat': -0.489, "lng": 51.686},
            'NE': {"lat": 0.236, "lng": 51.686},
            'SE': {"lat": 0.236, "lng": 51.28},
            'SW': {"lat": -0.489, "lng": 51.28}
        }), content_type='application/json')
        data = json.loads(rv.get_data(as_text=True))["result"]
        self.assertEqual(data["status"], "ok")
        self.assertIsNotNone(data["path"])
        self.assertCountEqual(data["nodes"], [{"lat": 49.278868, "lng": -123.125652}, {"lat": 49.279932, "lng": -123.124053}, {"lat": 49.279281, "lng": -123.123034}])

    @patch('views.route_api.fetcher', spec=True)
    def test_disconnected_route(self, mock_graph_fetcher):
        self.mock_returns(mock_graph_fetcher, False)
        #Lat/long values are placeholder, dummy values
        rv = self.app.post("/a/1/path", data=json.dumps({
            'NW': {'lat': -0.489, "lng": 51.686},
            'NE': {"lat": 0.236, "lng": 51.686},
            'SE': {"lat": 0.236, "lng": 51.28},
            'SW': {"lat": -0.489, "lng": 51.28}
        }), content_type='application/json')
        data = json.loads(rv.get_data(as_text=True))["result"]
        self.assertEqual(data["status"], "fail")
        self.assertIsNone(data["path"])
        print("NODES", data["nodes"])
        self.assertCountEqual(data["nodes"], [{"lat": 49.278868, "lng": -123.125652}, {"lat": 49.279932, "lng": -123.124053}, {"lat": 49.279281, "lng": -123.123034}, {"lat":49.579281, "lng": -123.523034}])

if __name__ == '__main__':
    unittest.main()