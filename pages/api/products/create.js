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

  const productData = req.body;

  // 3. Validação básica
  if (!productData.name || !productData.price || !productData.affiliate_url) {
    return res.status(400).json({ error: 'Dados incompletos do produto' });
  }

  try {
    // 4. Inserir o produto no Supabase e declarar a variável 'newProductData'
    const { data: newProductData, error: insertError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single(); // Usamos .single() para garantir que recebemos um objeto

    if (insertError) {
      console.error('Erro do Supabase ao inserir:', insertError);
      throw insertError; // Lança o erro para ser pego pelo bloco catch
    }

    console.log('Produto criado com sucesso!', newProductData.id);

    // 5. Lógica de Notificação de Alerta (usa newProductData após ser criada)
    const productName = newProductData.name.toLowerCase();
    
    // Busca por alertas correspondentes
    const { data: matchingAlerts, error: alertError } = await supabase
      .from('product_alerts')
      .select('search_term, profiles(id, email)') // Busca o email do perfil relacionado
      .filter('is_active', 'eq', true);

    if (alertError) {
      console.error("Erro ao buscar alertas:", alertError);
    } else if (matchingAlerts && matchingAlerts.length > 0) {
      const usersToNotify = matchingAlerts.filter(alert => 
        productName.includes(alert.search_term.toLowerCase())
      );
      
      if (usersToNotify.length > 0) {
        console.log(`Encontrados ${usersToNotify.length} utilizadores para notificar.`);
        // Aqui entraria a lógica para enviar o e-mail
        // Ex: await sendEmailNotifications(usersToNotify, newProductData);
      }
    }

    // 6. Retornar sucesso
    return res.status(201).json({ message: 'Produto criado com sucesso!', product: newProductData });

  } catch (error) {
    console.error('Erro no bloco try/catch da API create.js:', error);
    return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar produto.',
        // Retorna a mensagem de erro específica para depuração
        supabase_error: error.message 
    });
  }
}