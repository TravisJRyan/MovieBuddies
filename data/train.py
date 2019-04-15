##  Copyright 2018 Ronald J. Nowling
##  Licensed under the Apache License, Version 2.0 (the "License");
##  you may not use this file except in compliance with the License.
##  You may obtain a copy of the License at
##      http://www.apache.org/licenses/LICENSE-2.0
##  Unless required by applicable law or agreed to in writing, software
##  distributed under the License is distributed on an "AS IS" BASIS,
##  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
##  See the License for the specific language governing permissions and
##  limitations under the License.

## Modifications applied by MoviesBuddies Development Team
## original implementation available at https://github.com/rnowling/rec-sys-experiments

import numpy as np
import random
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import Imputer
import csv
import scipy.sparse as sp
import os.path
import pickle
from sklearn.model_selection import train_test_split


## Function reads ratings from .csv 
## and returns sparse coordinate matrix
def readTrainingData():

  my_path = os.path.abspath(os.path.dirname(__file__))
  path = os.path.join(my_path, "../ML/newRatings2.csv")

  userList = []
  movieList = []
  ratingList = []

  print("begin loading data")
  with open(path) as csvFile:
    for line in csvFile:
      userName, movieID, ratingValue = line.strip().split(",")
      userList.append(int(userName))
      movieList.append(int(movieID))
      ratingList.append(int(ratingValue))

  movieRatingsByUsers = sp.coo_matrix((ratingList, (userList, movieList)))

  return movieRatingsByUsers

def main():
  ## read ratings
  ratingsMatrix = readTrainingData()

  train, test = train_test_split(ratingsMatrix, test_size=0.1)

  knn = NearestNeighbors()
  knn.fit(train)

  ## Pickle model to use online later
  filename = 'knn_model.sav'
  pickle.dump(knn, open(filename, 'wb'))


main()