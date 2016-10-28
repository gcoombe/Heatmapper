DIRECTION_TEMPLATE = "{} ({} - {})"

def generate_direction(edge, start_node, end_node, all_edges):
    other_edge_start = list(filter(lambda other_edge: other_edge.id != edge.id and other_edge.contains_lat_long(start_node.lat, start_node.lon), all_edges))
    other_edge_end = list(filter(lambda other_edge: other_edge.id != edge.id and other_edge.contains_lat_long(end_node.lat, end_node.lon), all_edges))

    street_name = edge.tags["name"]
    start_cross_street = "?"
    end_cross_street = "?"
    if len(other_edge_start) > 0:
        start_cross_street = other_edge_start[0].tags["name"]
    if len(other_edge_end) > 0:
        end_cross_street = other_edge_end[0].tags["name"]

    return DIRECTION_TEMPLATE.format(street_name, start_cross_street, end_cross_street)