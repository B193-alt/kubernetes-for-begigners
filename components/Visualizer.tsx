import React from 'react';
import { Node, Pod } from '../types';
import { Server, Box, AlertTriangle, Plus, Trash2, Zap } from 'lucide-react';
import { MAX_PODS_PER_NODE } from '../constants';

interface VisualizerProps {
  nodes: Node[];
  onAddNode: () => void;
  onRemoveNode: (id: string) => void;
  onAddPod: () => void;
  onCrashNode: (id: string) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  nodes, 
  onAddNode, 
  onRemoveNode, 
  onAddPod,
  onCrashNode
}) => {
  
  // Calculate total cluster health/stats for a mini dashboard
  const totalPods = nodes.reduce((acc, node) => acc + node.pods.length, 0);
  const healthyNodes = nodes.filter(n => n.status === 'Ready').length;

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
      
      {/* Simulation Controls & HUD */}
      <div className="bg-white p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Server className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{nodes.length}</span> Ships (Nodes)
          </div>
          <div className="flex items-center gap-1">
            <Box className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{totalPods}</span> Containers (Pods)
          </div>
          <div className="flex items-center gap-1">
             <span className={`w-2 h-2 rounded-full ${healthyNodes === nodes.length ? 'bg-green-500' : 'bg-red-500'}`}></span>
             <span>Status: {healthyNodes === nodes.length ? 'Healthy' : 'Degraded'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onAddNode}
             className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
           >
             <Plus className="w-4 h-4" /> Add Ship
           </button>
           <button 
             onClick={onAddPod}
             className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
           >
             <Plus className="w-4 h-4" /> Deploy App
           </button>
        </div>
      </div>

      {/* The "Sea" / Cluster View */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {nodes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Server className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">No ships in the port.</p>
            <button onClick={onAddNode} className="mt-4 text-blue-600 hover:underline">Launch a new node</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <div 
                key={node.id} 
                className={`relative group rounded-xl border-2 transition-all duration-300 ease-in-out
                  ${node.status === 'Ready' 
                    ? 'bg-white border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md' 
                    : 'bg-red-50 border-red-200 shadow-none opacity-90'
                  }`}
              >
                {/* Node Header */}
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className={`w-5 h-5 ${node.status === 'Ready' ? 'text-blue-500' : 'text-red-500'}`} />
                    <span className="font-semibold text-slate-700">{node.name}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     {node.status === 'Ready' && (
                        <button 
                          onClick={() => onCrashNode(node.id)}
                          title="Simulate Crash"
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                     )}
                     <button 
                        onClick={() => onRemoveNode(node.id)}
                        title="Remove Node"
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                </div>

                {/* Node Body (Pod Slots) */}
                <div className="p-4 min-h-[140px]">
                   {node.status === 'NotReady' ? (
                     <div className="h-full flex flex-col items-center justify-center text-red-500 animate-pulse">
                        <AlertTriangle className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">NODE FAILURE</span>
                        <span className="text-xs text-red-400">Evacuating pods...</span>
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-2">
                       {node.pods.map((pod) => (
                         <div 
                           key={pod.id} 
                           className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded p-2 flex items-center justify-center flex-col shadow-sm animate-[popIn_0.3s_ease-out]"
                           style={{ animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                         >
                            <Box className="w-5 h-5 mb-1" />
                            <span className="text-xs font-mono truncate max-w-full">{pod.name}</span>
                         </div>
                       ))}
                       {/* Empty Slots */}
                       {Array.from({ length: Math.max(0, MAX_PODS_PER_NODE - node.pods.length) }).map((_, i) => (
                         <div key={`empty-${i}`} className="border border-dashed border-slate-200 rounded p-2 flex items-center justify-center opacity-50">
                            <span className="text-xs text-slate-300">Empty Slot</span>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                {/* Capacity Indicator */}
                <div className="p-2 bg-slate-50 border-t border-slate-100 rounded-b-lg">
                   <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${node.pods.length >= MAX_PODS_PER_NODE ? 'bg-orange-400' : 'bg-blue-400'}`} 
                        style={{ width: `${(node.pods.length / MAX_PODS_PER_NODE) * 100}%` }}
                      ></div>
                   </div>
                   <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Capacity</span>
                      <span className="text-[10px] text-slate-500">{node.pods.length} / {MAX_PODS_PER_NODE}</span>
                   </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

       <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
