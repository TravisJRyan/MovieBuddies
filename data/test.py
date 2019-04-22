import recommend
import pickle


def main():
    
    print("Start loading test users")
    filename = 'test_users.sav'
    filehandler = open(filename, 'r') 
    test_users = pickle.load(filehandler)
    print("Completed")

    neighbors = recommend.getRecommendations(0, test_users.getrow(1))
    print(neighbors)


main()