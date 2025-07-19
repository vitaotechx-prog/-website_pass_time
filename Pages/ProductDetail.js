
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Product } from "@/entities/Product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Comments from "../components/Comments";
import { Star, Tag, ExternalLink, Zap, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const storeColors = {
    amazon: "bg-orange-100 text-orange-800",
    mercadolivre: "bg-yellow-100 text-yellow-800",
    shopee: "bg-red-100 text-red-800",
    aliexpress: "bg-pink-100 text-pink-800",
    magalu: "bg-blue-100 text-blue-800",
    casasbahia: "bg-purple-100 text-purple-800",
    outros: "bg-gray-100 text-gray-800"
};

export default function ProductDetail() {
    const location = useLocation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const params = new URLSearchParams(location.search);
            const productId = params.get('id');
            if (productId) {
                try {
                    const fetchedProduct = await Product.get(productId); // Changed from Product.find to Product.get
                    setProduct(fetchedProduct);
                } catch (error) {
                    console.error("Erro ao buscar produto:", error);
                }
            }
            setLoading(false);
        };
        fetchProduct();
    }, [location.search]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Produto não encontrado</h2>
                <Link to={createPageUrl("Home")}>
                    <Button className="mt-4">Voltar para a página inicial</Button>
                </Link>
            </div>
        );
    }

    const discountPercentage = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : product.discount_percentage;
    
    return (
        <div className="container mx-auto px-4 py-8">
             <Link to={createPageUrl("Home")} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Voltar para ofertas
            </Link>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image Gallery */}
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-auto object-cover"
                        />
                         <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.has_coupon && (
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                                    <Tag className="w-3 h-3 mr-1" />
                                    CUPOM
                                </Badge>
                            )}
                            {discountPercentage > 0 && (
                                <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold shadow-lg">
                                    -{discountPercentage}%
                                </Badge>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Product Details */}
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                    <Badge className={`${storeColors[product.store]} font-medium mb-2`}>
                        {product.store.toUpperCase()}
                    </Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    
                    {product.rating && (
                        <div className="flex items-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-5 h-5 ${
                                        i < Math.floor(product.rating) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            ))}
                            <span className="text-md text-gray-600 ml-2 font-semibold">
                                {product.rating.toFixed(1)} de 5 estrelas
                            </span>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        {product.original_price && product.original_price > product.price && (
                            <span className="text-lg text-gray-500 line-through mr-3">
                                R$ {product.original_price.toFixed(2).replace('.', ',')}
                            </span>
                        )}
                        <span className="text-4xl font-extrabold text-green-600">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    {product.has_coupon && product.coupon_code && (
                        <div className="mb-6 p-4 bg-green-50 border-2 border-dashed border-green-200 rounded-lg text-center">
                            <p className="text-green-700 font-medium">Use o cupom:</p>
                            <p className="font-bold text-2xl text-green-800 tracking-widest">{product.coupon_code}</p>
                        </div>
                    )}

                    <Button
                        asChild
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg py-7 rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-5 h-5 mr-3" />
                            Ver Oferta na {product.store.charAt(0).toUpperCase() + product.store.slice(1)}
                        </a>
                    </Button>
                </motion.div>
            </div>
            
            <Comments productId={product.id} />
        </div>
    );
}
