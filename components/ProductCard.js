import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Tag, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { createPageUrl, timeAgo } from "@/utils"; //timeAgo
import { Clock } from "lucide-react"; // Importe o ícone de relógio

const storeColors = {
    amazon: "bg-orange-100 text-orange-800",
    mercadolivre: "bg-yellow-100 text-yellow-800",
    shopee: "bg-red-100 text-red-800",
    aliexpress: "bg-pink-100 text-pink-800",
    magalu: "bg-blue-100 text-blue-800",
    casasbahia: "bg-purple-100 text-purple-800",
    outros: "bg-gray-100 text-gray-800"
};

export default function ProductCard({ product }) {
    const router = useRouter();

    // Função para navegar para a página de detalhes
    const handleCardClick = () => {
        router.push(createPageUrl(`ProductDetail?id=${product.id}`));
    };

    const discountPercentage = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;

    const postedTime = timeAgo(product.created_at); // Chama a nova função timeAgo

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="h-full"
            onClick={handleCardClick} // O clique é no card todo
        >
            <Card className="group cursor-pointer border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white h-full flex flex-col">
                <div className="relative">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Badges (cupom, destaque, etc.) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.has_coupon && ( <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"><Tag className="w-3 h-3 mr-1" />CUPOM</Badge> )}
                        {product.is_featured && ( <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"><Star className="w-3 h-3 mr-1" />DESTAQUE</Badge> )}
                        {product.is_alert && ( <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse"><Zap className="w-3 h-3 mr-1" />ALERTA</Badge> )}
                    </div>
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold shadow-lg">-{discountPercentage}%</Badge>
                        </div>
                    )}
                    <div className="absolute bottom-3 right-3">
                        <Badge className={`${storeColors[product.store]} font-medium`}>{product.store?.toUpperCase()}</Badge>
                    </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors flex-grow">
                        {product.name}
                    </h3>
                    
                    {/* Preço */}
                    <div className="flex flex-col my-4">
                        <span className="text-2xl font-bold text-green-600">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                                R$ {product.original_price.toFixed(2).replace('.', ',')}
                            </span>
                        )}
                    </div>

                    {/* Indicador de ação no rodapé */}
                    <div className="mt-auto pt-2 border-t border-gray-100 text-center">
                        <span className="text-sm font-semibold text-blue-600 group-hover:underline">
                            Ver Detalhes e Comentários
                        </span>
                    </div>

                    {/* NOVO: Carimbo de Tempo */}
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Clock className="w-3 h-3 mr-1.5" />
                        <span>Postado {postedTime}</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}