import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { filter } = req.query; // Ex: /api/products?filter=featured
    let query = supabase.from('products').select('*').order('created_at', { ascending: false });

    if (filter === 'featured') {
      query = query.eq('is_featured', true);
    }
    if (filter === 'coupons') {
      query = query.eq('has_coupon', true);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}