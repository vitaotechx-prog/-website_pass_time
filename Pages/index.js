
import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import FiltersTabs from "../components/FiltersTabs";
import CategoryFilters from "../components/CategoryFilters";
import CommunityLinks from "../components/CommunityLinks"; // Added import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const itemsPerPage = 12;

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, activeFilter, selectedCategory, searchQuery]);

    const loadProducts = async (isLoadMore = false) => {
    if (isLoadMore) {
        setLoadingMore(true);
    } else {
        setLoading(true);
    }

    try {
        const response = await fetch('/api/products');
        const allProducts = await response.json();

        // A lógica de "load more" precisa ser adaptada,
        // por enquanto vamos carregar todos de uma vez.
        // Podemos refinar isso depois com paginação na API.
        if (isLoadMore) {
            // Esta parte não fará nada por enquanto, mas deixamos a estrutura
            setHasMore(false);
        } else {
            setProducts(allProducts);
            setHasMore(false); // Simplificado por agora
        }
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }

    setLoading(false);
    setLoadingMore(false);
};

    const applyFilters = useCallback(() => {
        let filtered = [...products];

        // Filtro por tipo
        switch (activeFilter) {
            case "recent":
                filtered = filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                break;
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

        // Filtro por categoria
        if (selectedCategory !== "all") {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filtro por busca
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.store.toLowerCase().includes(query)
            );
        }

        setFilteredProducts(filtered);
    }, [products, activeFilter, selectedCategory, searchQuery]);

    const handleLoadMore = () => {
        loadProducts(true);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600">Carregando as melhores ofertas...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        As Melhores Ofertas
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Encontre produtos incríveis com descontos imperdíveis nas principais lojas online
                    </p>
                    
                    {/* Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Buscar produtos, marcas ou lojas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl bg-white shadow-lg"
                            />
                        </div>
                    </form>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                        <div className="bg-white rounded-2xl p-4 shadow-lg border">
                            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                            <div className="text-sm text-gray-600">Produtos</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg border">
                            <div className="text-2xl font-bold text-green-600">{products.filter(p => p.has_coupon).length}</div>
                            <div className="text-sm text-gray-600">Com Cupom</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg border">
                            <div className="text-2xl font-bold text-purple-600">{products.filter(p => p.is_featured).length}</div>
                            <div className="text-sm text-gray-600">Destaques</div>
                        </div>
                        <div className="bg-white rounded-2xl p-4 shadow-lg border">
                            <div className="text-2xl font-bold text-red-600">{products.filter(p => p.is_alert).length}</div>
                            <div className="text-sm text-gray-600">Alertas</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <CommunityLinks /> {/* Added CommunityLinks component */}

            {/* Filters */}
            <div className="space-y-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <FiltersTabs 
                        activeFilter={activeFilter} 
                        onFilterChange={setActiveFilter}
                    />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <CategoryFilters 
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </motion.div>
            </div>

            {/* Results info */}
            {(searchQuery || activeFilter !== "all" || selectedCategory !== "all") && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                >
                    <p className="text-blue-800">
                        <TrendingUp className="w-4 h-4 inline mr-2" />
                        Exibindo {filteredProducts.length} produtos
                        {searchQuery && ` para "${searchQuery}"`}
                        {activeFilter !== "all" && ` em ${activeFilter}`}
                        {selectedCategory !== "all" && ` na categoria ${selectedCategory}`}
                    </p>
                </motion.div>
            )}

            {/* Products Grid */}
            <AnimatePresence>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Tente ajustar seus filtros ou fazer uma nova busca
                        </p>
                        <Button 
                            onClick={() => {
                                setActiveFilter("all");
                                setSelectedCategory("all");
                                setSearchQuery("");
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            Limpar Filtros
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && filteredProducts.length > 0 && activeFilter === "all" && !searchQuery && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-lg"
                    >
                        {loadingMore ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Carregando mais produtos...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5 mr-2" />
                                Carregar Mais Produtos
                            </>
                        )}
                    </Button>
                </motion.div>
            )}
        </div>
    );
}
