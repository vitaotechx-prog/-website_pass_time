// -website_pass_time/pages/api/product-categories/index.js

import { createClient } from '@supabase/supabase-js';

console.log("SUPABASE_SERVICE_KEY está definida?", !!process.env.SUPABASE_SERVICE_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
//Comentario só pra comitar
export default async function handler(req, res) {

  // --- BLOCO DE TESTE ---
  if (req.method === 'GET') {
    return res.status(200).json({ message: 'A rota GET está funcionando!' });
  }
  // --- FIM DO BLOCO DE TESTE ---

  if (req.method === 'POST') {
    const authToken = req.headers.authorization;
    if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
      return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    const { product_id, category_id } = req.body;
    if (!product_id || !category_id) {
      return res.status(400).json({ error: 'product_id e category_id são obrigatórios' });
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('product_categories')
        .insert({ product_id, category_id })
        .select();

      if (error) throw error;
      return res.status(201).json({ message: 'Categoria associada com sucesso!', link: data[0] });

    } catch (error) {
      console.error('Erro ao associar categoria:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao associar categoria.' });
    }
  }

  // Se não for GET nem POST, recuse
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Método ${req.method} não permitido` });
}