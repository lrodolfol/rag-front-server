# Integração com API de Envio de Emails

## Configuração Atual

O formulário de contato está implementado e funcional no componente `IndexComponent`. No momento, ele está configurado para simular o envio de emails para fins de desenvolvimento.

## Como Integrar com API Real

### 1. Atualizar a URL da API

No arquivo `src/app/pages/index/index.component.ts`, altere a propriedade `apiUrl`:

```typescript
// Substitua por sua URL real
private apiUrl = 'https://sua-api.com/api/contact';
```

### 2. Estrutura de Dados Enviados

A aplicação envia os seguintes dados via POST:

```json
{
  "name": "Nome do usuário",
  "email": "email@usuario.com",
  "phone": "35 9 99999999",
  "message": "Mensagem/dúvida do usuário",
  "subject": "Contato - Nome do usuário",
  "timestamp": "2025-01-01T10:00:00.000Z"
}
```

### 3. Resposta Esperada da API

A API deve retornar:

**Sucesso (200):**
```json
{
  "success": true,
  "message": "Email enviado com sucesso",
  "id": "email_id_opcional"
}
```

**Erro (400/500):**
```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": "Detalhes opcionais"
}
```

### 4. Configuração de Headers (se necessário)

Se a API requerer autenticação ou headers específicos, adicione no método `sendEmail()`:

```typescript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_TOKEN',
  'X-API-Key': 'SUA_API_KEY'
};

this.http.post(this.apiUrl, emailData, { headers }).subscribe({
  // ... resto do código
});
```

### 5. Tratamento de Erros Específicos

Para melhor UX, você pode tratar erros específicos:

```typescript
error: (error) => {
  console.error('Erro ao enviar email:', error);
  
  // Tratar diferentes tipos de erro
  if (error.status === 429) {
    this.emailError = 'Muitas tentativas. Tente novamente em alguns minutos.';
  } else if (error.status === 400) {
    this.emailError = 'Dados inválidos. Verifique as informações.';
  } else {
    this.emailError = 'Erro interno. Tente novamente mais tarde.';
  }
  
  this.emailSent = false;
  this.isSubmittingEmail = false;
}
```

## Serviços de Email Recomendados

### 1. SendGrid
- Endpoint: `https://api.sendgrid.com/v3/mail/send`
- Documentação: https://docs.sendgrid.com/api-reference/mail-send/mail-send

### 2. Mailgun
- Endpoint: `https://api.mailgun.net/v3/YOUR_DOMAIN/messages`
- Documentação: https://documentation.mailgun.com/en/latest/api-sending.html

### 3. Amazon SES
- Usar AWS SDK ou API REST
- Documentação: https://docs.aws.amazon.com/ses/

### 4. Nodemailer (para backend Node.js)
- Implementar endpoint customizado
- Suporta Gmail, Outlook, SMTP genérico

## Exemplo de Backend Simple (Node.js/Express)

```javascript
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    
    // Validação
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campos obrigatórios não preenchidos' 
      });
    }
    
    // Enviar email usando Nodemailer ou serviço escolhido
    await sendEmail({
      to: 'contato@suaempresa.com',
      subject: subject,
      html: `
        <h3>Novo contato do site</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>Mensagem:</strong> ${message}</p>
      `
    });
    
    res.json({ success: true, message: 'Email enviado com sucesso' });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});
```

## Modo de Desenvolvimento

O formulário está configurado para simular envio bem-sucedido após 2 segundos quando há erro na API. Remova esta simulação quando implementar a API real:

```typescript
// Remover este bloco quando a API estiver funcionando
setTimeout(() => {
  console.log('Simulando envio de email bem-sucedido (modo desenvolvimento)');
  this.emailSent = true;
  this.emailError = false;
  this.resetContactForm();
}, 2000);
```

## Segurança

1. **Validação no Backend**: Sempre valide os dados no servidor
2. **Rate Limiting**: Implemente limite de tentativas por IP
3. **Sanitização**: Limpe os dados antes de processar
4. **CORS**: Configure adequadamente para permitir requisições do frontend
5. **HTTPS**: Use sempre conexões seguras em produção
