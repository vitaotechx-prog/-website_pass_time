import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
    Smartphone, 
    Home, 
    Tv2,
    REFRIGERATOR,
    Shirt, 
    Dumbbell, 
    Sparkles, 
    BookOpen, 
    Gamepad2, 
    Car, 
    Baby,
    Grid3X3

} from "lucide-react";

const categoryIcons = {
    eletronicos: Smartphone,
    eletrodomesticos: Tv2,
    casa: Home,
    moda: Shirt,
    esporte: Dumbbell,
    beleza: Sparkles,
    livros: BookOpen,
    games: Gamepad2,
    automotivo: Car,
    infantil: Baby,
    outros: Grid3X3
};

const categoryLabels = {
    eletronicos: "Eletrônicos",
    eletrodomesticos : "Eletrodomésticos",
    casa: "Casa & Construção",
    moda: "Moda",
    esporte: "Esporte",
    beleza: "Beleza",
    livros: "Livros",
    games: "Games",
    automotivo: "Automotivo",
    infantil: "Infantil",
    outros: "Outros"
};

export default function CategoryFilter({ 
    selectedCategory, 
    onCategoryChange, 
    showCounts = false, 
    counts = {} 
}) {
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