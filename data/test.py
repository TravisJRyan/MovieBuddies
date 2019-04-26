import recommend
import pickle
import scipy.sparse as sp



def testScript():

      print("Start  ML data")
      filename = 'test_users.sav'
      filehandler = open(filename, 'r') 
      test_users = pickle.load(filehandler)

        ## load knn model
      modelFilename = 'knn_model.sav'
      filehandler = open(modelFilename, 'r') 
      knn = pickle.load(filehandler)

      ## load training users
      usersFilename = 'training_users.sav'
      filehandler = open(usersFilename, 'r') 
      userRatings = pickle.load(filehandler)
      print("Completed")
      success = 0
      failure = 0
      total = 0

      test = test_users.nonzero()[0]
      users = []

      #grab set of unique users in range
      for i in range(0,10000):
            if i > 0:
                  if test[i - 1] != test[i]:
                        users.append(test[i-1])

      for user in users: 
            ## Split movie ratings in half per user
            movies = test_users.getrow(user).nonzero()[1]
            count = 0
            validateMovies = []
            testMovies = []
            testRatings = []
            validateRatings = []

            #if even, put in test set, otherwise validation set
            for movie in movies:
                  if(count % 2):
                        testMovies.append(movie)
                        testRatings.append(test_users.getrow(user)[0,movie])

                  else:
                        validateMovies.append(movie)
                        validateRatings.append(test_users.getrow(user)[0,movie])
                  count = count +1

            #append 0 value at 193882 for correct matrix shape
            testMovies.append(193886)
            validateMovies.append(193886)
            testRatings.append(0)
            validateRatings.append(0)

            #create matrices
            testMatrix = sp.coo_matrix((testRatings, ([0]*len(testMovies), testMovies)))
            validateMatrix = sp.coo_matrix((validateRatings, ([0]*len(validateMovies), validateMovies)))
   
            ##Get Recommendations and record success/failure
            recommendations = recommend.getRecommendations(testMatrix, knn, userRatings)
            currentSuccess = 0
            for movie in recommendations:
                  if(validateMatrix.getrow(0)[0,movie] >= 7):
                        currentSuccess = currentSuccess + 1
            if currentSuccess > 0:
                  success = success + 1
            else:
                  failure = failure + 1
            
            total = total + 1

      print("Successes")
      print(success)
      print("Total Users")
      print(total)
      print("Percentage Successful")
      print(float(success)/float(total)*100)

testScript()
            