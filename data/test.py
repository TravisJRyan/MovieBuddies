import pickle 


def main():
    filename = 'knn_model.sav'
    filehandler = open(filename, 'r') 
    object = pickle.load(filehandler)

    print(object)



main()