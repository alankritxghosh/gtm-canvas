"use client";

import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, NodeTypes } from '@xyflow/react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { TriggerNode } from '@/components/TriggerNode';
import { AgentNode } from '@/components/AgentNode';
import { ActionNode } from '@/components/ActionNode';
import { SidePanel } from '@/components/SidePanel';
import { GhostNode } from '@/components/GhostNode';
import { PostHogProvider } from '@/components/PosthogProvider';

export default function CanvasPage() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, isGenerating } = useCanvasStore();

  const nodeTypes: NodeTypes = useMemo(() => ({ trigger: TriggerNode, agent: AgentNode as any, action: ActionNode }), []);

  return (
    <main className="h-screen w-screen bg-black overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
      >
        <Background gap={16} size={1} color="#333" />
        <Controls />
        <MiniMap nodeStrokeColor="#4f46e5" nodeColor="#18181b" maskColor="rgba(0, 0, 0, 0.7)" />
      </ReactFlow>

      {/* Ghost Nodes overlay when generating */}
      {isGenerating && (
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center p-8 mt-20 gap-8 opacity-70">
          <GhostNode />
          <GhostNode />
          <GhostNode />
        </div>
      )}

      <SidePanel />
      <PostHogProvider />
    </main>
  );
}
