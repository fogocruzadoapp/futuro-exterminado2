# Política de Segurança

## Variáveis de Ambiente Sensíveis

Este projeto utiliza variáveis de ambiente para gerenciar dados sensíveis. **Nunca commit** credenciais reais no repositório.

### Variáveis Sensíveis

- `FC_EMAIL` - Credenciais de acesso à API do Fogo Cruzado
- `FC_PASSWORD` - Credenciais de acesso à API do Fogo Cruzado
- `VICTIMS_TOKEN` - Token de API 
- `SMTP_PASSWORD` - Senha de servidor SMTP
- `SSH_PRIVATE_KEY` - Chave privada SSH (GitHub Actions)
- `MAPBOX_ACCESS_TOKEN` - Token do Mapbox

### Como Proteger Secrets

#### Local

1. Crie um arquivo `.env` (não versionado):
```bash
cp .env.example .env
# Edite .env com suas credenciais reais
```

2. Garanta que `.gitignore` contém:
```
.env
.env.local
.env.*.local
```

#### Em Produção (Vercel)

1. Vá para **Settings** > **Environment Variables**
2. Adicione cada variável sensível
3. Marque como **Sensitive** se disponível

#### GitHub Actions

1. Vá para **Settings** > **Secrets and variables** > **Actions**
2. Adicione secrets necessários:
   - `SSH_PRIVATE_KEY` - Para deploy via SSH
3. Use no workflow com `${{ secrets.NOME_SECRET }}`

## Segurança em Deployments

### Vercel

- ✅ Use variáveis de ambiente do painel
- ✅ Não exponha secrets em logs
- ✅ Use HTTPS (automático)
- ✅ Ative proteção de branch para `main` e `prod`

### GitHub Actions

- ✅ Use `${{ secrets.NAME }}` para credenciais
- ✅ Configure workflows apenas para branches necessárias
- ✅ Revise pull requests antes de merge
- ✅ Use branches de proteção

### Servidor SSH

- ✅ Use chaves SSH, não senhas
- ✅ Restrinja permissões de arquivo (chmod 600)
- ✅ Use porta não-padrão
- ✅ Implemente fail2ban ou similar

## Protegendo Branches

### Configurar Proteção

No GitHub, em **Settings** > **Branches**:

**Para `main` e `prod`:**
- ✅ Require pull request reviews before merging (mín 1)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale pull request approvals
- ✅ Require code review from code owners
- ✅ Restrict who can push to matching branches

**Para outras branches:**
- Deixe públicas para colaboradores contribuírem

## Auditando Secrets

### Verificar histórico de git

```bash
# Procure por patterns de secrets
git log -p | grep -i "password\|secret\|token\|key"

# Use git-secrets (recomendado)
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
make install
git secrets --install
git secrets --register-aws
```

### Remover secrets do histórico

Se você acidentalmente commitou um secret:

```bash
# Usando BFG Repo Cleaner (mais rápido)
bfg --delete-files id_{rsa,dsa}

# Ou git-filter-branch (mais lento)
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

## Dependências Seguras

### Verificar vulnerabilidades

```bash
# NPM audit
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Verificar apenas vulnerabilidades de segurança
npm audit --security-level=moderate
```

### Manter dependências atualizadas

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar dependências
npm update
```

## Relatando Vulnerabilidades

**Não** abra um issue público para vulnerabilidades de segurança.

Em vez disso:
1. Email: `contato@fogocruzado.org.br`
2. Descreva a vulnerabilidade
3. Seu acesso será mantido enquanto a correção é desenvolvida

## Melhores Práticas

- ✅ Nunca commit credenciais ou secrets
- ✅ Use `.env.example` como template
- ✅ Revise pull requests antes de merge
- ✅ Mantenha dependências atualizadas
- ✅ Use HTTPS sempre que possível
- ✅ Implemente logging sem expor secrets
- ✅ Use variáveis de ambiente para configuração
- ✅ Revise workflows do GitHub Actions
- ✅ Configure proteção de branches
- ✅ Realize auditorias de segurança regularmente

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [npm Security Best Practices](https://docs.npmjs.com/cli/v8/using-npm/security)
- [Vercel Security](https://vercel.com/security)
