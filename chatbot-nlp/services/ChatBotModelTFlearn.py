from re import I
import pickle
import tflearn
def loadModel():
    data = loadData()
    train_x = data['train_x']
    train_y = data['train_y']
    net = tflearn.input_data(shape=[None, len(train_x[0])])
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, len(train_y[0]), activation='softmax')
    net = tflearn.regression(net)
    model = tflearn.DNN(net, tensorboard_dir='tflearn_logs')
    print("Loading the Model......")
    # load our saved model
    model.load('Model/model.tflearn')
    return model
def loadData():
    return pickle.load(open("pickle/training_data", "rb"))
