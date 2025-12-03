// server/api/report.post.ts
// -------------------------------------------------------------
// Endpoint de produção para envio de e-mail via SMTP real
// NÃO EXPOR este arquivo, se preenchido inline, ou não expor .env com os dados de SMTP. Roda apenas no servidor Nuxt.
// -------------------------------------------------------------

import { readBody, createError } from 'h3'
import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  const { nome = '', email = '', mensagem = '' } = (await readBody(event)) || {}

  // Validações simples
  if (!nome.trim() || !email.trim() || !mensagem.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Preencha todos os campos.' })
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) throw createError({ statusCode: 400, statusMessage: 'E-mail inválido.' })

  // Obter configurações do runtime config
  const config = useRuntimeConfig()
  
  const SMTP_HOST   = config.SMTP_HOST || 'smtp.seuprovedor.com'
  const SMTP_PORT   = config.SMTP_PORT ? Number(config.SMTP_PORT) : 465
  const SMTP_SECURE = config.SMTP_SECURE === 'true' || config.SMTP_SECURE === true
  const SMTP_USER   = config.SMTP_USER || 'no-reply@fogocruzado.org.br'
  const SMTP_PASS   = config.SMTP_PASS || ''

  const FROM_NAME   = config.FROM_NAME || 'Site Fogo Cruzado'
  const FROM_EMAIL  = config.FROM_EMAIL || 'no-reply@fogocruzado.org.br'
  const TO_EMAIL    = config.TO_EMAIL || 'contato@fogocruzado.org.br'

  // Validar se as credenciais SMTP estão configuradas
  if (!SMTP_PASS || SMTP_PASS === 'SUA_SENHA_FORTE_AQUI') {
    throw createError({ statusCode: 500, statusMessage: 'Configuração SMTP incompleta. Configure as variáveis de ambiente.' })
  }

  // Monta o transporter SMTP
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Boolean(SMTP_SECURE),
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Descomente a linha abaixo SOMENTE se o provedor usar certificado self-signed
    // tls: { rejectUnauthorized: false }
  })

  // Conteúdo do e-mail
  const subject = `Reporte de inconsistência – ${nome}`
  const text = [
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    '',
    'Mensagem:',
    mensagem,
  ].join('\n')

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 12px">Reporte de inconsistência</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:12px 0" />
      <p>${escapeHtml(mensagem).replace(/\n/g, '<br/>')}</p>
    </div>
  `

  // Envia
  const info = await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to: TO_EMAIL,
    replyTo: email,
    subject,
    text,
    html,
  })

  return { ok: true }
})

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
