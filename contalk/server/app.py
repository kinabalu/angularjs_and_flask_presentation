from flask import Flask, jsonify, request
from flask.ext.restful import Api, Resource, fields, marshal, abort
from flask.ext.restful.utils import cors
import json, uuid

app = Flask(__name__)
api = Api(app)

"""
Sample for testing
 {
      "date": "2014-11-18", 
      "description": "An awesome talk about the JavaScript framework AngularJS and using it with Flask to build a RESTful service", 
      "name": "End to end with JavaScript", 
      "speaker": "Andrew Lombardi", 
      "technology": [
        "JavaScript"
      ], 
      "time": {
        "begin_time": "14:25", 
        "end_time": "15:10"
      }
    }
"""


talks = [
    {
      "id": 1,
      "name": "AngularJS and Flask sitting in a tree",
      "speaker": "Andrew Lombardi",
      "technology": ["JavaScript", "Python"],
      "description": "An awesome talk about the JavaScript framework AngularJS and using it with Flask to build a RESTful service",
      "time": {
        "begin_time": "14:25",
        "end_time": "15:10"
      },
      "date": "2014-11-18"
    },
    {
      "id": 2,
      "name": "Simple API's with bottle.py",
      "speaker": "Andrew Lombardi",
      "technology": ["Python"],
      "description": "An awesome talk",
      "time": {
        "begin_time": "14:25",
        "end_time": "15:10"
      },
      "date": "2014-11-19"
    }
]

class TalksEntryAPI(Resource):
    """
    POST is a create so doesn't make sense here
    PATCH also doesn't make sense unless we write code to check each key and only update those
    both will subsequently return 405 Method Not Allowed
    """
    def _get_talk(self, id):
        for talk in talks:
            if str(talk['id']) == str(id):
                return talk
        return None

    def _get_talk_index(self, id):
        for idx, talk in enumerate(talks):
            if str(talk['id']) == str(id):
                return idx
        return -1

    def get(self, id):
        referenced_talk = self._get_talk(id)
        if not referenced_talk:
            abort(404)
            return
        else:
            return jsonify(referenced_talk)


    def put(self, id):
        referenced_talk_idx = self._get_talk_index(id)
        if referenced_talk_idx == -1:
            abort(404)
            return

        json_data = json.loads(request.data)
        json_data['id'] = id                # just to ensure we have the right stuff
        talks[referenced_talk_idx] = json_data
        return jsonify(json_data)


    def delete(self, id):
        referenced_talk_idx = self._get_talk_index(id)
        if referenced_talk_idx == -1:
            abort(404)
            return
        else:
            del talks[referenced_talk_idx]
            return


class TalksAPI(Resource):
    """
    PUT, PATCH, and DELETE will return 405 Method Not Allowed
    """

    def get(self):
        print('GET called')
        return jsonify({'talks': talks})

    def post(self):
        json_data = json.loads(request.data)
        new_id = uuid.uuid4()
        json_data['id'] = new_id
        talks.append(json_data)
        return jsonify({"id": json_data['id']})

    def options(self):
        """
        Only referenced here to account for a possible pre-flight being asked
        for by browsers
        """
        return ""


api.decorators = [cors.crossdomain(origin='*', headers=['accept', 'Content-Type', 'X-Requested-With'])]
api.add_resource(TalksAPI, '/api/talks', endpoint='talks')
api.add_resource(TalksEntryAPI, '/api/talks/<id>', endpoint='talks_entry')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
