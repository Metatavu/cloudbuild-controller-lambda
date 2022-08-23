"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const protos_1 = require("@google-cloud/cloudbuild/build/protos/protos");
const config_1 = require("./config");
const AwsCliStep = __importStar(require("./steps/aws-cli.json"));
const GitSubmodulesStep = __importStar(require("./steps/git-submodules.json"));
const GradleBuildStep = __importStar(require("./steps/gradle-build.json"));
const GradleTestStep = __importStar(require("./steps/gradle-test.json"));
const KubernetesDeployStep = __importStar(require("./steps/kubernetes-deploy.json"));
const WildflyDockerBuildStep = __importStar(require("./steps/wildfly-docker-build.json"));
const QuarkusDockerBuildStep = __importStar(require("./steps/quarkus-docker-build.json"));
const DockerBuildStep = __importStar(require("./steps/docker-build.json"));
const PlatformIORelease = __importStar(require("./steps/platformio-release.json"));
const QuarkusGradleNativeBuildStep = __importStar(require("./steps/quarkus-gradle-native-build.json"));
const QuarkusNativeDockerBuildStep = __importStar(require("./steps/quarkus-native-docker-build.json"));
const QuarkusGradleNativeTestStep = __importStar(require("./steps/quarkus-gradle-native-test.json"));
class default_1 {
}
exports.default = default_1;
default_1.getGradleWildflyBranchBuild = (opts) => {
    const { namespace, deployment, project, awsAccessKey, awsSecretAccessKey } = opts;
    return {
        substitutions: {
            "_AWS_ACCESS_KEY_ID": awsAccessKey,
            "_AWS_DEFAULT_REGION": config_1.activeConfigProfile.aws.region,
            "_AWS_SECRET_ACCESS_KEY": awsSecretAccessKey,
            "_CLUSTER": config_1.activeConfigProfile.eks.clusterName,
            "_DEPLOYMENT": deployment,
            "_DOCKER_REPO_URL": `${config_1.activeConfigProfile.aws.accountId}.dkr.ecr.${config_1.activeConfigProfile.aws.region}.amazonaws.com/${project}`,
            "_NAMESPACE": namespace
        },
        timeout: {
            seconds: 1200
        },
        steps: [
            GitSubmodulesStep,
            GradleBuildStep,
            WildflyDockerBuildStep,
            AwsCliStep,
            KubernetesDeployStep
        ]
    };
};
default_1.getGradleWildflyPrBuild = (opts) => {
    return {
        substitutions: {},
        timeout: {
            seconds: 1200
        },
        steps: [
            GitSubmodulesStep,
            GradleTestStep,
        ]
    };
};
default_1.getGradleQuarkusBranchBuild = (opts) => {
    const { namespace, deployment, project, awsAccessKey, awsSecretAccessKey } = opts;
    return {
        substitutions: {
            "_AWS_ACCESS_KEY_ID": awsAccessKey,
            "_AWS_DEFAULT_REGION": config_1.activeConfigProfile.aws.region,
            "_AWS_SECRET_ACCESS_KEY": awsSecretAccessKey,
            "_CLUSTER": config_1.activeConfigProfile.eks.clusterName,
            "_DEPLOYMENT": deployment,
            "_DOCKER_REPO_URL": `${config_1.activeConfigProfile.aws.accountId}.dkr.ecr.${config_1.activeConfigProfile.aws.region}.amazonaws.com/${project}`,
            "_NAMESPACE": namespace
        },
        timeout: {
            seconds: 1200
        },
        steps: [
            GitSubmodulesStep,
            GradleBuildStep,
            QuarkusDockerBuildStep,
            AwsCliStep,
            KubernetesDeployStep
        ]
    };
};
default_1.getGradleQuarkusNativeBranchBuild = (opts) => {
    const { namespace, deployment, project, awsAccessKey, awsSecretAccessKey } = opts;
    return {
        substitutions: {
            "_AWS_ACCESS_KEY_ID": awsAccessKey,
            "_AWS_DEFAULT_REGION": config_1.activeConfigProfile.aws.region,
            "_AWS_SECRET_ACCESS_KEY": awsSecretAccessKey,
            "_CLUSTER": config_1.activeConfigProfile.eks.clusterName,
            "_DEPLOYMENT": deployment,
            "_DOCKER_REPO_URL": `${config_1.activeConfigProfile.aws.accountId}.dkr.ecr.${config_1.activeConfigProfile.aws.region}.amazonaws.com/${project}`,
            "_NAMESPACE": namespace,
            "_GRAAL_VM_VERSION": "21.2.0"
        },
        timeout: {
            seconds: 7200
        },
        options: {
            machineType: protos_1.google.devtools.cloudbuild.v1.BuildOptions.MachineType.N1_HIGHCPU_32
        },
        steps: [
            GitSubmodulesStep,
            QuarkusGradleNativeBuildStep,
            QuarkusNativeDockerBuildStep,
            AwsCliStep,
            KubernetesDeployStep
        ]
    };
};
default_1.getGradleQuarkusPrBuild = (opts) => {
    return {
        substitutions: {},
        timeout: {
            seconds: 1200
        },
        steps: [
            GitSubmodulesStep,
            GradleTestStep,
        ]
    };
};
default_1.getGradleQuarkusNativePrBuild = (opts) => {
    return {
        substitutions: {
            "_GRAAL_VM_VERSION": "21.2.0"
        },
        timeout: {
            seconds: 7200
        },
        options: {
            machineType: protos_1.google.devtools.cloudbuild.v1.BuildOptions.MachineType.N1_HIGHCPU_32
        },
        steps: [
            GitSubmodulesStep,
            QuarkusGradleNativeTestStep,
        ]
    };
};
default_1.getPlatformConfigurationPlainDockerBuild = (opts) => {
    const { namespace, deployment, project, awsAccessKey, awsSecretAccessKey } = opts;
    return {
        substitutions: {
            "_AWS_ACCESS_KEY_ID": awsAccessKey,
            "_AWS_DEFAULT_REGION": config_1.activeConfigProfile.aws.region,
            "_AWS_SECRET_ACCESS_KEY": awsSecretAccessKey,
            "_CLUSTER": config_1.activeConfigProfile.eks.clusterName,
            "_DEPLOYMENT": deployment,
            "_DOCKER_REPO_URL": `${config_1.activeConfigProfile.aws.accountId}.dkr.ecr.${config_1.activeConfigProfile.aws.region}.amazonaws.com/${project}`,
            "_NAMESPACE": namespace
        },
        timeout: {
            seconds: 1200
        },
        steps: [
            DockerBuildStep,
            AwsCliStep,
            KubernetesDeployStep
        ]
    };
};
default_1.getPlatformConfigurationPlatformIOBranchBuild = (opts) => {
    return {
        substitutions: {},
        timeout: {
            seconds: 1200
        },
        steps: [
            PlatformIORelease
        ]
    };
};
