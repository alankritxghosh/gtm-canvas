import { Handle, Position } from '@xyflow/react';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCanvasStore } from '@/store/useCanvasStore';

export function ActionNode({ id, data }: { id: string; data: any }) {
    const setSelectedNode = useCanvasStore((state) => state.setSelectedNode);

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => setSelectedNode({ id, data })}
            className="w-[260px] cursor-pointer rounded-xl border border-emerald-500/40 bg-zinc-950/80 backdrop-blur-md p-4 shadow-xl shadow-emerald-900/20 hover:border-emerald-400 group transition-colors"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <FileText className="h-4 w-4" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 block">Artifact</span>
                        <h4 className="text-sm font-semibold text-zinc-200 truncate pr-2 w-[150px]">{data.label || 'View Execution Artifact'}</h4>
                    </div>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors transform group-hover:translate-x-1" />
            </div>

            {data.content && (
                <p className="text-xs text-zinc-500 mt-3 line-clamp-2 overflow-hidden text-ellipsis">
                    {data.content}
                </p>
            )}

            <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-2 !h-2" />
            <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-2 !h-2" />
        </motion.div>
    );
}
