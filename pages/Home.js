import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import FilterTabs from "../components/FilterTabs";
import CategoryFilter from "../components/CategoryFilters";
import CommunityLinks from "../components/CommunityLinks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabaseClient';

// 1. BUSCA DE DADOS NO SERVIDOR (COM CACHE)
// Esta função roda no servidor antes da página ser enviada para o usuário.
export async function getStaticProps() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return { props: { initialProducts: [] } }; // Retorna um array vazio em caso de erro
  }

  return {
    props: {
      initialProducts: products, // Passa os produtos para o componente
    },
    // Revalida (busca novamente no banco) a cada 600 segundos (10 minutos)
    revalidate: 600,
  };
}

// 2. COMPONENTE DA PÁGINA
// Ele recebe 'initialProducts' como uma propriedade.
export default function Home({ initialProducts }) {
    // A lista de produtos agora vem das props, não é mais buscada no cliente
    const [filteredProducts, setFilteredProducts] = useState(initialProducts);
    
    // O resto dos estados para os filtros continua o mesmo
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // 3. LÓGICA DE FILTROS (NO NAVEGADOR)
    // Este useEffect agora roda apenas para filtrar a lista que já temos.
    useEffect(() => {
        let filtered = [...initialProducts];

        // Filtro por tipo (Destaques, Cupons, etc.)
        if (activeFilter !== "all") {
             switch (activeFilter) {
                case "featured":
                    filtered = filtered.filter(p => p.is_featured);
                    break;
                case "coupons":
                    filtered = filtered.filter(p => p.has_coupon);
                    break;
                case "alerts":
                    filtered = filtered.filter(p => p.is_alert);
                    break;
            }
        }

        // Filtro por categoria
        if (selectedCategory !== "all") {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filtro por busca de texto
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(filtered);
    }, [initialProducts, activeFilter, selectedCategory, searchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // A busca já acontece em tempo real enquanto o usuário digita
    };

    // O return (JSX) continua o mesmo, mas agora é mais rápido
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section e Barra de Busca */}
            <div className="text-center mb-12">
                {/* ... (seu JSX da Hero Section aqui) ... */}
            </div>

            <CommunityLinks />

            {/* Filtros */}
            <div className="space-y-6 mb-8">
                <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>

            {/* Grid de Produtos */}
            <AnimatePresence>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout // Anima a posição quando os filtros mudam
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                         <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-600">
                            Tente ajustar seus filtros ou fazer uma nova busca.
                        </p>
                    </div>
                )}
            </AnimatePresence>
            
            {/* O botão "Carregar Mais" foi removido pois agora carregamos tudo de uma vez no servidor */}
        </div>
    );
}