from flask import Blueprint, jsonify, request, Response, abort
from osmparser import fetcher
from chinesepostman import eularian, network

route_api = Blueprint('route_api', __name__)

@route_api.route('/a/1/path', methods=['POST'])
def generate_route():
    if not all(x in request.get_json() for x in ("SW", "SE", "NW", "NE")):
        return abort(400)
    graph = _get_graph_from_request(request)
    return jsonify(result=_solveGraph(graph))


def _get_graph_from_request(request):
    coords = request.get_json().values()

    left = min([x["lon"] for x in coords])
    bottom = min([x["lat"] for x in coords])
    right = max([x["lon"] for x in coords])
    top = max([x["lat"] for x in coords])

    return fetcher.fetch_bounded_box_graph(left, bottom, right, top)

def _solveGraph(graph):
    edges = None

    print("original")
    print(graph.edge_list())
    eularian_graph = None;
    original_graph = network.Graph(graph.edge_list())
    print(original_graph)

    print('{} edges'.format(len(original_graph)))
    if not original_graph.is_eularian:
        print('Converting to Eularian path...')
        eularian_graph = eularian.make_eularian(original_graph)
        print('Conversion complete')
        print('Eularian len {}'.format(len(eularian_graph)))
        print('\tAdded {} edges'.format(len(eularian_graph) - len(original_graph)))
        print('\tTotal cost is {}'.format(eularian_graph.total_cost))
    else:
        eularian_graph = original_graph

    print('Attempting to solve Eularian Circuit...')
    print(eularian_graph)
    route, attempts = eularian.eularian_path(eularian_graph)
    if not route:
        print("Could not complete")
        return None
    else:
        print('\tSolved in {} attempts'.format(attempts, route))
        print('Solution: ({} edges)'.format(len(route) - 1))
        lat_long_route = [];
        for node_id in route:
            lat_long_route.append({'lat': graph.nodes[node_id].lat, 'lon': graph.nodes[node_id].lon})
        return lat_long_route