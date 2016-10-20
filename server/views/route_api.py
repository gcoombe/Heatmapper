from flask import Blueprint, jsonify, request, Response, abort
from osmparser import fetcher
from chinesepostman import eularian, network

route_api = Blueprint('route_api', __name__)

@route_api.route('/a/1/path', methods=['POST'])
def generate_route():
    if not all(x in request.get_json() for x in ("SW", "SE", "NW", "NE")):
        return abort(400)
    graph = _get_graph_from_request(request)
    return jsonify(_solveGraph(graph))


def _get_graph_from_request(request):
    args = request.get_json()
    coords = [
        _lat_long_pairs_to_dict(args['NW']),
        _lat_long_pairs_to_dict(args['SE']),
        _lat_long_pairs_to_dict(args['SE']),
        _lat_long_pairs_to_dict(args['NW'])
    ]

    left = min([x["lon"] for x in coords])
    bottom = min([x["lat"] for x in coords])
    right = max([x["lon"] for x in coords])
    top = max([x["lat"] for x in coords])

    return fetcher.fetch_bounded_box_graph(left, bottom, right, top)

def _solveGraph(graph):
    edges = None

    original_graph = network.Graph(graph.edge_list())

    print('{} edges'.format(len(original_graph)))
    if not original_graph.is_eularian:
        print('Converting to Eularian path...')
        graph = eularian.make_eularian(original_graph)
        print('Conversion complete')
        print('\tAdded {} edges'.format(len(graph) - len(original_graph)))
        print('\tTotal cost is {}'.format(graph.total_cost))
    else:
        graph = original_graph

    print('Attempting to solve Eularian Circuit...')
    route, attempts = eularian.eularian_path(graph)
    if not route:
        print("Could not complete")
        return None
    else:
        print('\tSolved in {} attempts'.format(attempts, route))
        print('Solution: ({} edges)'.format(len(route) - 1))
        lat_long_route = [];
        for node_id in route:
            lat_long_route.append((graph.nodes[node_id].lat, graph.nodes[node_id].lat))
        return lat_long_route

def _lat_long_pairs_to_dict(pair):
    return {'lat': pair[0], 'lon': pair[1]}