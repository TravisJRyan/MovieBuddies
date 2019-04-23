import recommend
import pickle
import scipy.sparse as sp



def main():

      print("Start  ML data")
      filename = 'test_users.sav'
      filehandler = open(filename, 'r') 
      test_users = pickle.load(filehandler)
      print("Completed")
      success = 0
      failure = 0
      total = 0

      test = test_users.nonzero()[0]
      users = []
      for i in range(0,1000):
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


            for movie in movies:
                  if(count % 2):
                        testMovies.append(movie)
                        testRatings.append(test_users.getrow(user)[0,movie])

                  else:
                        validateMovies.append(movie)
                        validateRatings.append(test_users.getrow(user)[0,movie])
                  count = count +1

            testMovies.append(193882)
            validateMovies.append(193882)
            testRatings.append(0)
            validateRatings.append(0)


            testMatrix = sp.coo_matrix((testRatings, ([0]*len(testMovies), testMovies)))
            validateMatrix = sp.coo_matrix((validateRatings, ([0]*len(validateMovies), validateMovies)))
   
            ##Create ratings list

            recommendations = recommend.getRecommendations(testMatrix)
            currentSuccess = 0
            for movie in recommendations:
                  if(validateMatrix.getrow(0)[0,movie] >= 7):
                        currentSuccess = currentSuccess + 1
            if currentSuccess > 0:
                  success = success + 1
            else:
                  failure = failure + 1
            
            total = total + 1


      print(success)
      print(total)
      print(float(success)/float(total))
            



main()