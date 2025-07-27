// -website_pass_time/pages/Categories.js (Versão Final Corrigida)

import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilters";
import { Loader2, Grid3X3 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient"; // Importe o cliente Supabase

export default function Categories() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categoryCounts, setCategoryCounts] = useState({});

    // A função loadProducts foi atualizada para buscar as categorias corretamente
    const loadProducts = async () => {
        setLoading(true);
        try {
            // Usa a mesma query corrigida da página inicial
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(id, name)')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }
            
            setProducts(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // A função para calcular a contagem também foi ajustada
    const calculateCategoryCounts = () => {
        const counts = {};
        
        // Inicializa a contagem para todas as categorias conhecidas
        Object.keys(config.categoryLabels).forEach(key => { // Supondo que você tenha um config.js com os labels
            counts[key] = 0;
        });

        products.forEach(product => {
            if (product.categories && product.categories.name) {
                const categoryName = product.categories.name.toLowerCase();
                if (counts.hasOwnProperty(categoryName)) {
                    counts[categoryName]++;
                }
            }
        });

        counts.all = products.length;
        setCategoryCounts(counts);
    };

    useEffect(() => {
        if (products.length > 0) {
            calculateCategoryCounts();
        }
    }, [products]);

    // O filtro agora funciona com a nova estrutura de dados
    const filteredProducts = selectedCategory === "all" 
        ? products 
        : products.filter(product => 
            product.categories && product.categories.name.toLowerCase() === selectedCategory
          );

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    {/* ... (código de loading) ... */}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
                    Categorias
                </h1>
                <p className="text-xl text-gray-600">
                    Explore produtos organizados por categoria
                </p>
            </motion.div>

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

            {filteredProducts.length > 0 ? (
                <motion.div
                    // ... (grid de produtos) ...
                >
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            // ...
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    // ... (mensagem de "nenhum produto") ...
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