import { Clock, Zap, DollarSign } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ModelResponseCard({ modelData, isLoading }) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 px-5 py-4 animate-pulse">
                    <div className="h-5 bg-slate-200 rounded w-28"></div>
                </div>
                <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                </div>
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                    <div className="flex gap-4">
                        <div className="h-3 bg-slate-200 rounded w-16 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-slate-200 rounded w-14 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!modelData) return null;

    const { model_name, response, latency, input_tokens, output_tokens, total_cost } = modelData;

    // Map raw model names to display names
    const getDisplayName = (name) => {
        if (!name) return "Unknown Model";
        const lowerName = name.toLowerCase();
        if (lowerName.includes("claude") && lowerName.includes("sonnet")) {
            return "Claude 3.5 Sonnet";
        } else if (lowerName.includes("medgemma")) {
            return "MedGemma 4B";
        } else if (lowerName.includes("gemma")) {
            return "Gemma";
        } else if (lowerName.includes("claude")) {
            return "Claude";
        }
        return name;
    };

    const displayName = getDisplayName(model_name);
    const isClaude = model_name?.toLowerCase().includes("claude");
    const isGemma = model_name?.toLowerCase().includes("gemma") || model_name?.toLowerCase().includes("medgemma");

    // MyMR brand colors - navy blue primary
    const config = isClaude
        ? {
            headerBg: "bg-[#1e4d8c]",
            border: "border-[#1e4d8c]/20",
            accent: "text-[#1e4d8c]",
            badge: "bg-[#1e4d8c]/10 text-[#1e4d8c]",
            label: "Claude",
        }
        : isGemma
            ? {
                headerBg: "bg-[#2563eb]",
                border: "border-[#2563eb]/20",
                accent: "text-[#2563eb]",
                badge: "bg-[#2563eb]/10 text-[#2563eb]",
                label: "MedGemma",
            }
            : {
                headerBg: "bg-slate-600",
                border: "border-slate-200",
                accent: "text-slate-600",
                badge: "bg-slate-100 text-slate-700",
                label: "AI",
            };

    return (
        <div className={`bg-white rounded-lg border ${config.border} overflow-hidden transition-all duration-200 hover:shadow-md`}>
            {/* Header */}
            <div className={`${config.headerBg} px-5 py-3.5 flex items-center justify-between`}>
                <div>
                    <h3 className="text-white font-semibold text-sm tracking-tight">{displayName}</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-medium uppercase tracking-wider">
                    {config.label}
                </span>
            </div>

            {/* Response Content */}
            <div className="p-5 min-h-[120px] max-h-[350px] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="mb-3 text-slate-700 leading-relaxed text-[14px]">{children}</p>,
                            strong: ({ children }) => <strong className="text-slate-900 font-semibold">{children}</strong>,
                            li: ({ children }) => <li className="text-slate-700 mb-1.5 text-[14px]">{children}</li>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 ml-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 ml-1">{children}</ol>,
                            h1: ({ children }) => <h1 className="text-lg font-bold text-slate-900 mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-base font-bold text-slate-800 mb-2">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-800 mb-1">{children}</h3>,
                        }}
                    >
                        {response}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Metadata Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <Clock size={13} className={config.accent} />
                    <span className="text-slate-400">Latency</span>
                    <span className={`px-2 py-0.5 rounded ${config.badge} font-medium`}>
                        {latency ? `${latency.toFixed(2)}s` : "N/A"}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Zap size={13} className={config.accent} />
                    <span className="text-slate-400">Tokens</span>
                    <span className={`px-2 py-0.5 rounded ${config.badge} font-medium`}>
                        {input_tokens !== null && output_tokens !== null ? `${input_tokens}→${output_tokens}` : "N/A"}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <DollarSign size={13} className={config.accent} />
                    <span className="text-slate-400">Cost</span>
                    <span className={`px-2 py-0.5 rounded ${config.badge} font-medium`}>
                        {total_cost !== null ? `$${total_cost.toFixed(4)}` : "N/A"}
                    </span>
                </div>
            </div>
        </div>
    );
}
