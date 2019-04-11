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

def readTrainingData():

  my_path = os.path.abspath(os.path.dirname(__file__))
  path = os.path.join(my_path, "../ML/test.csv")

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

  totalMovies = max(movieList) + 1
  totalUsers =  max(userList) + 1

  movieRatingsByUsers = np.zeros((totalUsers, totalMovies))

  for userName, movieID, ratingValue in zip(userList, movieList, ratingList):
    movieRatingsByUsers[userName, movieID] = ratingValue

  print("completed loading data")
  return movieRatingsByUsers

def main():
  ## read ratings
  ratings_matrix = readTrainingData()

  n_users = ratings_matrix.shape[0]
  n_movies = ratings_matrix.shape[1]
  n_training_users = int(0.8 * n_users)

  ## split test / train
  train_ids = random.sample(range(n_users),
                          n_training_users)
  test_ids = set(range(n_users)) - set(train_ids)
  test_ids = list(test_ids)
  n_test_users = len(test_ids)

  training_matrix = []
  testing_matrix = []

  for user_id in train_ids:
    training_matrix.append(ratings_matrix[user_id, :])

  for user_id in test_ids:
    testing_matrix.append(ratings_matrix[user_id, :])


  ## impute unknown ratings
  imputer = Imputer(missing_values=0)
  training_imputed_matrix = imputer.fit_transform(training_matrix)
  testing_imputed_matrix = imputer.transform(testing_matrix)

  ## imputing culls columns with zero values so we need
  ## to chop down the original matrices
  selected_columns = []
  for movie_id in range(n_movies):
    if not np.isnan(imputer.statistics_[movie_id]):
        selected_columns.append(movie_id)

  for column in selected_columns      
  training_matrix = training_matrix[:, selected_columns]
  testing_matrix = testing_matrix[:, selected_columns]

  n_remaining_movies = training_matrix.shape[1]

  # perform predictions
  knn = NearestNeighbors()
  knn.fit(training_imputed_matrix)

  ## Pickle model to use online later
  filename = 'knn_model.sav'
  pickle.dump(knn, open(filename, 'wb'))




main()