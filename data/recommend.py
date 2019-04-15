## Mary Odenthal, Travis Ryan, Terry James
## Movie recommendations generated from 
## Previously trained model and user rating history

import csv


## Function reads ratings from .csv 
## and returns sparse coordinate matrix
def readTrainingData():

  my_path = os.path.abspath(os.path.dirname(__file__))
  path = os.path.join(my_path, "../ML/links.csv")

  movieToImdb = []
  ImdbToMovie = {}

  print("begin loading data")
  with open(path) as csvFile:
    for line in csvFile:

      movieID, imdbID, discardID = line.strip().split(",")

      ## Convert ImdbID for use in URL
      while(len(imdbID) < 8):
        imdbID = "0" + imdbID
      imdbID = "tt" + imdbID

      movieToImdb[int(movieID)] = imdbID
      ImdbToMovie[imdbID] = movieID

  return (movieToImdb, ImdbToMovie)



def main():
  print("Hello")

main()