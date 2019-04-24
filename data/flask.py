# Dependencies
from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import traceback
import train 

# Your API definition
app = Flask(__name__)




@app.route('/predict', methods=['POST'])
def predict():
  json_ = request.json
  print(json_)



def main():
  train.trainModel()

  ## load knn model
  modelFilename = 'knn_model.sav'
  filehandler = open(modelFilename, 'r') 
  knn = pickle.load(filehandler)
    
  app.run(port=3001, debug=True)


main()