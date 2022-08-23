------------- gCloud Project -------------


The project is designed to be deployed on Google Cloud Functions. 
The Recommended engine is Nodejs16 and the entry point is app function that's located in index file.
tupedd-1344 file is an example of a Service account key, which is used for authentication.
Notice that the used service account needs proper privileges to be able to modify cloud assets like build triggers.

There is only a need for 4 node modules and they are included in the git package.
Cloud Functions will automatically detect these modules. 

cloudbuild.js uses hardcoded variables of GitHub repository owner which should be checked before deployment.



Tuomas Kiviranta 2022 