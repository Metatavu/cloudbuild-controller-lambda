"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubeVersionConfig = void 0;
const client_node_1 = require("@kubernetes/client-node");
exports.KubeVersionConfig = {
    "1.15": {
        apis: {
            AppsApi: client_node_1.AppsV1Api,
            CoreApi: client_node_1.CoreV1Api,
            RbacAuthorizationApi: client_node_1.RbacAuthorizationV1Api,
            NetworkingApi: client_node_1.NetworkingV1beta1Api
        },
        resources: {
            ingress: {
                apiVersion: "networking.k8s.io/v1beta1",
                clusterIssuerKey: "certmanager.k8s.io/cluster-issuer",
                ruleType: typeof client_node_1.NetworkingV1beta1Api,
                addLabels: {}
            },
            deployment: {
                apiVersion: "extensions/v1beta1"
            },
            persistentVolumeClaim: {
                apiVersion: "v1",
                storageClassName: "aws-efs"
            }
        }
    },
    "1.19": {
        apis: {
            AppsApi: client_node_1.AppsV1Api,
            CoreApi: client_node_1.CoreV1Api,
            RbacAuthorizationApi: client_node_1.RbacAuthorizationV1Api,
            NetworkingApi: client_node_1.NetworkingV1Api
        },
        resources: {
            ingress: {
                apiVersion: "networking.k8s.io/v1",
                clusterIssuerKey: "cert-manager.io/cluster-issuer",
                ruleType: typeof client_node_1.V1IngressRule,
                addLabels: {
                    "use-cloudflare-solver": "true"
                }
            },
            deployment: {
                apiVersion: "apps/v1",
                resources: {
                    requests: {
                        cpu: "0.5",
                        memory: "2Gi"
                    },
                    limits: {
                        cpu: "1",
                        memory: "4Gi"
                    }
                }
            },
            persistentVolumeClaim: {
                apiVersion: "v1",
                storageClassName: "managed-nfs-storage"
            }
        }
    }
};
