# reads training data and trains knn model

import numpy as np
import matplotlob.pyplot as plt
import pandas as pd 
import csv


def readTrainingData():
  filename = 'C:\Users\moden0\OneDrive - Fruit of the Loom\Documents\School\496\ratings.csv'

  users = []
  movies = []
  ratings = []

  with open(filename) as csvFile:
    readCSV = csv.reader(csvFile, delimiter=',')


