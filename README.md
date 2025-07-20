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