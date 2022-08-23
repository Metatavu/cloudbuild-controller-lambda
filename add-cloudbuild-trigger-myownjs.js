const express = require('express');
const bodyParser = require('body-parser');
var addCloudbuildTrigger = express.Router();
addCloudbuildTrigger.use(bodyParser.json());

const { activeConfigProfile } = require("./config");
const CloudBuild = require("./cloudbuild");

const platforms = require('./platforms').default;
var CommandOptions = {};
var DeleteTrigger = false;
var SubValues = null;

exports.Platform = "gradle-wildfly" | "gradle-quarkus" | "gradle-quarkus-native" | "simple-docker" | "platformio";
exports.BuildType = "master" | "develop" | "pr";

addCloudbuildTrigger.route('/')
.post(async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
      res.status(200).send('Information is required!');
  }
  else {
    if (req.body.awsAccessKey !== undefined && req.body.awsSecretAccessKey !== undefined) {
      SubValues = {"_AWS_ACCESS_KEY": req.body.awsAccessKey, "_AWS_SECRET_ACCESS_KEY": req.body.awsSecretAccessKey};
    };
    if (req.body.delete === "true") {
      DeleteTrigger = true;
    }
    /*CommandOptions_example = {
      namespace: "namespace",
      project: "FruitGame.github.io",
      platform: "platformio",
      type: "master",
      deployment: "deployment",
      };*/
     CommandOptions = {
      namespace: req.body.namespace,
      project: req.body.project,      // GitHub repository
      platform: req.body.platform,
      type: req.body.type,
      deployment: req.body.deployment,
     };
    var resu = await addCloudBuild(CommandOptions);
    if (DeleteTrigger) {res.send('Trigger deleted successfully! \n'+ JSON.stringify(resu));}
    else {res.send('Trigger created/updated successfully! \n'+ JSON.stringify(resu));}
    DeleteTrigger = false;
  }
});

const createTrigger = async (cloudBuild, type, project, triggerName, platformConfiguration) => {
  const options = {
    branchName: type,
    githubRepo: project,
    name: triggerName,
    steps: platformConfiguration.steps,
    substitutions: SubValues || platformConfiguration.substitutions,
    timeout: platformConfiguration.timeout,
    options: platformConfiguration.options
  };

  const trigger = await cloudBuild.findBuildTriggerByName(triggerName);
  if (trigger !== false) {
    if (DeleteTrigger) {
      return await cloudBuild.deleteTrigger(trigger);
    }
    console.log('Similar trigger already exists, it will be replaced');
    return await cloudBuild.replaceTrigger(trigger, options);
  }
  else {
    if (type == "pr") {
      return await cloudBuild.createPrBuildTrigger(options);
    } else {
      return await cloudBuild.createBranchBuildTrigger(options);
    }
  }
}

const addCloudBuild = async (CommandOptions) => {
  const { namespace, project, platform, type, deployment, awsAccessKey, awsSecretAccessKey } = CommandOptions;

  const triggerName = (project+"-"+type).replace(/\./g, "");

  console.log('Configuring cloudbuild triggers');

  const cloudBuild = new CloudBuild(activeConfigProfile);

  console.log('Configuring trigger');

  let platformConfiguration = null;

  switch (platform) {
    case "gradle-wildfly":
      if (type == "pr") {
        platformConfiguration = platforms.getGradleWildflyPrBuild({

        });
      } else {
        platformConfiguration = platforms.getGradleWildflyBranchBuild({
          awsAccessKey: awsAccessKey || "TODO",
          awsSecretAccessKey: awsSecretAccessKey || "TODO",
          deployment: deployment,
          namespace: namespace,
          project: project
        });
      }
    break;
    case "gradle-quarkus":
      if (type == "pr") {
        platformConfiguration = platforms.getGradleQuarkusPrBuild({

        });
      } else {
        platformConfiguration = platforms.getGradleQuarkusBranchBuild({
          awsAccessKey: awsAccessKey || "TODO",
          awsSecretAccessKey: awsSecretAccessKey || "TODO",
          deployment: deployment,
          namespace: namespace,
          project: project
        });
      }
    break;
    case "gradle-quarkus-native":
      if (type == "pr") {
        platformConfiguration = platforms.getGradleQuarkusNativePrBuild({

        });
      } else {
        platformConfiguration = platforms.getGradleQuarkusNativeBranchBuild({
          awsAccessKey: awsAccessKey || "TODO",
          awsSecretAccessKey: awsSecretAccessKey || "TODO",
          deployment: deployment,
          namespace: namespace,
          project: project
        });
      }
    break;
    case "simple-docker":
      if (type != "pr") {
        platformConfiguration = platforms.getPlatformConfigurationPlainDockerBuild({
          awsAccessKey: awsAccessKey || "TODO",
          awsSecretAccessKey: awsSecretAccessKey || "TODO",
          deployment: deployment,
          namespace: namespace,
          project: project
        });
      }
    break;
    case "platformio":
      if (type != "pr") {
        platformConfiguration = platforms.getPlatformConfigurationPlatformIOBranchBuild(

        );
      }
    break;
  }

  if (!platformConfiguration) {
    throw new Error('Could not find platform configuration for '+platform+' / '+type);
  }

  console.log("Before creating trigger");
  return await createTrigger(cloudBuild, type, project, triggerName, platformConfiguration);
  console.log("After creating trigger");
}

module.exports = addCloudbuildTrigger;
