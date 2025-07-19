import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  const { id } = req.query; // Pega o id da URL

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id) // Procura pelo produto com este id
      .single(); // Retorna um único objeto em vez de uma lista

    if (error) {
      return res.status(500).json({ error: 'Produto não encontrado ou erro no servidor.' });
    }

    if (data) {
      return res.status(200).json(data);
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}