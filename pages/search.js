// -website_pass_time/pages/search.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../Layout';
import ProductCard from '../components/ProductCard';
import { Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      setResults([]);
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Resultados para: <span className="text-blue-600">"{q}"</span>
      </h1>

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(product => (
            <motion.div key={product.id} layout>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && q && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600">
            Tente buscar por outros termos. Sua busca foi registrada e vamos procurar por ela!
          </p>
        </div>
      )}
    </div>
  );
}

SearchPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};