# cloudbuild-controller-lambda
The project is designed to be deployed on Google Cloud Functions. The recommended engine is Nodejs16 and the entry point is app function that's located in index file. tupedd-1344 file is an example of a Service account key, which is used for authentication. Notice that the used service account needs proper privileges to be able to modify cloud assets like build triggers. The API can create, update, and delete Build Triggers. The delete variable is optional, being activated only when it's "true".

There is only a need for 4 node modules and they are included in the git package. Cloud Functions will automatically detect these modules.

cloudbuild.js uses hardcoded variables of GitHub repository owner which should be checked before deployment.

Deploy with command: 
gcloud functions deploy my-test-function --runtime=nodejs16 --entry-point=app --trigger-http --allow-unauthenticated

Test POST body:
{"namespace": "namespace","project": "Game.github.io","platform": "platformio","type": "master",
"deployment": "deployment", "awsAccessKey":"1555", "awsSecretAccessKey":"4321"}





Tuomas Kiviranta 2022
