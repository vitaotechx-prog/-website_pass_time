import { supabase } from '@/lib/supabaseClient';

// Lista de lojas permitidas, espelhando seu ENUM
const allowedStores = ['amazon', 'mercadolivre', 'shopee', 'aliexpress', 'magalu', 'casasbahia', 'outros'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  const authToken = req.headers.authorization;
  if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
    return res.status(401).json({ error: 'Acesso não autorizado' });
  }

  const productData = req.body;

  // --- VALIDAÇÃO ADICIONADA AQUI ---
  if (productData.store && !allowedStores.includes(productData.store)) {
    return res.status(400).json({ 
      error: `Valor de loja inválido: '${productData.store}'. Use um dos seguintes: ${allowedStores.join(', ')}`
    });
  }
  // --- FIM DA VALIDAÇÃO ---

  try {
    const { data: newProductData, error: insertError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Lógica de Notificação de Alerta
    // CORREÇÃO: Usar a variável correta 'newProductData' em vez de 'newProduct'
    const productName = newProductData.name.toLowerCase();
    
    const { data: matchingAlerts, error: alertError } = await supabase
      .from('product_alerts')
      .select('search_term, profiles(id, email)')
      .filter('is_active', 'eq', true);

    if (alertError) {
      console.error("Erro ao buscar alertas:", alertError);
    } else if (matchingAlerts && matchingAlerts.length > 0) {
      const usersToNotify = matchingAlerts.filter(alert => 
        productName.includes(alert.search_term.toLowerCase())
      );
      if (usersToNotify.length > 0) {
        console.log(`Encontrados ${usersToNotify.length} usuários para notificar.`);
        // Futuramente, a lógica de envio de e-mail entra aqui
      }
    }

    return res.status(201).json({ message: 'Produto criado com sucesso!', product: newProductData });

  } catch (error) {
    console.error('Erro na API create.js:', error);
    return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar produto.',
        supabase_error: error.message 
    });
  }
}