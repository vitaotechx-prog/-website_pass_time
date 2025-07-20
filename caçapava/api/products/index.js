import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }); // Ordena por mais recente

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }
  // Você pode adicionar lógica para POST, PUT, etc. aqui depois
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}