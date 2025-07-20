# Site: Vitaotech!

Project to pass the time and learn and improve my knowledge.


# 🚀 Documentação Completa do Projeto: VitaoTech


## 1. Visão Geral e Arquitetura

O site VitaoTech é uma aplicação web moderna construida com a Arquitetura JAMstack, que favorece a velocidade, segurança e escalabilidadde.

- **Fron-End: Next.js:** É usado para construir a interface de usuario. As páginas são renderizadas de forma dinânica e a navegação é extremamente rápida. (Framework React)

- **EWstilização: Tailwind CSS** É usado para criar um design moderno e responsivo de forma ágil, diretamente no código HTML/JSX. Os componentes de base são fornecidos pelo **shadcn**.

- **Back-End (API):** O próprio **Next.js**, através das **API Routes**, funciona como um back-end leve(serveless). Ele serve como um intermediário seguro entre o front e o Banco de Dados.

- **Banco de Dados: Supabase** é o banco de dados PostgreSQL que armazena todas as informações dos produtos e comentários. O front- end nunca se comunica diretamente diretamente com o Supabase, ele sempre passa pela API para mais segurança.


## 2. Diagrama de Componentes(Front)

Este diagrama mostra como os principais componentes React se encaixam para formar a interface do site.

Diagrama React:

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

## Estrutura do Diagrama:

    - Tudo começa no _app.js, que é o arquivo que define a estrutura geral.
    - Ele carrega o Layout.js, que adiciona o cabeçalho e o rodapé.
    - Dentro do Layout.js a página atual(index.js) é renderizada.
    - A página index.js, por sua vez, é construida a partir de componebtes menores e          reutilizáveis, como os ProductCard e filtros.

# 3. Diagram de Fluxo de dados(full-Stack)

Este Diagrama ilustra o caminho completo que os dados percorrem, desde a solicitação do usuário até a exibição.

    sequenceDiagram
        participante User as Usuario (Navegador)
        participante FrontEnd as FrontEnd (React/Next.js)
        participante API as BackEnd (API Routes)
        participante DB as Banco de Dados (Supabase Atual*)

        User ->>+ FrontEnd: 1. Acessa a página principal

        FrontEnd ->>+ API: 2. Requisição GET para /api/products

        API ->>+ DB: 3. Consulta "SELECT * FROM products"

        DB -->>- API: 4. Retorna a lista de produtos

        API -->>- FrontEnd: 5.Retorna os produtos em formato JSON

        FrontEnd -->>- User: 6. Renderiza os produtos na tela

        %% Fluxo de Adicionar Comentários
        User ->>+ FrontEnd: 7. Envia um novo coment';ario

        FrontEnd ->>+ API: 8. Requisição POST para /api/comments/[id] com os dados

        API ->>+ DB: 9. Insere o novo comentário "INSRT INTO comments..."

        DB -->>- Api: 10. Confirma a inserção

        API -->>- FrontEnd: 11. Retorno sucesso

        FrontEnd ->>FrontEnd: 12. Atualiza a lista de comentários na tela

## Estrutura do Diagrama:

    - O Fluxo mostra que o **FrontEnd nunca acessa o Banco de Dados diretamente**. Isoo é crucial para a segurança, pois as chaves secretas do banco de dados ficam protegidas no BackEnd.

    - O **BackEnd(API Routes)** atua como um porteiro, validando as solicitações e buscando as informacções necessárias.

# 4. Dicionário de Arquivos e Funções

Um **Guia de referências** rápida para os arquivos mais importantes do projeto.

|Arquivos|Propósito|Exemplo de Uso|
|-|-|-|

| pages/_app.js | **Arquivo principal da aplicação.** Carrega estilos globais e o layout principal  para todas as páginas | Adicionar o \<Layout>\ para que todas as páginas tenham cabeçalho e rodapé.|
| | | |

| pages/index.js|**Página Inicial.** Contém a lógica para bucar e exibir a lista de produtos, 
além de gerenciar os filtros| Onde o useEffect chama fetch('/aoi/products').

| pages/api/** | **O Back-End.** pontos de acesso(endpoints) que o front-end chama para interargir com o banco de dados. | \pages/api/products/[id].js\ busca um produto especifico no Supabase. |
| | | |

| components/** | **Componebtes Reutilizáveis.** Peças da interface que são usadas em várias páginas | ProductCard.js é usado na página inicial, na de categorias, etc.|

|Layout.js | **Estrutura Visual Principal.** Define o cabeçalho, o rodapé e ode o conteúdo da pagina aerá inserido. | Contém a tag \<header>\ como logo e menu, e o \<footer>\.|

| lib/supabaseClient.js | **Conexão com o Banco de Dados.** Onde a conexão com o Supabase é inicializada com as chaves de API. | É importatado pelos arquivos da pasta pages/api.|

|.env.local | **As Chaves.** Aequivo para armazenar as chaves da API do Supabase de forma segura no ambiente local. Nunca deverá ser usada ou anexada ao projeto no github, assim como qualquer outro arquivo com dados sensível. Use .gitgnore para ignorar estes arquivos do projeto e comitar somente os arquivos necessarios. |  NEXT_PUBLIC_SUPABASE_URL=...|
| tailwind.config.js | **Configuração do Tailwind.** Define as configurações de design e, crucialmente, informa ao Tailwind quais arquivos monitorar para gerar os estilos.| A seção content foi ajustada para incluir o Layout.js .|
|-----|-----|-----|

    # :relieved: Ufa! Quase tanat trabalho quanto codar a o site! :smile:
    Acredito que tenha sido um bom trabalho, a documentação. KKKK 