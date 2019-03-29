# reads training data and trains knn model

import numpy as np
import matplotlob.pyplot as plt
import pandas as pd 
import csv


def readTrainingData():
  filename = '../ML/ratings.csv'

  users = []
  movies = []
  ratings = []

  with open(filename) as csvFile:
    readCSV = csv.reader(csvFile, delimiter=',')


