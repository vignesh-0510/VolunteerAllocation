# VolunteerAllocation

This code serves as the backend for the project used to allocate volunteers based on maximum optimum matching. It takes input from database about victims and volunteers, which in turn gets data from the frontend form, and applies a modified version of K-Means Clustering to allocate volunteers to the victims and saves it back to the database and calls a route responsible for sending customised Emails to victims and volunteers both, which is handled by the nodejs.

## Input
    The input is taken from mongodb Atlas. Input is 2 collections name recipients and volunteers which hold the data for victims and volunteers respectively


## Output
    The Output is saved to mongodb Atlas in a collection called results 
