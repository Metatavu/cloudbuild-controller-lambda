const { protos } = require('@google-cloud/cloudbuild');
const CloudBuildClient = require('@google-cloud/cloudbuild').CloudBuildClient;
const { google } = require('@google-cloud/cloudbuild/build/protos/protos');

module.exports = class CloudBuild {

  constructor(config) {
    this.config = config;
    this.client = new CloudBuildClient(config);
  };

  async createBranchBuildTrigger ({ name, githubRepo, branchName, substitutions, steps, timeout, options}) {

    const trigger = google.devtools.cloudbuild.v1.IBuildTrigger = {
      name: name,
      github: {
        owner: "tumeex",   // GitHub username
        name: githubRepo,
        push: {
          branch: ".*"    // Github branch
        }
      },
      substitutions: substitutions,
      build: {
        timeout: timeout,
        options: options,
        steps: steps
      }
    };
    const result = await this.client.createBuildTrigger({
      projectId: this.config.project_id,
      trigger: trigger
    });
    return result[0];
  };

  async createPrBuildTrigger({ name, githubRepo, branchName, substitutions, steps, timeout, options}) {

    const trigger = google.devtools.cloudbuild.v1.IBuildTrigger = {
      name: name,
      github: {
        owner: "Metatavu",   // GitHub username
        name: githubRepo,
        pullRequest: {
          branch: "develop"  // GitHub pr branch
        }
      },
      substitutions: substitutions,
      build: {
        timeout: timeout,
        options: options,
        steps: steps
      }
    };

    const result = await this.client.createBuildTrigger({
      projectId: this.config.project_id,
      trigger: trigger
    });

    return result[0];
  };

  async findBuildTriggerByName(name) {

    let pageToken = null;

    while (true) {
      const responses = await this.client.listBuildTriggers({
        pageToken: pageToken,
        projectId: this.config.project_id
      });

      const triggers = protos.google.devtools.cloudbuild.v1.IBuildTrigger = responses[0];
      const response = protos.google.devtools.cloudbuild.v1.IListBuildTriggersResponse = responses[2];

      const trigger = triggers.find(trigger => trigger.name == name);
      if (trigger) {
        return trigger;
      };

      if (response == null || !response.nextPageToken) {
        return false;
      }

      pageToken = response.nextPageToken;
    }
  };

  async replaceTrigger(oldTrigger, newTrigger) {
    const trigger = google.devtools.cloudbuild.v1.IBuildTrigger = {
      name: newTrigger.name,
      github: {
        owner: "tumeex",   // GitHub username
        name: newTrigger.githubRepo,
        push: {
          branch: newTrigger.branchName,
        }
      },
      substitutions: newTrigger.substitutions,
      build: {
        timeout: newTrigger.timeout,
        options: newTrigger.options,
        steps: newTrigger.steps
      }
    };
    var replaceTrigger = {
      projectId: this.config.project_id,
      triggerId: oldTrigger.id,
      trigger: trigger
    };

    const result = await this.client.updateBuildTrigger(replaceTrigger);
    return result[0];
  };

  async deleteTrigger(trigger) {
    var request = {
      projectId: this.config.project_id,
      triggerId: trigger.id
    };
    const result = await this.client.deleteBuildTrigger(request)
    return result[0];
  };
}
