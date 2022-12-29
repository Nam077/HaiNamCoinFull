import nltk
nltk.download('punkt')
import random
from services.ChatBotModelTFlearn import loadModel, loadData
from nltk.stem.lancaster import LancasterStemmer
import numpy as np
import json
stemmer = LancasterStemmer()
data = loadData()
model = loadModel()
words = data['words']
classes = data['classes']
train_x = data['train_x']
train_y = data['train_y']
with open('Data/intents.json', encoding='utf8') as json_data:
    intents = json.load(json_data)


def clean_up_sentence(sentence):
    # It Tokenize or Break it into the constituents parts of Sentense.
    sentence_words = nltk.word_tokenize(sentence)
    # Stemming means to find the root of the word.
    sentence_words = [stemmer.stem(word.lower()) for word in sentence_words]
    return sentence_words

# Return the Array of Bag of Words: True or False and 0 or 1 for each word of bag that exists in the Sentence


def bow(sentence, words, show_details=False):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print("found in bag: %s" % w)
    return(np.array(bag))


ERROR_THRESHOLD = 0.25
print("ERROR_THRESHOLD = 0.25")


def classify(sentence):
    # Prediction or To Get the Posibility or Probability from the Model
    results = model.predict([bow(sentence, words)])[0]
    # Exclude those results which are Below Threshold
    results = [[i, r] for i, r in enumerate(results) if r > ERROR_THRESHOLD]
    # Sorting is Done because heigher Confidence Answer comes first.
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        # Tuppl -> Intent and Probability
        return_list.append((classes[r[0]], r[1]))
    return return_list


def response(sentence):
    results = classify(sentence)
    # That Means if Classification is Done then Find the Matching Tag.
    if results:
        # Long Loop to get the Result.
        while results:
            for i in intents['intents']:
                # Tag Finding
                if results[0][1] > 0.9:
                    if i['tag'] == results[0][0]:
                        # Random Response from High Order Probabilities
                        return random.choice(i['responses'])
            results.pop(0)
