# Dependencies
from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import traceback
import train 
import pickle
import test
import recommend

app = Flask(__name__)


@app.route('/predict', methods=['POST'])
def predict():
  print("here!")
  print(request.get_json(force=True))
  print("where")

  #recommendations = request.json
  return(request.get_json(force=True))



def main():
  
  app.run(port=3001, debug=True)


main()