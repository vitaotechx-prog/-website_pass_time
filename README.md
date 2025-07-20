# -website_pass_time
Project to pass the time and learn and improve my knowledge.
🚀 Documentação Completa do Projeto: VitaoTech
1. Visão Geral e Arquitetura
O VitaoTech é uma aplicação web moderna construída com a Arquitetura JAMstack, que favorece a velocidade, segurança e escalabilidade.

Front-End: Next.js (um framework React) é usado para construir a interface do usuário. As páginas são renderizadas de forma dinâmica e a navegação é extremamente rápida.

Estilização: Tailwind CSS é utilizado para criar um design moderno e responsivo de forma ágil, diretamente no código HTML/JSX. Os componentes de base são fornecidos pelo shadcn/ui.

Back-End (API): O próprio Next.js, através das API Routes (pages/api), funciona como um back-end leve (serverless). Ele serve como um intermediário seguro entre o front-end e o banco de dados.

Banco de Dados: Supabase é o banco de dados PostgreSQL que armazena todas as informações dos produtos e comentários. O front-end nunca se comunica diretamente com o Supabase; ele sempre passa pela nossa API para mais segurança.

2. Diagrama de Componentes (Front-End)
Este diagrama mostra como os principais componentes React se encaixam para formar a interface do seu site.

Snippet de código

graph TD
    A["pages/_app.js (Molde Principal)"] --> B["Layout.js (Cabeçalho e Rodapé)"];
    B --> C["Páginas (ex: pages/index.js)"];

    subgraph "Página Principal (index.js)"
        C --> D[FilterTabs];
        C --> E[CategoryFilter];
        C --> F[ProductCard];
        C --> G[CommunityLinks];
    end

    subgraph "Componentes de UI (components/ui)"
        F --> H[Card];
        F --> I[Button];
        F --> J[Badge];
        D --> I;
        E --> I;
    end

    style A fill:#7e22ce,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#9333ea,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#a855f7,stroke:#fff,stroke-width:2px,color:#fff
Como ler o diagrama:

Tudo começa no _app.js, que é o arquivo que define a estrutura geral.

Ele carrega o Layout.js, que adiciona o cabeçalho e o rodapé.

Dentro do Layout, a página atual (como a index.js) é renderizada.

A página index.js, por sua vez, é construída a partir de componentes menores e reutilizáveis, como os ProductCard e os filtros.

3. Diagrama de Fluxo de Dados (Full-Stack)
Este diagrama ilustra o caminho completo que os dados percorrem, desde a solicitação do usuário até a exibição na tela.

Snippet de código

sequenceDiagram
    participant User as Usuário (Navegador)
    participant FrontEnd as Front-End (React/Next.js)
    participant API as Back-End (API Routes)
    participant DB as Banco de Dados (Supabase)

    User->>+FrontEnd: 1. Acessa a página inicial

    FrontEnd->>+API: 2. Requisição GET para /api/products

    API->>+DB: 3. Consulta "SELECT * FROM products"

    DB-->>-API: 4. Retorna a lista de produtos

    API-->>-FrontEnd: 5. Retorna os produtos em formato JSON

    FrontEnd-->>-User: 6. Renderiza os produtos na tela

    %% Fluxo de Adicionar Comentário
    User->>+FrontEnd: 7. Envia um novo comentário

    FrontEnd->>+API: 8. Requisição POST para /api/comments/[id] com os dados

    API->>+DB: 9. Insere o novo comentário "INSERT INTO comments..."

    DB-->>-API: 10. Confirma a inserção

    API-->>-FrontEnd: 11. Retorna sucesso

    FrontEnd->>FrontEnd: 12. Atualiza a lista de comentários na tela
Como ler o diagrama:

O fluxo mostra que o Front-End nunca acessa o Banco de Dados diretamente. Isso é crucial para a segurança, pois suas chaves secretas do banco de dados ficam protegidas no back-end.

O Back-End (API Routes) atua como um porteiro, validando as solicitações e buscando as informações necessárias.

4. Dicionário de Arquivos e Funções
Aqui está um guia de referência rápido para os arquivos mais importantes do projeto.

Arquivo/Pasta	Propósito	Exemplo de Uso
pages/_app.js	Arquivo mestre da aplicação. Carrega estilos globais e o layout principal para todas as páginas.	Adicionar o <Layout> para que todas as páginas tenham cabeçalho e rodapé.
pages/index.js	Página inicial. Contém a lógica para buscar e exibir a lista de produtos, além de gerenciar os filtros.	Onde o useEffect chama fetch('/api/products').
pages/api/**	Seu Back-End. Pontos de acesso (endpoints) que o front-end chama para interagir com o banco de dados.	pages/api/products/[id].js busca um produto específico no Supabase.
components/**	Componentes Reutilizáveis. Peças da interface que são usadas em várias páginas.	ProductCard.js é usado na página inicial, na de categorias, etc.
Layout.js	Estrutura Visual Principal. Define o cabeçalho, o rodapé e onde o conteúdo da página será inserido.	Contém a tag <header> com o logo e o menu, e o <footer>.
lib/supabaseClient.js	Conexão com o Banco de Dados. Onde a conexão com o Supabase é inicializada com suas chaves de API.	É importado pelos seus arquivos da pasta pages/api.
.env.local	Segredos e Chaves. Arquivo para armazenar suas chaves de API do Supabase de forma segura no ambiente local. Nunca deve ser enviado para o GitHub.	NEXT_PUBLIC_SUPABASE_URL=...
tailwind.config.js	Configuração do Tailwind. Define as configurações de design e, crucialmente, informa ao Tailwind quais arquivos monitorar para gerar os estilos.	A seção content foi ajustada para incluir o Layout.js.

Exportar para as Planilhas
