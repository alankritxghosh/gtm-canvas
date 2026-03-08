import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
} from "@xyflow/react";

export type AppNode = Node;

export type CanvasState = {
    nodes: AppNode[];
    edges: Edge[];
    onNodesChange: OnNodesChange<AppNode>;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addNodes: (nodes: AppNode[]) => void;
    addEdges: (edges: Edge[]) => void;
    addGeneratedNodes: (nodes: AppNode[], edges: Edge[]) => void;
    updateNodeData: (nodeId: string, data: any) => void;
    selectedNode: any | null;
    setSelectedNode: (node: any | null) => void;
    isGenerating: boolean;
    setIsGenerating: (isGenerating: boolean) => void;
};

export const useCanvasStore = create<CanvasState>()(
    persist(
        (set, get) => ({
            nodes: [
                {
                    id: "trigger",
                    type: "trigger",
                    position: { x: 400, y: 300 },
                    data: { input: "" },
                },
            ],
            edges: [],
            onNodesChange: (changes: NodeChange<AppNode>[]) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                });
            },
            onEdgesChange: (changes: EdgeChange[]) => {
                set({
                    edges: applyEdgeChanges(changes, get().edges),
                });
            },
            onConnect: (connection: Connection) => {
                set({
                    edges: addEdge(connection, get().edges),
                });
            },
            addNodes: (nodes: AppNode[]) => {
                set({ nodes: [...get().nodes, ...nodes] });
            },
            addEdges: (edges: Edge[]) => {
                set({ edges: [...get().edges, ...edges] });
            },
            addGeneratedNodes: (nodes: AppNode[], edges: Edge[]) => {
                set({ nodes: [...get().nodes, ...nodes], edges: [...get().edges, ...edges] });
            },
            updateNodeData: (nodeId: string, data: any) => {
                set({
                    nodes: get().nodes.map((node) =>
                        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
                    )
                });
            },
            selectedNode: null,
            setSelectedNode: (node) => set({ selectedNode: node }),
            isGenerating: false,
            setIsGenerating: (isGenerating) => set({ isGenerating }),
        }),
        {
            name: "canvas-storage",
            partialize: (state) => ({ nodes: state.nodes, edges: state.edges }),
        }
    )
);
