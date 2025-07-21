import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  // 1. Verificar se o método é POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 2. Verificar o token secreto de autorização
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  // 3. Pegar os dados do produto do corpo da requisição
  const productData = req.body;

  // 4. Validação básica (garantir que dados essenciais existem)
  if (!productData.name || !productData.price || !productData.affiliate_url) {
    return res.status(400).json({ error: 'Dados incompletos do produto' });
  }

  try {
    // 5. Inserir o produto no banco de dados Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) {
      throw error;
    }

    // 6. Retornar sucesso
    return res.status(201).json({ message: 'Produto criado com sucesso!', product: data[0] });

  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao criar produto.' });
  }
}