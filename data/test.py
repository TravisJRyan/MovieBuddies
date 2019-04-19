import recommend
import pickle


def main():
    maps = recommend.createMap()

    movieToImdb = maps[0]
    imdbToMovie = maps[1]

    print("Start loading test users")
    filename = 'test_users.sav'
    filehandler = open(filename, 'r') 
    test_users = pickle.load(filehandler)
    print("Completed")

    neighbors = recommend.getRecommendations(0, test_users.getrow(1))


main()