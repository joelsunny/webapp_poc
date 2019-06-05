from flask import Flask, request
from flask_restful import Resource, Api
import ansible_play
import json

app = Flask(__name__)
api = Api(app)

class AnsibleWrapper(Resource):
    def run(self, payload):
        print(payload)
        payload_json = {str(k) : str(payload[k]) for k in payload }
        ansible_play.run_playbook(payload_json['cmd'])


    def post(self):
        payload = request.json
        self.run(payload)

api.add_resource(AnsibleWrapper, '/')

if __name__ == '__main__':
    app.run()