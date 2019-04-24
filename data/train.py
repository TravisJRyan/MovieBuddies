## Movie Buddies Development Team:
## Travis Ryan, Terry James, Mary Odenthal
## Script to train knn model on Movielens user data
## 27M ratings train/test split and saved states of objects


import numpy as np
import random
from sklearn.neighbors import NearestNeighbors
import csv
import scipy.sparse as sp
import os.path
import pickle
from sklearn.model_selection import train_test_split


## Function reads ratings from .csv 
## and returns sparse coordinate matrix
def readData():

  my_path = os.path.abspath(os.path.dirname(__file__))
  path = os.path.join(my_path, "../ML/newRatings2.csv")

  userList = []
  movieList = []
  ratingList = []


  print("Start loading user rating data")
  with open(path) as csvFile:
    currentUser = []
    currentMovie = []
    currentRating = []
    previousUser = 1
    ratingCount = 0

    for line in csvFile:
      userName, movieID, ratingValue = line.strip().split(",")
      if previousUser == int(userName):
        ratingCount = ratingCount + 1
        currentUser.append(int(userName))
        currentMovie.append(int(movieID))
        currentRating.append(int(ratingValue))


      if previousUser < int(userName):
        if ratingCount >= 15:
          userList.extend(currentUser)
          movieList.extend(currentMovie)
          ratingList.extend(currentRating)

        #Reset current user & previous user
        currentUser = []
        currentMovie = []
        currentRating = []
        previousUser = int(userName)
        ratingCount = 0



  movieRatingsByUsers = sp.coo_matrix((ratingList, (userList, movieList)))
  print("Completed loading user rating data")

  return movieRatingsByUsers

## Creates map of movie lens ID to IMDB ID
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

def main():

  ## read ratings
  ratingsMatrix = readData()

  print("Start test/train split")
  train, test = train_test_split(ratingsMatrix, test_size=0.2)
  print("Completed")


  print("Start training model")
  knn = NearestNeighbors()
  knn.fit(train)
  print("Completed")
  

  print("Start saving model")
  ## Pickle model to use online later
  modelFilename = 'knn_model.sav'
  pickle.dump(knn, open(modelFilename, 'wb'))
  print("Completed")


  print("Start saving training data")
  ## Pickle test set for testing later
  trainFilename = 'training_users.sav'
  pickle.dump(train, open(trainFilename, 'wb'))
  print("Completed")
  

  print("Start saving test data")
  ## Pickle test set for testing later
  testFilename = 'test_users.sav'
  pickle.dump(test, open(testFilename, 'wb'))
  print("Completed")

  maps = createMap()

  

main()