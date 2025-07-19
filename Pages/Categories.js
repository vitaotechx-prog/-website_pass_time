import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { Loader2, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";

export default function Categories() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categoryCounts, setCategoryCounts] = useState({});

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        calculateCategoryCounts();
    }, [products]);

    const loadProducts = async () => {
    setLoading(true);
    try {
        const response = await fetch('/api/products');
        const allProducts = await response.json();
        setProducts(allProducts);
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
    setLoading(false);
};

    const calculateCategoryCounts = () => {
        const counts = {
            all: products.length,
            eletronicos: 0,
            casa: 0,
            moda: 0,
            esporte: 0,
            beleza: 0,
            livros: 0,
            games: 0,
            automotivo: 0,
            infantil: 0,
            outros: 0
        };

        products.forEach(product => {
            if (counts.hasOwnProperty(product.category)) {
                counts[product.category]++;
            }
        });

        setCategoryCounts(counts);
    };

    const filteredProducts = selectedCategory === "all" 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600">Carregando categorias...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Categorias
                </h1>
                <p className="text-xl text-gray-600">
                    Explore produtos organizados por categoria
                </p>
            </motion.div>

            {/* Category Filter */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
            >
                <CategoryFilter 
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    showCounts={true}
                    counts={categoryCounts}
                />
            </motion.div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <Grid3X3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum produto nesta categoria
                    </h3>
                    <p className="text-gray-600">
                        Em breve teremos produtos incríveis aqui!
                    </p>
                </motion.div>
            )}
        </div>
    );
}