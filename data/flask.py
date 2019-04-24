# Dependencies
from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import traceback
import pandas as pd
import numpy as np

# Your API definition
app = Flask(__name__)

## load knn model
modelFilename = 'knn_model.sav'
filehandler = open(modelFilename, 'r') 
knn = pickle.load(filehandler)


@app.route('/predict', methods=['POST'])
def predict():
  json_ = request.json
  print(json_)



if __name__ == '__main__':
    try:
        port = int(sys.argv[1]) 
    except:
        port = 12345 