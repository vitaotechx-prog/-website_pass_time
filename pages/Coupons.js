import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Loader2, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function Coupons() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Alteração: Passar o filtro diretamente para a API
                const response = await fetch('/api/products?filter=coupons');
                const couponProducts = await response.json();
                setProducts(couponProducts);
            } catch (error) {
                console.error("Erro ao carregar produtos com cupom:", error);
            }
            setLoading(false);
        };
        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-64">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                        <p className="text-gray-600">Carregando cupons...</p>
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
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
                    Cupons de Desconto
                </h1>
                <p className="text-xl text-gray-600">
                    Produtos com cupons especiais para economizar ainda mais
                </p>
            </motion.div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {products.map((product, index) => (
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
                    <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum cupom disponível
                    </h3>
                    <p className="text-gray-600">
                        Em breve teremos cupons incríveis aqui!
                    </p>
                </motion.div>
            )}
        </div>
    );
}