import numpy as np
import pandas as pd
from nltk.stem import SnowballStemmer
import random
import json
import sys
sys.path.append('C:/Users/sathyamoorthy pandia/AppData/Local/Programs/Python/Python37/Lib/site-packages')
from pymongo import MongoClient
import requests

# DATA PREPARATION
print('Collecting Data')
# Connecting to Database
try:
    client = MongoClient('mongodb+srv://annu:ammu@cluster0.9896d.mongodb.net/ask-foundation?retryWrites=true&w=majority')
    db_name = 'ask-foundation'
    db = client.get_database(db_name)
except Exception as e:
    print("Couldn't connect to database",e,sep='\n')
# Get Victims Data
snow = SnowballStemmer(language='english')
victim_file = "recipients"
victims_df = pd.DataFrame(list(db[victim_file].find()))
victims_df["skills"] = [[snow.stem(y) for y in x.split('-')] for x in victims_df["skills"]]
victims_df["priorities"] = [[ int(y) for y in x.split('-') ] for x in victims_df["priorities"]]


# Get Volunteers Data
volunteer_file = "volunteers"
volunteers_df = pd.DataFrame(list(db[volunteer_file].find()))
volunteers_df["skills"] = [[snow.stem(y) for y in x.split('-')] for x in volunteers_df["skills"]]
volunteers_df_copy = pd.DataFrame(list(db[volunteer_file].find()))
volunteers_df_copy["skills"] = [x.split('-') for x in volunteers_df_copy["skills"]]
volunteers_df_copy.drop(columns=["can_serve"])
print("Data is collected")

# DECLARE AND INITIALISE RESULT OF TYPE JSON OBJECT
results = dict()
for i in range(victims_df.shape[0]):
    row = victims_df.iloc[i].values
    result = {}
    idx = str(row[0])
    result['id'] = idx
    result['name'] = row[1]
    result['email'] = row[2]
    result['skills'] = row[3]
    result['volunteers_allocated'] = []
    results[idx] = result

#DECLARE AND INITIALISE CLUSTERS
k= victims_df.shape[0]
clusters = {}
for i in range(k):
    victim = victims_df.iloc[i].to_dict() # they will be Centroid of the clusters
    points = []
    cluster = {
        'victim': victim,
        'points': points
    }
    clusters[i] = cluster
    
# HELPER FUNCTIONS
def get_common_elements(v1,v2):
    return list(set(v1) & set(v2))

def remove_common_elements(a,b):
    return list(set(a) - set(b))

def get_distance(common, arr= None, priorities = None):
    if priorities is None or arr is None:
        return len(common)
    else:
        distance = np.sum([priorities[ix] for ix, val in enumerate(arr) if val in common])
        return distance

    
# E-step
# Parameters : X = dataset -> pd.DataFrame
#            : clusters = victimslist -> dictionary 
def AssignPointsToClusters(Volunteers, clusters):
    done = True
    for ix in range(Volunteers.shape[0]):
        dist = []
        common_elements_list = []
        cur_vol = Volunteers.iloc[ix].to_dict()
        for kx in range(k):
            common_elements = get_common_elements(cur_vol['skills'],clusters[kx]['victim']['skills'])
            common_elements_list.append(common_elements)
            # Get Distance score based on Priorities
            distance = get_distance(common_elements, clusters[kx]['victim']['skills'], clusters[kx]['victim']['priorities'])
            dist.append(distance)
        
        cur_cluster = np.argmax(dist)
        maximum = dist[cur_cluster]
        if maximum != 0:
            clusters[cur_cluster]['points'].append(cur_vol)
            # Remove common Elements from Victims so that further Volunteers are not assigned
            common_elements = common_elements_list[cur_cluster]
            priority_list = clusters[cur_cluster]['victim']['priorities']
            priorities_list = [x for (i,x) in enumerate(priority_list) if clusters[cur_cluster]['victim']['skills'][i] not in common_elements]
            clusters[cur_cluster]['victim']['priorities'] = priorities_list
            clusters[cur_cluster]['victim']['skills'] = remove_common_elements(clusters[cur_cluster]['victim']['skills'],common_elements)
            results[str(clusters[cur_cluster]['victim']['_id'])]['skills'] = clusters[cur_cluster]['victim']['skills']
            if cur_vol['can_serve'] == 1:
                cur_vol['skills'] = remove_common_elements(cur_vol['skills'],common_elements)
                volunteers_df['skills'].iloc[ix] = cur_vol['skills']
            elif cur_vol['can_serve'] < 1:
                continue
            else:
                volunteers_df['can_serve'].iloc[ix] = cur_vol['can_serve'] - 1
            done = False
    return done
        

# M-step
def UpdateClusters(clusters,k):
    for kx in range(k):
        pts = np.array(clusters[kx]['points'])
        if pts.shape[0]>0:
            for ix in range(pts.shape[0]):
                idx = str(clusters[kx]['victim']['_id'])
                verbs_list = volunteers_df_copy['skills'].loc[volunteers_df_copy["_id"] == pts[ix]['_id']].to_list()
                pts[ix]['skills'] = verbs_list
                pts[ix]['_id'] = str(pts[ix]['_id'])
                pts[ix]['can_serve'] = int(pts[ix]['can_serve'])
                pts[ix]['__v'] = int(pts[ix]['__v'])
                results[idx]['volunteers_allocated'].append(pts[ix])
                print("Volunteer:", pts[ix]["name"], "is assigned to Victim:", clusters[kx]['victim']['name'])
            clusters[kx]['points'] = [] #Clear the List

def model(X,clusters,k):
    done = False
    while not done:
        done = AssignPointsToClusters(X,clusters)
        UpdateClusters(clusters,k)

print("Running the model")
model(volunteers_df,clusters, k)
print("Model was successful")

# WRITE THE RESULTS TO COLLECTION IN DATABASE
try:
    print("Updating results in database")
    df = pd.DataFrame.from_dict(results,orient='index')
    db.results.insert_many(df.to_dict('records'))
    print("Successfully Updated the database")
except Exception as e:
    print("Couldn't write the results to the database", e, sep="\n")

# CALLING THE URL TO SEND EMAILS
try:
    print('Sending emails to victims and clients')
    URL = 'http://ask-foundation.herokuapp.com/notify-allocations'
    r = requests.get(url = URL)
    if(r.status_code == 200):
        print(r.content.decode('utf-8'))
    else:
        print('Unable to send messages')
except Exception as e:
    print("Couldn't send e-mails", e, sep="\n")