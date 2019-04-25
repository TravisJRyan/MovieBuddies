## Mary Odenthal, Travis Ryan, Terry James
## Movie recommendations generated from 
## Previously trained model and user rating history

import csv
import os.path
import pickle
import json
from sklearn.neighbors import NearestNeighbors


## Returns 5 nearest neighbors of given user data
def getRecommendations(ratingsData, knn, userRatings):
  ##Get neighbors
  data = knn.kneighbors(ratingsData, 5)
  neighbors = data[1][0]

  recommendations = getHighestRated(neighbors, userRatings)

  return (recommendations)

def getHighestRated(neighbors, userRatings):

  movie10 = []
  movie9 = []
  movie8 = []

  for neigh in neighbors:
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

def prepareOnlineData(jsonRatings):
  ratings = json.loads(jsonRatings)

  map2Filename = 'ImdbToMovie.sav'
  filehandler = open(map2Filename, 'r') 
  ImdbToMovie = pickle.load(filehandler)

  movieIDs = []
  ratingValues = []

  for movie in ratings:
    movieID = ratings[0]["movieID"]
    print(movieID)
    movieID = ImdbToMovie[movieID]
    print(movieID)
    #movieIDs.append(int(ratings[0]["rating"]
  


  
