## Mary Odenthal, Travis Ryan, Terry James
## Movie recommendations generated from 
## Previously trained model and user rating history

import csv
import os.path
import pickle
import json
import scipy.sparse as sp
from sklearn.neighbors import NearestNeighbors


## Returns 5 nearest neighbors of given user data
def getRecommendations(ratingsData, knn, userRatings):
  ##Get neighbors
  data = knn.kneighbors(ratingsData, 20)
  neighbors = data[1][0]

  recommendations = getHighestRated(neighbors, userRatings)

  return (recommendations)

def getHighestRated(neighbors, userRatings):

  movie10 = []
  movie9 = []
  movie8 = []



  for neigh in neighbors:
    for movie in userRatings.getrow(int(neigh)).nonzero()[1]:
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

  uniqueMovies = []
  for movie in movies:
    if movie not in uniqueMovies:
      uniqueMovies.append(movie)


  return(uniqueMovies)

def prepareOnlineData(jsonRatings, ImdbToMovie):
  ratings = json.loads(jsonRatings)

  movieIDs = []
  ratingValues = []
  for i in range(0, len(ratings)):
    
    movieID = ratings[i]["movieID"]
    print(movieID)
    try: 
      movieID = ImdbToMovie[str(movieID)]
      movieIDs.append(int(movieID))
      ratingValues.append(int(ratings[i]["rating"]))
    except KeyError:
      print("error")


  movieIDs.append(193882)
  userID = [0] * len(movieIDs)
  ratingValues.append(0)

  print(len(movieIDs))
  print(len(userID))
  print(len(ratingValues))

  movieRatings = sp.coo_matrix((ratingValues, (userID, movieIDs)))

  return(movieRatings)
  


  
