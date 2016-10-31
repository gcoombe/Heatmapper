DIRECTION_TEMPLATE = "{} ({} - {})"

def generate_directions(route, edges):
    lat_lon_pairs = [(route[i], route[i + 1]) for i in range(0, len(route) - 1)]
    return list(map(lambda lat_lon_pair: generate_direction(_find_edge(lat_lon_pair, edges), lat_lon_pair[0], lat_lon_pair[1], edges), lat_lon_pairs))

def _find_edge(lat_lon_pair, edges):
    return next((edge for edge in edges if edge.contains_segment(lat_lon_pair[0], lat_lon_pair[1])), None)

def generate_direction(edge, start_lat_lon, end_lat_lon, all_edges):
    other_edge_start = list(filter(lambda other_edge: other_edge.id != edge.id and other_edge.contains_lat_long(start_lat_lon["lat"], start_lat_lon["lon"]), all_edges))
    other_edge_end = list(filter(lambda other_edge: other_edge.id != edge.id and other_edge.contains_lat_long(end_lat_lon["lat"], end_lat_lon["lon"]), all_edges))

    street_name = edge.tags["name"]
    start_cross_street = "?"
    end_cross_street = "?"
    if len(other_edge_start) > 0:
        start_cross_street = other_edge_start[0].tags["name"]
    if len(other_edge_end) > 0:
        end_cross_street = other_edge_end[0].tags["name"]

    return DIRECTION_TEMPLATE.format(street_name, start_cross_street, end_cross_street)