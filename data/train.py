# reads training data and trains knn model

import numpy as np
import matplotlob.pyplot as plt
import pandas as pd 
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
      ratingList.append(int(ratingValue)

  totalMovies = len(movieList)
  totalUsers =  len(userList)
    


