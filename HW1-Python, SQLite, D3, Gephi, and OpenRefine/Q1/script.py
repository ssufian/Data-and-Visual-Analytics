import csv
import json
import time
import tweepy


# You must use Python 2.7.x
# Rate limit chart for Twitter REST API - https://developer.twitter.com/en/docs/basics/rate-limiting.html

def loadKeys(key_file):
    # TODO: put your keys and tokens in the keys.json file,
    #       then implement this method for loading access keys and token from keys.json
    # rtype: str <api_key>, str <api_secret>, str <token>, str <token_secret>

    # Load keys here and replace the empty strings in the return statement with those keys

    jfile = json.load(open(key_file))

    return jfile["api_key"],jfile["api_secret"],jfile["token"],jfile["token_secret"]

# Q1.b.(i) - 5 points
def getPrimaryFriends(api, root_user, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' primary friends of 'root_user'
    # rtype: list containing entries in the form of a tuple (root_user, friend)
    getFriends = api.friends(screen_name = root_user, count = no_of_friends)
    primary_friends = []
    # Add code here to populate primary_friends
    for i in range(0,len(getFriends)):
        primary_friends.append((root_user, getFriends[i].screen_name))

    return primary_friends

# Q1.b.(ii) - 7 points
def getNextLevelFriends(api, friends_list, no_of_friends):
    # TODO: implement the method for fetching 'no_of_friends' friends for each entry in friends_list
    # rtype: list containing entries in the form of a tuple (friends_list[i], friend)
    next_level_friends = []
    # Add code here to populate next_level_friends
    for i in range(0,len(friends_list)):
        getNFriends = api.friends(screen_name = friends_list[i][1], count = no_of_friends)
        for x in range(0,len(getNFriends)):
            next_level_friends.append((friends_list[i][1], getNFriends[x].screen_name))
            
    return next_level_friends

# Q1.b.(iii) - 7 points
def getNextLevelFollowers(api, followers_list, no_of_followers):
    # TODO: implement the method for fetching 'no_of_followers' followers for each entry in followers_list
    # rtype: list containing entries in the form of a tuple (follower, followers_list[i])    
    next_level_followers = []
    # Add code here to populate next_level_followers
    for i in range(0,len(followers_list)):
        getNFollowers = api.followers(screen_name = followers_list[i][1], count = no_of_followers)
        for x in range(0,len(getNFollowers)):
            next_level_followers.append((getNFollowers[x].screen_name, followers_list[i][1]))

    return next_level_followers

# Q1.b.(i),(ii),(iii) - 4 points
def GatherAllEdges(api, root_user, no_of_neighbours):
    # TODO:  implement this method for calling the methods getPrimaryFriends, getNextLevelFriends
    #        and getNextLevelFollowers. Use no_of_neighbours to specify the no_of_friends/no_of_followers parameter.
    #        NOT using the no_of_neighbours parameter may cause issues with grading.
    #        Accumulate the return values from all these methods.
    # rtype: list containing entries in the form of a tuple (Source, Target). Refer to the "Note(s)" in the 
    #        Question doc to know what Source node and Target node of an edge is in the case of Followers and Friends.

    api.wait_on_rate_limit = True
    api.wait_on_rate_limit_notify = True 
    all_edges = [] 
    #Add code here to populate all_edges
    polo_Friends = getPrimaryFriends(api, root_user, no_of_neighbours)
    nextLevelFriends = getNextLevelFriends(api, polo_Friends, no_of_neighbours)
    nextLevelFollowers = getNextLevelFollowers(api, polo_Friends, no_of_neighbours)
    all_edges = polo_Friends + nextLevelFriends + nextLevelFollowers
    return all_edges


# Q1.b.(i),(ii),(iii) - 5 Marks
def writeToFile(data, output_file):
    # write data to output_file
    # rtype: None
    graph_csv = open(output_file, "w")
    for item in data:
        row = item[0] + "," + item[1] + "\n"
        graph_csv.write(row)
    graph_csv.close()
    pass




"""
You may modify testSubmission()
for your testing purposes
but it will not be graded.

It is highly recommended that
you DO NOT put any code outside testSubmission().

Note that your code should work as expected
for any value of ROOT_USER.
"""

def testSubmission():
    KEY_FILE = 'keys.json'
    OUTPUT_FILE_GRAPH = 'graph.csv'
    NO_OF_NEIGHBOURS = 20
    ROOT_USER = 'PoloChau'

    api_key, api_secret, token, token_secret = loadKeys(KEY_FILE)

    auth = tweepy.OAuthHandler(api_key, api_secret)
    auth.set_access_token(token, token_secret)
    api = tweepy.API(auth)

    edges = GatherAllEdges(api, ROOT_USER, NO_OF_NEIGHBOURS)

    writeToFile(edges, OUTPUT_FILE_GRAPH)
    

if __name__ == '__main__':
    testSubmission()

