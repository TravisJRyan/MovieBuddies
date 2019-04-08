# reads training data and trains knn model

import numpy
import matplotlob.pyplot as matpyplot
import pandas
import csv


def readTrainingData():
  filename = '../ML/ratings.csv'

  userList = []
  movieList = []
  ratingList = []

  with open(filename) as csvFile:
    for line in csvFile:
      userName, movieID, ratingValue = line.strip().split(",")
      userList.append(userName)
      movieList.append(movieID)
      ratingList.append(int(ratingValue))

  totalMovies = max(movieList)
  totalUsers =  max(userList)

  movieRatingsByUsers = numpy.zeros((totalMovies, totalUsers))

  for userName, movieID, ratingValue in zip(userList, movieList, ratingList):
    movieRatingsByUsers[userName, movieID] = ratingValue

  return movieRatingsByUsers


##def trainModel(userRatings):