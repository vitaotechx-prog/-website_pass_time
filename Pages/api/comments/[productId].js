import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  const { productId } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId) // Filtra comentários pelo ID do produto
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { content, user_name } = req.body;
    const { data, error } = await supabase
      .from('comments')
      .insert([{ product_id: productId, content, user_name }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}