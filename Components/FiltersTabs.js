import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, Clock, Star, Tag, Bell, Sparkles } from "lucide-react";

export default function FilterTabs({ activeFilter, onFilterChange, showCounts = false, counts = {} }) {
    const filters = [
        { value: "all", label: "Todos", icon: Grid3X3 },
        { value: "recent", label: "Recentes", icon: Clock },
        { value: "featured", label: "Destaques", icon: Star },
        { value: "coupons", label: "Cupons", icon: Tag },
        { value: "alerts", label: "Alertas", icon: Bell },
    ];

    return (
        <div className="w-full overflow-x-auto">
            <Tabs value={activeFilter} onValueChange={onFilterChange} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex bg-gray-100/50 backdrop-blur-sm">
                    {filters.map((filter) => (
                        <TabsTrigger 
                            key={filter.value} 
                            value={filter.value}
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
                        >
                            <filter.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{filter.label}</span>
                            {showCounts && counts[filter.value] > 0 && (
                                <span className="ml-1 px-2 py-1 text-xs bg-white/20 rounded-full">
                                    {counts[filter.value]}
                                </span>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    );
}