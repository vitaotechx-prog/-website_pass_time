import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  // 1. Verificar o método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // 2. Verificar o token
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  const productData = req.body;
  
  // --- LOG DETALHADO ---
  console.log("API RECEBEU DADOS DO BOT:", JSON.stringify(productData, null, 2));

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select();

    if (error) {
      // --- LOG DO ERRO ESPECÍFICO DO SUPABASE ---
      console.error('ERRO DO SUPABASE:', error);
      throw error;
    }

    return res.status(201).json({ message: 'Produto criado com sucesso!', product: data[0] });

  } catch (error) {
    // Retorna o erro específico do Supabase no response para facilitar a depuração
    return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar produto.',
        supabase_error: error.message 
    });
  }
}