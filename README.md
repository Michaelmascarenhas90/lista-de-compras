# API Lista de Compras Aleatórias com Catálogo

Esta é uma API RESTful para gerenciar itens em estoque e registrar compras, sorteando um usuário aleatório do GitHub para ser o comprador de cada item. Construída com Fastify, Prisma, SQLite e Zod.

## Tecnologias Utilizadas

- **Fastify** (v5) - Framework web rápido e de baixa sobrecarga.
- **TypeScript** - Superset da linguagem JavaScript.
- **Prisma** - ORM moderno para Node.js e TypeScript.
- **SQLite** - Banco de dados relacional rápido sem necessidade de setup de servidor.
- **Zod** - Validação e parser de schemas com forte tipagem.
- **Vitest** - Framework de testes unitários.
- **Swagger / OpenAPI** - Documentação auto-gerada da API.

## Padrões Arquiteturais

A estrutura do projeto adota uma adaptação do padrão de **Vertical Slice Architecture**, onde o código é organizado por domínios da aplicação (`itens` e `compras`). A correspondência com o padrão MVC clássico é definida como:
- **Model:** models gerenciados pelo Prisma (`schema.prisma`) e abstraídos nas classes de `repositories`.
- **Controller:** arquivos `controllers` que tratam a entrada de dados (HTTP request) e orquestram com os `services`, sendo auxiliados por uma `controller-factory` e um handler global de erros.
- **View:** camada de serialização final para JSON devolvida ao cliente na saída da requisição.

## Notas, Trade-offs e Limitações

- **Preço (`Float`) no SQLite:** SQLite nativamente não suporta um tipo `Decimal` (precisão arbitrária para dinheiro). Como o Prisma não suporta `@db.Decimal` puro no SQLite sem conversões, o campo `preco` foi adotado como `Float` (ponto flutuante) para simplificação no escopo do projeto, o que seria substituído por um banco mais robusto (ex: PostgreSQL) em ambiente produtivo real.
- **Limite de Rate Limit do GitHub:** A API do GitHub possui um limite de requisições de cerca de 60 por hora para chamadas não autenticadas (como é o caso). Se o rate limit for atingido, a rota de criação de compras passará a retornar `503 Service Unavailable`.
- **Comprador Rico em Memória:** Os dados detalhados do comprador (`avatar_url` e `html_url`) são buscados da API do GitHub apenas no exato momento da requisição de compra (`POST /compras`) e retornados ao usuário na resposta, mas não são salvos no banco de dados. Apenas o `comprador_github_login` é persistido. Isso reduz a duplicação e dependência de dados estáticos que podem sofrer mutação externa.

## Como Executar

### 1. Pré-requisitos
- Node.js (versão >= 20 LTS)
- NPM (ou outro gerenciador de sua escolha)

### 2. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto utilizando o arquivo `.env.example` como base:

```bash
cp .env.example .env
```

### 3. Instalação
Instale as dependências de produção e de desenvolvimento:
```bash
npm install
```

### 4. Inicialização do Banco de Dados
Para inicializar o banco de dados SQLite e criar as tabelas necessárias:
```bash
npx prisma migrate dev
```

### 5. Iniciando a API
Suba o ambiente de desenvolvimento (com watch ativo via tsx):
```bash
npm run dev
```
A API ficará disponível em `http://localhost:3000`.
Acesse a documentação interativa do Swagger em: `http://localhost:3000/docs`.

### 6. Rodando os Testes
Para executar os testes unitários dos Services e regras de negócio:
```bash
npm test
```

## Como Testar a API e Cenários

### Coleção do Insomnia
Uma coleção pré-configurada de requisições está disponível para uso no aplicativo [Insomnia](https://insomnia.rest/). 
Para utilizá-la, abra o Insomnia e importe o arquivo `docs/insomnia_collection.json` presente neste repositório.

### Simulando a queda ou rate-limit do GitHub (Erro 503)
Para simular manualmente o cenário onde o serviço externo de listagem de usuários do GitHub fica inacessível:
1. Abra o arquivo `.env`.
2. Altere a chave `GITHUB_API_URL` para um endereço inválido (exemplo: `https://api.github.invalid/users`).
3. Tente realizar um novo `POST /compras`.
4. A API retornará adequadamente um erro `503 SERVICE_UNAVAILABLE`, evitando expor dados sensíveis do erro original ou interromper a aplicação abruptamente.
