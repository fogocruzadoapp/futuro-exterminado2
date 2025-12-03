# Contribuindo com o Futuro Exterminado

Obrigado por considerar contribuir para o Futuro Exterminado! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## Código de Conduta

Por favor, note que este projeto é liberado com um [Código de Conduta do Contributor](CODE_OF_CONDUCT.md). Ao participar deste projeto, você concorda em respeitar seus termos.

## Como Contribuir

### Relatando Bugs

Antes de criar um relatório de bug, verifique a [lista de issues](https://github.com/fogocruzadoapp/futuro-exterminado/issues) - você pode descobrir que o bug já foi relatado.

Ao criar um relatório de bug, inclua o máximo de detalhes possível:

- **Use um título claro e descritivo**
- **Descreva os passos exatos** que reproduzem o problema
- **Descreva o comportamento observado**
- **Explique qual era o comportamento esperado**
- **Inclua capturas de tela se possível**
- **Inclua seu ambiente** (OS, navegador, versão do Node.js, etc.)

### Sugerindo Melhorias

As sugestões de melhoria são sempre bem-vindas! Ao sugerir uma melhoria:

- **Use um título claro e descritivo**
- **Forneça uma descrição passo a passo** da melhoria sugerida
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento atual** e o **comportamento esperado**
- **Explique por que essa melhoria seria útil**

### Pull Requests

- Preencha o modelo de pull request totalmente
- Siga as orientações de estilo de código Vue/JavaScript
- Inclua testes para novas funcionalidades
- Escreva mensagens de commit claras

## Guias de Estilo

### Mensagens de Commit

- Use o tempo presente ("Adiciona feature" não "Adicionou feature")
- Use o modo imperativo ("Move cursor para..." não "Move cursor para...")
- Limite a primeira linha a 72 caracteres ou menos
- Faça referência a issues e pull requests generosamente após a primeira linha

Exemplo:
```
Adiciona novo componente de filtro

- Implementa filtro interativo para dados
- Adiciona testes unitários
- Atualiza documentação

Fixes #123
```

### Estilo de Código

- Siga o padrão Vue.js 3
- Use TypeScript quando possível
- Espaçamento: 2 espaços de indentação
- Use `const` e `let`, evite `var`
- Use arrow functions quando apropriado

### Estilo de Componente Vue

```vue
<template>
  <!-- Estrutura do template -->
</template>

<script setup lang="ts">
// Imports
// Type definitions
// Props
// Composables
// State
// Computed
// Methods
// Watchers
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
```

## Processo de Desenvolvimento

1. Fork o repositório
2. Crie uma branch para sua feature/fix: `git checkout -b feature/nome-descritivo`
3. Faça commit de suas mudanças: `git commit -am 'Adiciona: descrição'`
4. Push para a branch: `git push origin feature/nome-descritivo`
5. Abra um Pull Request

## Executando Testes Localmente

```bash
# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Execute o build
npm run build

# Verifique erros de linting
npm run lint  # se disponível
```

## Perguntas?

Sinta-se livre para abrir uma [discussão](https://github.com/fogocruzadoapp/futuro-exterminado/discussions) ou entrar em contato através de issues.

---

Obrigado por sua contribuição! 🎉
