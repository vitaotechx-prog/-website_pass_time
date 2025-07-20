
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Tag, ExternalLink, Zap, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { createPageUrl } from "@/utils";
import ShareButton from './ShareButton';

const storeColors = {
    amazon: "bg-orange-100 text-orange-800",
    mercadolivre: "bg-yellow-100 text-yellow-800", 
    shopee: "bg-red-100 text-red-800",
    aliexpress: "bg-pink-100 text-pink-800",
    magalu: "bg-blue-100 text-blue-800",
    casasbahia: "bg-purple-100 text-purple-800",
    outros: "bg-gray-100 text-gray-800"
};

export default function ProductCard({ product, className = "" }) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(createPageUrl(`ProductDetail?id=${product.id}`));
    };

    const handleButtonClick = (e) => {
        e.stopPropagation(); // Prevent the card's handleCardClick from firing
        window.open(product.affiliate_url, '_blank');
    };

    const discountPercentage = product.original_price 
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : product.discount_percentage;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden bg-white h-full flex flex-col"
                  onClick={handleCardClick}>
                <div className="relative">
                    <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Badges overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.has_coupon && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                                <Tag className="w-3 h-3 mr-1" />
                                CUPOM
                            </Badge>
                        )}
                        
                        {product.is_featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                                <Star className="w-3 h-3 mr-1" />
                                DESTAQUE
                            </Badge>
                        )}
                        
                        {product.is_alert && (
                            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                                <Zap className="w-3 h-3 mr-1" />
                                ALERTA
                            </Badge>
                        )}
                    </div>

                    {/* Discount badge */}
                    {discountPercentage > 0 && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold shadow-lg">
                                -{discountPercentage}%
                            </Badge>
                        </div>
                    )}

                    {/* Store badge */}
                    <div className="absolute bottom-3 right-3">
                        <Badge className={`${storeColors[product.store]} font-medium`}>
                            {product.store.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors flex-grow">
                        {product.name}
                    </h3>
                    
                    {/* Rating */}
                    {product.rating && (
                        <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`w-4 h-4 ${
                                        i < Math.floor(product.rating) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`} 
                                />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                                ({product.rating.toFixed(1)})
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between my-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-600">
                                    R$ {product.price.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                            {product.original_price && product.original_price > product.price && (
                                <span className="text-sm text-gray-500 line-through">
                                    R$ {product.original_price.toFixed(2).replace('.', ',')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-auto">
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                            onClick={handleButtonClick}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver Oferta
                        </Button>
                        <ShareButton
                            productName={product.name}
                            productUrl={createPageUrl(`ProductDetail?id=${product.id}`)}
                        />
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-xs text-gray-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1">
                            <MessageSquare className="w-3 h-3"/>
                            Ver detalhes e comentários
                        </span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
