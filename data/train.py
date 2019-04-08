"""
Copyright 2018 Ronald J. Nowling
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

##Modifications applied by MoviesBuddies Development Team
## originaly implementation available at https://github.com/rnowling/rec-sys-experiments

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

  def main():

  # read ratings
  print "Reading ratings"
  ratings_matrix = read_ratings(args.ratings_fl)

  n_users = ratings_matrix.shape[0]
  n_movies = ratings_matrix.shape[1]
  n_training_users = int(0.8 * n_users)

  # split test / train
  print "Splitting test / train"
  train_ids = random.sample(xrange(n_users),
                          n_training_users)
  test_ids = set(xrange(n_users)) - set(train_ids)
  test_ids = list(test_ids)
  n_test_users = len(test_ids)

  training_matrix = ratings_matrix[train_ids, :]
  testing_matrix = ratings_matrix[test_ids, :]
  true_ratings = testing_matrix.copy()

  # impute unknown ratings
  print "Imputing values"
  imputer = Imputer(missing_values=0)
  training_imputed_matrix = imputer.fit_transform(training_matrix)
  testing_imputed_matrix = imputer.transform(testing_matrix)

  # imputing culls columns with zero values so we need
  # to chop down the original matrices
  selected_columns = []
  for movie_id in xrange(n_movies):
    if not np.isnan(imputer.statistics_[movie_id]):
        selected_columns.append(movie_id)
        
  training_matrix = training_matrix[:, selected_columns]
  testing_matrix = testing_matrix[:, selected_columns]
  true_ratings = true_ratings[:, selected_columns]

  n_remaining_movies = training_matrix.shape[1]

  # perform predictions
  print "Performing kNN search"
  knn = NearestNeighbors()
  knn.fit(training_imputed_matrix)

  # returns n_test_users x k matrix
  neighbor_indices = knn.kneighbors(testing_imputed_matrix,
                                  n_neighbors=args.k,
                                  return_distance=False)


##def trainModel(userRatings):