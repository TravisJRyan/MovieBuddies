# Dependencies
from flask import Flask, request, jsonify, current_app
from sklearn.neighbors import NearestNeighbors
import traceback
import train 
import pickle
import test
import recommend

app = Flask(__name__)
with app.app_context():

  @app.route('/predict', methods=['POST'])
  def predict():

    recommend.prepareOnlineData(request.get_json(force=True))


    #recommendations = request.json
    return(request.get_json(force=True))



  def main():
    # load KNN Model
    modelFilename = 'knn_model.sav'
    filehandler = open(modelFilename, 'r') 
    knn = pickle.load(filehandler)

    ## load training users
    usersFilename = 'training_users.sav'
    filehandler = open(usersFilename, 'r') 
    userRatings = pickle.load(filehandler)
    
    ## load maps
    map1Filename = 'movieToImdb.sav'
    filehandler = open(map1Filename, 'r') 
    movieToImdb = pickle.load(filehandler)


    
    app.run(port=3001, debug=True)


  main()