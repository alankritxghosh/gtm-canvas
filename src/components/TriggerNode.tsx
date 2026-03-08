import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import posthog from 'posthog-js';

export function TriggerNode({ id, data }: { id: string, data: any }) {
    const updateNodeData = useCanvasStore((state) => state.updateNodeData);
    const addGeneratedNodes = useCanvasStore((state) => state.addGeneratedNodes);
    const setIsGeneratingGlobal = useCanvasStore((state) => state.setIsGenerating);
    const isGeneratingGlobalRead = useCanvasStore((state) => state.isGenerating);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!data.input) return;
        setIsGenerating(true);
        setIsGeneratingGlobal(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ input: data.input }),
            });
            if (!res.ok) {
                const errResult = await res.json().catch(() => null);
                throw new Error(errResult?.error || "API Error: Failed to generate strategy");
            }
            const result = await res.json();

            if (result.nodes && result.edges) {
                const idMap = new Map();

                // Assign unique IDs across the board
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
                posthog.capture('strategy_generated', { input_length: data.input.length, pillar_count: result.nodes.length });
            } else {
                posthog.capture('strategy_generation_failed', { reason: 'empty_response', input_length: data.input.length });
                toast.error("Agent overloaded. Recalibrating strategy...");
            }
        } catch (e) {
            console.error(e);
            posthog.captureException(e);
            posthog.capture('strategy_generation_failed', { reason: 'api_error', input_length: data.input.length });
            toast.error(e instanceof Error ? e.message : "Agent overloaded. Recalibrating strategy...");
        } finally {
            setIsGenerating(false);
            setIsGeneratingGlobal(false);
        }
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[400px] rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl relative"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-medium text-zinc-100">GTM Engine</h3>
                </div>
            </div>

            <div className="mb-4">
                <textarea
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm text-zinc-300 placeholder-zinc-500 hover:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                    rows={4}
                    placeholder="Paste your scrappy product idea, feature spec, or link here..."
                    value={data.input || ""}
                    onChange={(e) => updateNodeData(id, { input: e.target.value })}
                />
            </div>

            {!data.input && (
                <button
                    onClick={() => {
                        updateNodeData(id, { input: "A B2B SaaS platform for AI-driven customer support automation, featuring semantic search, real-time agent handoff, and CRM integration." });
                        posthog.capture('example_input_used');
                    }}
                    className="mb-4 w-full flex items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-medium text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all hover:bg-indigo-500/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                >
                    <Sparkles className="h-3 w-3" />
                    Try an Example
                </button>
            )}

            <button
                onClick={handleGenerate}
                disabled={isGenerating || isGeneratingGlobalRead || !data.input}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-[0.98]"
            >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Strategy"}
            </button>

            <Handle type="source" position={Position.Right} className="!bg-indigo-500 !w-3 !h-3" />
            <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3" />
            <Handle type="source" position={Position.Top} className="!bg-indigo-500 !w-3 !h-3" />
            <Handle type="source" position={Position.Left} className="!bg-indigo-500 !w-3 !h-3" />
        </motion.div>
    );
}
