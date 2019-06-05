from flask import Flask, request
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

class AnsibleWrapper(Resource):
    def run(self, payload):
        print(payload)

    def post(self):
        payload = request.json
        self.run(payload)

api.add_resource(AnsibleWrapper, '/')

if __name__ == '__main__':
    app.run()