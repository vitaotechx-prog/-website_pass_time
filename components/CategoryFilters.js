import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Importe os ícones e labels do novo arquivo de configuração
import { categoryIcons, categoryLabels } from "@/config/categories";
import { Grid3X3 } from "lucide-react"; // Mantenha este se não estiver no config


export default function CategoryFilter({ 
    selectedCategory, 
    onCategoryChange, 
    showCounts = false, 
    counts = {} 
}) {
    // A lógica interna do componente continua exatamente a mesma.
    const categories = Object.keys(categoryLabels);

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => onCategoryChange("all")}
                className={`flex items-center gap-2 ${
                    selectedCategory === "all" 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                        : ""
                }`}
            >
                <Grid3X3 className="w-4 h-4" />
                Todas
                {showCounts && counts.all > 0 && (
                    <Badge variant="secondary" className="ml-1">
                        {counts.all}
                    </Badge>
                )}
            </Button>
            
            {categories.map((category) => {
                const IconComponent = categoryIcons[category];
                return (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => onCategoryChange(category)}
                        className={`flex items-center gap-2 ${
                            selectedCategory === category 
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                                : ""
                        }`}
                    >
                        <IconComponent className="w-4 h-4" />
                        <span className="hidden sm:inline">{categoryLabels[category]}</span>
                        <span className="sm:hidden">{categoryLabels[category].split(' ')[0]}</span>
                        {showCounts && counts[category] > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {counts[category]}
                            </Badge>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}