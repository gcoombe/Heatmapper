import json
from osmparser.graph import Node

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Node):
            return obj.__dict__
        return json.JSONEncoder.default(self, obj)