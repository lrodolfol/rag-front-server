# Recuperação de senha do usuário

## Objetivo
Criar um processo confiável de recuperação de senha que mantenha a identidade do usuário validada, proteja a base de dados distribuída do backend de RAG e siga o estilo visual já estabelecido (cores, fontes e ícones da interface atual).

## Cenários principais
1. Usuário esquece a senha e solicita o envio de um código temporário por e-mail.
2. Usuário insere o código temporário e define uma nova senha.
3. Usuário tenta acessar o sistema com código inválido ou expirado e recebe explicação clara do próximo passo.

## Fluxo de telas
1. Na tela `/auth`, adicionar um link discreto “Esqueci minha senha” com hover e foco no padrão atual. O link leva à nova tela `/password-recovery`.
2. `/password-recovery`: formulário com campo de e-mail institucional, botão “Enviar código” e mensagens de estado (carregando, sucesso, erro). Após envio bem-sucedido exibir dica sobre verificar spam e próximo passo.
3. `/password-recovery/confirm`: campos para código temporário e nova senha (com confirmação). Exibir validação inline (força da senha, presença de confirmação igual). Somente habilitar botão “Redefinir senha” quando os campos estiverem válidos.
4. Após redefinição, redirecionar para `/auth` com alerta de sucesso e instruções para login.

## Requisitos de front-end
- Reaproveitar componentes e tokens de estilo existentes da pasta `src/app/pages`: tipografia, botões e mensagens de feedback.
- Seguir o mesmo padrão de responsividade e acessibilidade (labels associadas, foco claro, mensagens de erro/alerta com semântica `aria`).
- Adicionar descrições curtas sobre o prazo de expiração do código (por exemplo “código válido por 15 minutos”) sem quebrar o layout da landing page atual.
- Indicar limites de uso (por ex. “até 3 envios por minuto”) para manter consistência com o aviso de 429 já exibido no chat.

## Requisitos de back-end
- Endpoint `POST /auth/password-recovery/request`: validar que o e-mail pertence a um usuário ativo, gerar token seguro (mínimo 128 bits) com expiração e salvar em tabela de tokens temporários; enviar e-mail com template compatível com branding.
- Endpoint `POST /auth/password-recovery/confirm`: validar token e expiração, aplicar hashing forte (bcrypt/argon2) e sobrescrever o hash atual; invalidar o token, gerar log seguro e emitir evento para auditoria.
- Mecanismos de throttle (ex. 3 requisições por minuto por e-mail/IP) e listas de bloqueio temporário para prevenir abusos.
- Logs estruturados (correlationId) para permitir rastrear tentativa, envio de e-mail, aceitação do link ou falha.

## Segurança e conformidade
- Usar token com valor único e armazenamento efêmero; suportar expiração configurável (padrão 15 min).
- Rejeitar tentativas de redefinição para contas bloqueadas e informar via UI que a conta não pode ser alterada neste momento.
- Não revelar se o e-mail existe no sistema; exibir mensagem neutra (“Se houver um cadastro, você receberá instruções por e-mail”).
- Implementar monitoramento de tentativas repetidas (alertas para times e métricas de segurança).

## QA e métricas de sucesso
- Testes manuais de fluxo completo (solicitação, recebimento, redefinição, login).
- Verificar mensagens de erro (código incorreto/expirado) e garantir que o botão `Redefinir senha` é desabilitado até a senha cumprir política de força.
- Monitorar taxa de sucesso da redefinição e número de tokens expirados para ajustar o prazo.
