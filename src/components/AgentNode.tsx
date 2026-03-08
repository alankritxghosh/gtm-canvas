import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus, BrainCircuit, Loader2 } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import posthog from 'posthog-js';

export function AgentNode({ id, data, positionAbsoluteX, positionAbsoluteY }: any) {
    const [isGenerating, setIsGenerating] = useState(false);
    const addGeneratedNodes = useCanvasStore((state) => state.addGeneratedNodes);
    const setSelectedNode = useCanvasStore((state) => state.setSelectedNode);

    const setIsGeneratingGlobal = useCanvasStore((state) => state.setIsGenerating);
    const isGeneratingGlobalRead = useCanvasStore((state) => state.isGenerating);

    const handleCreateAction = async () => {
        setIsGenerating(true);
        setIsGeneratingGlobal(true);

        // Find the original Trigger Node input to use directly as Product Context
        const triggerNode = useCanvasStore.getState().nodes.find(n => n.type === 'trigger');
        const productContext = triggerNode?.data?.input || "SaaS Product";

        posthog.capture('agent_deep_dive_started', { pillar_name: data.label });

        try {
            const res = await fetch('/api/expand', {
                method: 'POST',
                body: JSON.stringify({
                    productContext: productContext,
                    pillarName: data.label,
                    pillarDescription: data.description,
                    parentId: id,
                    startX: positionAbsoluteX || 0,
                    startY: positionAbsoluteY || 0
                }),
            });
            if (!res.ok) {
                const errResult = await res.json().catch(() => null);
                throw new Error(errResult?.error || "API Error: Failed to expand node");
            }
            const result = await res.json();

            if (result.nodes && result.edges) {
                const idMap = new Map();

                const newNodes = result.nodes.map((n: any) => {
                    const newId = `${n.id}-${Date.now()}`;
                    idMap.set(n.id, newId);
                    return { ...n, id: newId };
                });

                const newEdges = result.edges.map((e: any) => ({
                    ...e,
                    id: `${e.id}-${Date.now()}`,
                    target: idMap.get(e.target) || e.target,
                    source: idMap.get(e.source) || e.source
                }));

                addGeneratedNodes(newNodes, newEdges);
                posthog.capture('agent_expanded', { pillar_name: data.label, action_count: result.nodes.length });
            } else {
                posthog.capture('agent_expansion_failed', { pillar_name: data.label, reason: 'empty_response' });
                toast.error("Agent overloaded. Recalibrating strategy...");
            }
        } catch (e) {
            console.error(e);
            posthog.captureException(e);
            posthog.capture('agent_expansion_failed', { pillar_name: data.label, reason: 'api_error' });
            toast.error(e instanceof Error ? e.message : "Agent overloaded. Recalibrating strategy...");
        } finally {
            setIsGenerating(false);
            setIsGeneratingGlobal(false);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => setSelectedNode({ id, data })}
            className="w-[300px] cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-xl relative group hover:border-indigo-500 transition-colors"
        >
            <div className="mb-2 flex items-center gap-2 text-indigo-400">
                <BrainCircuit className="h-4 w-4" />
                <h4 className="text-sm font-semibold text-zinc-200">{data.label}</h4>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-2">
                {data.description}
            </p>
            {data.content && (
                <p className="text-xs text-zinc-500 leading-relaxed mb-6 line-clamp-2 overflow-hidden text-ellipsis">
                    {data.content}
                </p>
            )}
            {!data.content && <div className="mb-6"></div>}

            {/* Sleek deep-dive plus button positioned at the bottom border */}
            <button
                onClick={handleCreateAction}
                disabled={isGenerating || isGeneratingGlobalRead}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-6 items-center justify-center gap-1 rounded-full border border-zinc-600 bg-zinc-800 px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-300 shadow-sm transition-all hover:bg-indigo-600 hover:border-indigo-500 hover:text-white disabled:opacity-50 active:scale-95 z-10"
            >
                {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                {isGenerating ? "EXPANDING..." : "DEEP DIVE"}
            </button>

            <Handle type="target" position={Position.Left} className="!bg-zinc-500 !w-2 !h-2" />
            <Handle type="source" position={Position.Right} className="!bg-zinc-500 !w-2 !h-2" />
            <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
            <Handle type="target" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
        </motion.div>
    );
}
