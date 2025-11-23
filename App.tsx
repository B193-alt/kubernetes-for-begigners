import React, { useState, useEffect, useCallback } from 'react';
import { INITIAL_NODES_COUNT, K8S_CONCEPTS, MAX_PODS_PER_NODE } from './constants';
import { Node, Pod, Concept } from './types';
import { Visualizer } from './components/Visualizer';
import { TutorChat } from './components/TutorChat';
import { Ship, BookOpen, ChevronRight, Info } from 'lucide-react';

const App: React.FC = () => {
  // --- Simulation State ---
  const [nodes, setNodes] = useState<Node[]>([]);
  const [activeConcept, setActiveConcept] = useState<Concept>(K8S_CONCEPTS[0]);

  // --- Initialize Simulation ---
  useEffect(() => {
    const initialNodes: Node[] = Array.from({ length: INITIAL_NODES_COUNT }).map((_, i) => ({
      id: `node-${i + 1}`,
      name: `Ship-Alpha-${i + 1}`,
      capacity: MAX_PODS_PER_NODE,
      pods: [],
      status: 'Ready'
    }));
    setNodes(initialNodes);
  }, []);

  // --- Actions ---

  const addNode = useCallback(() => {
    setNodes(prev => [
      ...prev,
      {
        id: `node-${Date.now()}`,
        name: `Ship-Beta-${Math.floor(Math.random() * 1000)}`,
        capacity: MAX_PODS_PER_NODE,
        pods: [],
        status: 'Ready'
      }
    ]);
  }, []);

  const removeNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
    // Note: In real K8s, pods would be rescheduled. We simulate this in crashNode but simple delete here.
  }, []);

  const addPod = useCallback(() => {
    // Basic scheduler: Find first ready node with space
    setNodes(prev => {
      const newNodes = [...prev];
      const targetNodeIndex = newNodes.findIndex(n => n.status === 'Ready' && n.pods.length < n.capacity);
      
      if (targetNodeIndex !== -1) {
        const newPod: Pod = {
          id: `pod-${Date.now()}`,
          name: `app-v${Math.floor(Math.random() * 10)}`,
          status: 'Running',
          color: 'blue'
        };
        const updatedNode = { ...newNodes[targetNodeIndex], pods: [...newNodes[targetNodeIndex].pods, newPod] };
        newNodes[targetNodeIndex] = updatedNode;
        return newNodes;
      } else {
        alert("Cluster Full! Add more Nodes (Ships) to deploy more Pods (Containers).");
        return prev;
      }
    });
  }, []);

  const crashNode = useCallback((nodeId: string) => {
    // 1. Mark node as NotReady
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'NotReady' } : n));

    // 2. Simulate "Self-Healing": Move pods to other nodes after delay
    setTimeout(() => {
      setNodes(currentNodes => {
        const crashedNode = currentNodes.find(n => n.id === nodeId);
        if (!crashedNode) return currentNodes;

        const podsToReschedule = crashedNode.pods;
        const healthyNodes = currentNodes.filter(n => n.id !== nodeId && n.status === 'Ready');
        
        // Simple Round Robin redistribution
        const updatedNodes = [...currentNodes];
        // Remove pods from crashed node
        updatedNodes.map(n => n.id === nodeId ? { ...n, pods: [] } : n);

        let podIdx = 0;
        // Try to place each pod
        while (podIdx < podsToReschedule.length) {
            let placed = false;
            for (let i = 0; i < updatedNodes.length; i++) {
                if (updatedNodes[i].status === 'Ready' && updatedNodes[i].pods.length < updatedNodes[i].capacity) {
                   updatedNodes[i] = {
                       ...updatedNodes[i],
                       pods: [...updatedNodes[i].pods, { ...podsToReschedule[podIdx], status: 'Running' }]
                   };
                   placed = true;
                   break;
                }
            }
            if (!placed) {
                // Could not place remaining pods
                console.warn("Cluster capacity exceeded during rescheduling");
            }
            podIdx++;
        }

        // Finally remove the crashed node for dramatic effect (or keep it dead)
        // Let's keep it dead but empty to show it failed.
        return updatedNodes.map(n => n.id === nodeId ? { ...n, pods: [] } : n);
      });
    }, 2000);
  }, []);


  // --- Render ---

  return (
    <div className="flex h-screen w-full bg-slate-50">
      
      {/* Sidebar: Concepts Menu */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Ship className="w-8 h-8" />
            <h1 className="text-2xl font-bold tracking-tight">KubeQuest</h1>
          </div>
          <p className="text-xs text-slate-500 ml-10">Kubernetes for Humans</p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
           <div className="px-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning Modules</div>
           {K8S_CONCEPTS.map(concept => (
             <button
               key={concept.id}
               onClick={() => setActiveConcept(concept)}
               className={`w-full px-6 py-4 flex items-start gap-4 transition-colors hover:bg-slate-50 text-left border-l-4
                 ${activeConcept.id === concept.id 
                   ? 'border-blue-500 bg-blue-50/50' 
                   : 'border-transparent'}`}
             >
               <div className={`mt-0.5 p-1.5 rounded-md ${activeConcept.id === concept.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                 {concept.icon}
               </div>
               <div>
                 <h3 className={`font-semibold ${activeConcept.id === concept.id ? 'text-blue-900' : 'text-slate-700'}`}>
                   {concept.title}
                 </h3>
                 <p className="text-xs text-slate-500 mt-0.5 font-medium italic">
                   "{concept.analogy}"
                 </p>
               </div>
               {activeConcept.id === concept.id && <ChevronRight className="w-4 h-4 ml-auto text-blue-400 mt-1" />}
             </button>
           ))}
        </div>
        
        <div className="p-4 border-t border-slate-100 text-xs text-center text-slate-400">
          Powered by Gemini • Learn by Doing
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
               <BookOpen className="w-4 h-4" />
               <span>Current Topic</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {activeConcept.title} 
              <span className="text-lg font-normal text-slate-400 px-3 py-1 bg-slate-100 rounded-full">
                aka {activeConcept.analogy}
              </span>
            </h2>
          </div>
          
          {/* Action Hint */}
          {activeConcept.visualAction && (
             <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-sm animate-pulse">
                <Info className="w-4 h-4" />
                <span>Try the simulation below to see this in action!</span>
             </div>
          )}
        </header>

        {/* Content Grid */}
        <div className="flex-1 overflow-hidden p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Concept Info & Simulator */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
             
             {/* Info Card */}
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm shrink-0">
               <h3 className="text-lg font-semibold text-slate-800 mb-2">What is it?</h3>
               <p className="text-slate-600 leading-relaxed text-lg">
                 {activeConcept.description}
               </p>
             </div>

             {/* The Visualizer Game */}
             <div className="flex-1 min-h-[400px]">
                <Visualizer 
                  nodes={nodes}
                  onAddNode={addNode}
                  onRemoveNode={removeNode}
                  onAddPod={addPod}
                  onCrashNode={crashNode}
                />
             </div>
          </div>

          {/* Right: AI Tutor */}
          <div className="lg:col-span-4 h-full">
             <TutorChat currentContext={`The user is currently learning about the Kubernetes ${activeConcept.title} (Analogy: ${activeConcept.analogy}). Description: ${activeConcept.description}`} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
