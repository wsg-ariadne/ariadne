import pickle5 as pickle
import random
import nltk
import string

data_bad = [
    ["We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking 'Accpet' you consent to the use of ALL the cookies", 'bad'],
    ["Art UK has updated its cookies policy. By using this website you are agreeing to the use of cookies. To find out more read our updated Use of Cookies policy and our updated Privacy policy", 'bad'],
    ["We use cookies for performance, analytics, and advertising purposes. By continuing to use this website, you agree to allow cookies to be placed. Learn more.", 'bad'],
    ["We use cookies on our websites for a number of purposes, including analytics and performance, functionality and advertising. Learn more about our use of cookies.", 'bad'],
    ["But first, cookies. We use cookies to improve your experience and deliver personalized content. By using InVision, you agree to our Cookie Policy.", 'bad'],
    ["Cookies. Cookies are used to access and store information on your device, to offer personalized content and ads based on your data. By choosing 'I agree' you consent to Deezer and its partners' use of cookies. You can refuse or withdraw consent by choosing 'Manage settings'", 'bad'],
    ["Back Market uses functional cookies required for browsing this site. We and our partners also use cookies that allow us to measure traffic and show you personalized content and ads rather than basic shiz. Think sea salt chocolate chunk vs. oatmeal raisin. You can change your preferences later by clicking 'Cookies' at the bottom of any page. Tell me more about those Cookies", 'bad'],
    ["This website uses cookies to improve your experience. We'll assume you're ok with this, but you can opt-out if you wish. Read More", 'bad'],
]

data_good = [
    ["We use necessary cookies to make our site work. We’d like to set additional cookies to understand site usage, make site improvements and to remember your settings. We also use cookies set by other sites to help deliver content from their services. View our Cookie Notice", 'good'],
    ["We value your privacy. We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking 'Accept All', you consent to our use of cookies.", 'good'],
    ["Cookie consent. This website uses cookies to improve your experience. We will assume you are ok with this, but you can opt-out if you wish. View our privacy policy", 'good'],
    ["Cookie consent. This website uses cookies that help the website to function and also track how you interact with our website. But for us to provide the best user experience, enable the specific cookies from Settings, and click on Accept", 'good'],
    ["We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking 'Accept All', you consent to the use of ALL the cookies. However, you may visit 'Cookie Settings' to provide a controlled consent.", 'good'],
    ["By clicking 'Allow All', you agree to the storing of cookies on your device to enhance site navigation and to analyse site usage. Read more here.", 'good'],
    ["The choice is yours. We use cookies to give you the best possible experience when using our website. BY clicking 'Accept All', we can bring you relevant advertising and personalized content -- and generally give you a much more enhanced visit. If you'd rather take the time to set which cookies we can use, click 'Manage Settings'. Your choices can always be changed at a later date here.", 'good'],
    ["Hi! We use cookies and similar technologies ('cookies'), including third-party cookies, on this website to help oeprate and improve your experience on our site, monitor our site performance, and for advertising purposes. For more information on how we use cookies and your cookie choices, go here for our cookie policy! By clicking 'Accept Cookies' below,  you are giving us consent to use cookies (except consent is not required for cookies necessary to run our site). You can change your cookie settings, and withdraw your consent at any time, by clicking on 'Cookie Settings' below.", 'good']
]

data = data_bad + data_good

word_string = ''
documents = []

for point in data:
    curr_tuple = (point[0].translate(str.maketrans('', '', string.punctuation)).split(), point[1])
    documents.append(curr_tuple)
    word_string = word_string + point[0].translate(str.maketrans('', '', string.punctuation))

random.shuffle(documents)
# print(documents[0])

all_words = nltk.FreqDist(w.lower() for w in word_string.split())

word_features = list(all_words)[:5]

def document_features(document):
    document_words = set(document)
    features = {}
    for word in word_features:
        features['contains({})'.format(word)] = (word in document_words)
    return features

# This is how it's used
calliope = pickle.load(open('calliope.pickle', 'rb'))
test_banner = data[random.randint(0,5)][0]
print("'"+ test_banner + "' is " + calliope.classify(document_features(test_banner.split())))