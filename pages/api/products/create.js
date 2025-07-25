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

    if (!productData.name || !productData.price || !productData.affiliate_url) {
      return res.status(400).json({ error: 'Dados incompletos do produto' });
    }

    try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single(); // Retorna o objeto único

      if (error) throw error;

      const newProduct = newProductData[0];
      console.log('Produto criado com sucesso!', newProduct.id);

      // --- LÓGICA DE NOTIFICAÇÃO DE ALERTA ---
      const productName = newProduct.name.toLowerCase();

      // Busca por alertas cujo 'search_term' esteja contido no nome do novo produto
      const { data: matchingAlerts, error: alertError } = await supabase
          .from('product_alerts')
          .select(`
              search_term,
              profiles ( id, email ) 
          `)
          .filter('is_active', 'eq', true)
          .ilike('search_term', `%${productName.split(' ')[0]}%`); // Exemplo simples de busca
          // Para uma busca mais avançada, pode-se usar full-text search do Postgres

      if (alertError) {
          console.error("Erro ao buscar alertas:", alertError);
      } else if (matchingAlerts && matchingAlerts.length > 0) {
          console.log(`Encontrados ${matchingAlerts.length} alertas para o produto ${newProduct.name}`);

          // Aqui entraria a lógica para enviar o e-mail
          // Ex: await sendEmailNotification(matchingAlerts, newProduct);
      }
      // --- FIM DA LÓGICA DE NOTIFICAÇÃO ---

      return res.status(201).json({ message: 'Produto criado com sucesso!', product: newProduct });
    
  }catch (error) {
    // Retorna o erro específico do Supabase no response para facilitar a depuração
    return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar produto.',
        supabase_error: error.message 
    });
  }
}
