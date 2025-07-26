// pages/api/product-categories/index.js
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
 // 2. Verificar o token
    const authToken = req.headers.authorization;
    if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
      return res.status(401).json({ error: 'Acesso não autorizado' });
    }

  const { product_id, category_id } = req.body;

  if (!product_id || !category_id) {
    return res.status(400).json({ error: 'product_id e category_id são obrigatórios' });
  }

  try {
    const { data, error } = await supabase
      .from('product_categories')
      .insert({ product_id, category_id })
      .select();

    if (error) {
        if (error.code === '23505') {
          return res.status(200).json({ message: 'Ligação já existente.' });
      }
      throw error;
    }

    return res.status(201).json({ message: 'Categoria associada com sucesso!', link: data[0] });
  } catch (error) {
    // Se o erro for de violação de chave primária (23505), significa que a ligação já existe.
    
    console.error('Erro ao associar categoria:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao associar categoria.' });
  }
}