import unittest
import mock
import app as heatmapper_app
from osmparser import Graph

class RoutApiTestCase(unittest.TestCase):

    def setUp(self):
        heatmapper_app.app.config['TESTING'] = True
        self.app = heatmapper_app.app.test_client()

    # def tearDown(self):
    #     os.close(self.db_fd)
    #     os.unlink(flaskr.app.config['DATABASE'])

    def test_missing_params(self):
        rv = self.app.post("/a/1/path")
        self.assertEqual(rv.status_code, 400)

    @mock.patch('app.OSMParser.solver')
    @mock.patch('app.')
    def test_simple_route():
        mock_patch.solve_for_bounded_box.return_value = list((1, 2, 1), (2, 3, 3))
        rv = rv = self.app.post("/a/1/path", data=dict(
            NW=-0.489, 51.686
            NE=0.236, 51.686,
            SE=0.236, 51.28,
            SW=-0.489, 51.28
        ))

if __name__ == '__main__':
    unittest.main()