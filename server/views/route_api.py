from flask import Blueprint, jsonify, request, Response, abort
from osmparser import fetcher
from directions import generator
from chinesepostman import eularian, network

route_api = Blueprint('route_api', __name__)

@route_api.route('/a/1/path', methods=['POST'])
def generate_route():
    json = request.get_json()
    if not all(json is not None and x in request.get_json() for x in ("SW", "SE", "NW", "NE")):
        return abort(400)
    graph = _get_graph_from_request(request)
    return jsonify(result=_generate_result(graph, _solve_graph(graph)))

def _generate_result(graph, path=None):
    status =  None
    directions = None
    if path is None:
        status = "fail"
    else:
        status = "ok"
        directions = generator.generate_directions(path, graph.edges)

    result_nodes = list(map(lambda node: {'lat': node.lat, 'lng': node.lon}, graph.head_tail_nodes()))

    return {'status': status, 'path': path, 'nodes': result_nodes, 'directions': directions}

def _get_graph_from_request(request):
    coords = request.get_json().values()

    left = min([x["lng"] for x in coords])
    bottom = min([x["lat"] for x in coords])
    right = max([x["lng"] for x in coords])
    top = max([x["lat"] for x in coords])

    return fetcher.fetch_bounded_box_graph(left, bottom, right, top)

def _solve_graph(graph):
    edges = None

    eularian_graph = None;
    original_graph = network.Graph(graph.edge_list())

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
        print('Solution: ({} edges)'.format(route))
        lat_long_route = [];
        for node_id in route:
            lat_long_route.append({'lat': graph.nodes[node_id].lat, 'lng': graph.nodes[node_id].lon})
        return lat_long_route
