import { motion } from 'framer-motion';

export function GhostNode({ id }: { id?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-[300px] h-[150px] rounded-xl border border-zinc-700/50 bg-zinc-900/50 p-4 shadow-xl relative"
        >
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-zinc-700 h-10 w-10"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-zinc-700 rounded w-5/6"></div>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-2 bg-zinc-700 rounded col-span-2"></div>
                            <div className="h-2 bg-zinc-700 rounded col-span-1"></div>
                        </div>
                        <div className="h-2 bg-zinc-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 rounded-xl rounded-xl ring-1 ring-inset ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-pulse" />
        </motion.div>
    );
}
