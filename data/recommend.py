## Mary Odenthal, Travis Ryan, Terry James
## Movie recommendations generated from 
## Previously trained model and user rating history

import csv
import os.path
import pickle
from sklearn.neighbors import NearestNeighbors



## Function reads ratings from .csv 
## and returns sparse coordinate matrix
def createMap():

  my_path = os.path.abspath(os.path.dirname(__file__))
  path = os.path.join(my_path, "../ML/links.csv")

  movieToImdb = {}
  ImdbToMovie = {}

  print("Start loading map data")
  with open(path) as csvFile:
    for line in csvFile:

      movieID, imdbID, discardID = line.strip().split(",")

      ## Convert ImdbID for use in URL
      while(len(imdbID) < 8):
        imdbID = "0" + imdbID
      imdbID = "tt" + imdbID

      movieToImdb[movieID] = imdbID
      ImdbToMovie[imdbID] = movieID
  print("Finish loading map data")
  
  return (movieToImdb, ImdbToMovie)



## Returns 5 nearest neighbors of given user data
def getRecommendations(userID, ratingsData):

  ## load knn model
  modelFilename = 'knn_model.sav'
  filehandler = open(modelFilename, 'r') 
  knn = pickle.load(filehandler)

  ##Get neighbors
  data = knn.kneighbors(ratingsData, 5)
  neighbors = data[1][0]

  something = getHighestRated(neighbors)

  return ()

def getHighestRated(neighbors):
  print("Get highestRated")
  usersFilename = 'training_users.sav'
  filehandler = open(usersFilename, 'r') 
  users = pickle.load(filehandler)

  movies = []

  print(neighbors)
  for neigh in neighbors:
    print(neigh) 
    print(users.getrow(neigh))


  