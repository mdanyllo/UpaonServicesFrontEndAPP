# Upaon Services — Documentação do FrontEnd

## Visão Geral

A **Upaon Services** é uma plataforma de marketplace de serviços locais focada na Ilha de Upaon-Açu (São Luís, Paço do Lumiar, São José de Ribamar e Raposa).

O objetivo é conectar clientes a prestadores de serviços de forma simples, rápida e inteligente, utilizando busca por categoria e descrição.

---

## Fluxo Principal da Aplicação

1. Usuário acessa a landing page (Hero)
2. Realiza uma busca por serviço
3. Visualiza prestadores disponíveis
4. Cria conta ou faz login
5. É redirecionado automaticamente para o dashboard conforme o tipo de usuário

---

## Hero

### Verificação de Sessão

Ao carregar a página inicial, o sistema verifica se existem dados salvos no `localStorage`:

- `upaon_user`
- `upaon_token`

Se o usuário estiver autenticado:
- `PROVIDER` → redireciona para `/dashboard/prestador`
- `CLIENT` → redireciona para `/dashboard/cliente`

---

### Exibição de Localização

O Hero exibe cidades da Ilha de Upaon-Açu de forma animada, apenas como elemento visual.

Cidades exibidas:
- São Luís - MA
- Paço do Lumiar - MA
- São José de Ribamar - MA
- Raposa - MA
- Ilha do Amor

> A localização exibida no Hero **não é utilizada como filtro de busca**.

---

## Sistema de Busca Inteligente

A busca do Hero redireciona o usuário para a página de resultados usando query params.


---

### Tipos de Busca

#### 1. Busca por Categoria Exata

Se o termo digitado corresponder exatamente a uma categoria existente:


---

#### 2. Busca por Palavra-chave Mapeada

O front-end converte termos populares em categorias internas do sistema.

Exemplos:

| Termo digitado | Categoria aplicada |
|---------------|-------------------|
| Eletricista   | Reparos           |
| Encanador    | Reparos           |
| Diarista     | Limpeza           |
| Babá         | Babá              |
| Pedreiro    | Construção        |
| Pintor       | Pintura           |
| Motorista    | Motoristas        |
| Bolo         | Culinária         |
| Computador   | Tecnologia        |

---

#### 3. Busca Textual Genérica

Quando o termo não corresponde a nenhuma categoria nem palavra-chave mapeada.


Essa busca verifica:
- Nome do prestador
- Descrição do prestador

---

## Categorias Disponíveis

- Tecnologia
- Reparos
- Limpeza
- Pintura
- Construção
- Beleza
- Babá
- Cuidadores
- Culinária
- Mudança
- Fotografia
- Motoristas
- Outros

---

## Regras Importantes

- A localização **não filtra resultados** 
- Toda a lógica de busca inteligente ocorre no front-end
- O back-end apenas recebe parâmetros simples (`category` ou `q`)
- Lógicas internas, validações e erros não são expostos na documentação

---

## Escopo

### Incluído
- Busca inteligente por serviço
- Cadastro e login
- Redirecionamento automático por tipo de usuário
- Listagem de prestadores

### Fora do Escopo
- Filtro por bairro
- Paginação
- Sistema de avaliação

---

## Observação Final

Esta documentação descreve exclusivamente o comportamento atual da plataforma e serve como base para evolução futura.


