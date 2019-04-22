## Mary Odenthal, Travis Ryan, Terry James
## Movie recommendations generated from 
## Previously trained model and user rating history

import csv
import os.path
import pickle
from sklearn.neighbors import NearestNeighbors


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

  return (something)

def getHighestRated(neighbors):
  print("Get highestRated")
  usersFilename = 'training_users.sav'
  filehandler = open(usersFilename, 'r') 
  userRatings = pickle.load(filehandler)

  movie10 = []
  movie9 = []
  movie8 = []

  for neigh in neighbors:
    print(neigh)
    print(userRatings.getrow(neigh))
    for movie in userRatings.getrow(neigh).nonzero()[1]:
      if userRatings[neigh, movie] > 9:
        movie10.append(movie)
      elif userRatings[neigh, movie] > 8:
        movie9.append(movie)
      elif userRatings[neigh, movie] > 7:
        movie8.append(movie)
  
  movies = []

  for movie in movie10:
    movies.append(movie)
  for movie in movie9:
    movies.append(movie)
  for movie in movie8:
    movies.append(movie)

  return(movies)
  
