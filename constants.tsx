import React from 'react';
import { 
  Box, 
  Server, 
  LayoutGrid, 
  Ship, 
  Globe, 
  Anchor, 
  ShieldCheck, 
  Network
} from 'lucide-react';
import { Concept } from './types';

export const INITIAL_NODES_COUNT = 2;
export const MAX_PODS_PER_NODE = 4;

export const K8S_CONCEPTS: Concept[] = [
  {
    id: 'cluster',
    title: 'Cluster',
    analogy: 'The Shipping Port',
    description: 'The entire facility where all the action happens. It manages the ships (Nodes) and the cargo (Pods).',
    icon: <LayoutGrid className="w-6 h-6" />,
  },
  {
    id: 'node',
    title: 'Node',
    analogy: 'The Cargo Ship',
    description: 'A worker machine (virtual or physical) that carries the containers. It needs a captain (Kubelet) to report back to the port authority.',
    icon: <Server className="w-6 h-6" />,
    visualAction: 'ADD_NODE'
  },
  {
    id: 'pod',
    title: 'Pod',
    analogy: 'The Shipping Container',
    description: 'The smallest deployable unit. Usually wraps one application container (like a box inside the shipping container). Pods live on Nodes.',
    icon: <Box className="w-6 h-6" />,
    visualAction: 'ADD_POD'
  },
  {
    id: 'deployment',
    title: 'Deployment',
    analogy: 'The Crane Operator / Manifest',
    description: 'Ensures the right number of containers are always present. If a container falls overboard (crashes), the Deployment orders a new one.',
    icon: <Ship className="w-6 h-6" />,
    visualAction: 'SCALE_UP'
  },
  {
    id: 'service',
    title: 'Service',
    analogy: 'The Dispatch Office',
    description: 'Provides a permanent phone number (IP address) to reach a set of Pods, even if the Pods themselves change or move ships.',
    icon: <Network className="w-6 h-6" />,
  },
  {
    id: 'ingress',
    title: 'Ingress',
    analogy: 'The Port Gate',
    description: 'Manages external access to the services in the cluster, typically HTTP. It routes traffic from the outside world to the correct Service.',
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: 'configmap',
    title: 'ConfigMap',
    analogy: 'The Instruction Label',
    description: 'Configuration data (like DB URLs) decoupled from container images, so you can change settings without rebuilding the "box".',
    icon: <Anchor className="w-6 h-6" />,
  },
  {
    id: 'secret',
    title: 'Secret',
    analogy: 'The Safe',
    description: 'Similar to ConfigMaps but specifically for sensitive info like passwords or keys. Keeps them locked away securely.',
    icon: <ShieldCheck className="w-6 h-6" />,
  },
];
