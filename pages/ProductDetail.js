import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Comments from "../components/Comments"; 
import ShareButton from "../components/ShareButton"; 
import { Star, Tag, ExternalLink, Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
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
    const router = useRouter();
    const { id: productId } = router.query;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) throw new Error("Produto não encontrado.");
                const fetchedProduct = await response.json();
                setProduct(fetchedProduct);
            } catch (err) {
                console.error("Erro ao buscar produto:", err);
                setError(err.message);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-blue-600" /></div>;
    }

    if (error || !product) {
        return (
            <div className="text-center py-20">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">{error ? "Ocorreu um Erro" : "Produto não encontrado"}</h2>
                <p className="text-gray-600 mb-6">{error || "Não conseguimos encontrar o produto que você está procurando."}</p>
                <Link href={createPageUrl("index")}>
                    <Button>Voltar para a página inicial</Button>
                </Link>
            </div>
        );
    }

    const discountPercentage = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href={createPageUrl("index")} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                Voltar para ofertas
            </Link>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Coluna da Imagem */}
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                        <img src={product.image_url} alt={product.name} className="w-full h-auto object-cover" />
                        {/* Badges aqui */}
                    </div>
                </motion.div>

                {/* Coluna de Detalhes */}
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                    <Badge className={`${storeColors[product.store]} font-medium mb-2`}>{product.store?.toUpperCase()}</Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-6">{product.description || "Descrição não disponível."}</p>
                    
                    {/* Preço */}
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-green-600">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                        {product.original_price && (
                            <span className="text-lg text-gray-500 line-through ml-3">R$ {product.original_price.toFixed(2).replace('.', ',')}</span>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-3">
                         <Button asChild size="lg" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-7 rounded-xl shadow-lg transition-transform hover:scale-105">
                            <a href={product.affiliate_url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-5 h-5 mr-3" />
                                Ir para a Oferta
                            </a>
                        </Button>
                        <ShareButton productName={product.name} productUrl={createPageUrl(`ProductDetail?id=${product.id}`)} />
                    </div>
                </motion.div>
            </div>
            
            <Comments productId={product.id} />
        </div>
    );
}