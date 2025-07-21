import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
    // Verifica se o methodo e POST
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Método não permitido.'});
    }
}

    // Verificar token secret autorização
const authToken = req.header.authorization;
if (authToken !== `Bearer ${process.env.BOT_SECRET_TOKEN}`) {
    return res.status(401).json({error: 'Acesso não autorizado.'});
} 
    // Pegar os dados do produto do corpo da requisição
const productData = req.body;

    // Validação para garantir que dados essenciais existem
if (!productData.name || !productData.price || productData.affiliate_url) {
    return res.status(400).json({erroir: "Dados incompletos do produto."})
}

    
try {
    // Inserir o produto no banco de dados Supabase
    const {data, error} = await supabase
        .from('products')
        .insert('[productData]')
        .select();
    if (error) {
        throw error;
    }

    // Retornar Sucesso
    return res.status(201).json({message: 'Produto criado com sucesso', product: data[0]});

}catch (error) {
    console.error('Erro ao inserir produto:', error);
    return res.status(500).jason({error: 'Erro interno do servidor ao criar produto.'});
}