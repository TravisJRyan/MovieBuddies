# Dependencies
from flask import Flask, request, jsonify, current_app
from sklearn.neighbors import NearestNeighbors
import traceback
import train 
import pickle
import test
import recommend

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
  print("Start  ML data")

  ## load knn model
  modelFilename = 'knn_model.sav'
  filehandler = open(modelFilename, 'r') 
  knn = pickle.load(filehandler)

  ## load training users
  usersFilename = 'training_users.sav'
  filehandler = open(usersFilename, 'r') 
  trainRatings = pickle.load(filehandler)
  print("Completed")

  userData = recommend.prepareOnlineData(request.get_json(force=True))

  print(userData)
  recommendations = recommend.getRecommendations(userData, knn, trainRatings)
  print(recommendations)
  return("hellow")



def main():
  train.trainModel()
  app.run(port=3001, debug=True)


main()