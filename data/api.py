# Dependencies
from flask import Flask, request, jsonify, current_app
from sklearn.neighbors import NearestNeighbors
import traceback
import pickle
import recommend
import json
## load knn model
modelFilename = 'knn_model.sav'
filehandler = open(modelFilename, 'r') 
knn_g = pickle.load(filehandler)

## load training users
trainFilename = 'training_users.sav'
filehandler = open(trainFilename, 'r') 
trainRatings_g = pickle.load(filehandler)

## load Map
map1Filename = 'movieToImdb.sav'
filehandler = open(map1Filename, 'r') 
movieToImdb_g = pickle.load(filehandler)

map2Filename = 'ImdbToMovie.sav'
filehandler = open(map2Filename, 'r') 
ImdbToMovie_g = pickle.load(filehandler)


app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
  print(request.get_json(force=True))
  userData = recommend.prepareOnlineData(request.get_json(force=True), ImdbToMovie_g)
  recommendationsGL = recommend.getRecommendations(userData, knn_g, trainRatings_g)

  recommendationsIMDB = []
  for rec in recommendationsGL:
    recommendationsIMDB.append(movieToImdb_g[str(rec)])

  print(recommendationsIMDB)
  return(json.dumps(recommendationsIMDB))



def main():
  app.run(port=3001, debug=True)


main()
