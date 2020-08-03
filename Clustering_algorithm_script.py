import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from nltk.stem import SnowballStemmer
import random
plt.style.use("seaborn")
import json

# DATA PREPARATION
# Get Victims Data
snow = SnowballStemmer(language='english')
victim_file = "victims_sample_v2.csv"
victims_df = pd.read_csv(victim_file)
victims_df["skills"] = [[snow.stem(y) for y in x.split('-')] for x in victims_df["skills"]]
victims_df["priorities"] = [[ int(y) for y in x.split('-') ] for x in victims_df["priorities"]]
# print(victims_df.head())
# print("\n\n")

# Get Volunteers Data
volunteer_file = "volunteers_sample_v2.csv"
volunteers_df = pd.read_csv(volunteer_file)
volunteers_df["skills"] = [[snow.stem(y) for y in x.split('-')] for x in volunteers_df["skills"]]
volunteers_df_copy = pd.read_csv(volunteer_file)
volunteers_df_copy["skills"] = [x.split('-') for x in volunteers_df_copy["skills"]]
volunteers_df_copy.drop(columns=["can_serve"])
# print(volunteers_df.head())

# DECLARE AND INITIALISE RESULT OF TYPE JSON OBJECT
results = dict()
for i in range(victims_df.shape[0]):
    row = victims_df.iloc[i].values
    result = {}
    idx = row[0]
    result['help'] = row[1]
    result['skills'] = row[2]
    result['volunteers_allocated'] = []
    results[idx] = result
    
#results

k= victims_df.shape[0]
colors = ['green','red','blue','yellow','orange']
clusters = {}
for i in range(k):
    victim = victims_df.iloc[i].to_dict() # they will be Centroid of the clusters
    points = []
    cluster = {
        'victim': victim,
        'points': points,
        'color': colors[i%len(colors)]
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
        
        maximum = np.max(dist)
        max_list = [idx for idx,val in enumerate(dist) if val == maximum]
        # Randomly choose one victim to be assigned if multiple victims have same distance score
        cur_cluster = random.choice(max_list)
        print("dist:", dist, "max:", maximum, "argmax(selected):", cur_cluster)
        if maximum != 0:
            clusters[cur_cluster]['points'].append(cur_vol)
            # Remove common Elements from Victims so that further Volunteers are not assigned
            common_elements = common_elements_list[cur_cluster]
            priorities_list = clusters[cur_cluster]['victim']['priorities']
            priorities_list = [x for (i,x) in enumerate(priorities_list) if clusters[cur_cluster]['victim']['skills'][i] not in common_elements]
            clusters[cur_cluster]['victim']['priorities'] = priorities_list
            clusters[cur_cluster]['victim']['skills'] = remove_common_elements(clusters[cur_cluster]['victim']['skills'],common_elements)    
            if cur_vol['can_serve'] == 1:
                cur_vol['skills'] = remove_common_elements(cur_vol['skills'],common_elements)
                volunteers_df['skills'].iloc[ix] = cur_vol['skills']
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
                idx = clusters[kx]['victim']['id']
                verbs_list = volunteers_df_copy['skills'].loc[volunteers_df_copy["id"] == pts[ix]['id']].to_list()
                pts[ix]['skills'] = verbs_list
                
                results[idx]['volunteers_allocated'].append(pts[ix])
                print("Volunteer:", pts[ix]["id"], "is assigned to Victim:", idx)
            clusters[kx]['points'] = [] #Clear the List

def model(X,clusters,k):
    done = False
    while not done:
        done = AssignPointsToClusters(X,clusters)
        UpdateClusters(clusters,k)
        
model(volunteers_df,clusters, k)
# results

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

# WRITE THE OUTPUT TO FILE
json_obj = json.dumps(results, indent=2, cls=NpEncoder)
with open('results_v2.json', 'w') as f:
    f.write(json_obj)