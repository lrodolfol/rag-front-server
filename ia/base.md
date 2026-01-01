Esse é um projeto em angular contruido para um para um sistema backend em python de RAG (Retrieval-Augmented Generation).
As telas estão localizadas na pasta ./src/app/pages, sendo elas:
    ./abstract: somente pasta para reaproveitar a propriedade 'title'.
    ./index: tela inicial do frontend servindo como uma landing-page e trazendo informação de como o sistema funciona, além de outras informações básicas.
    ./spotbot-chat-online: tela para o usuário experimentar o sistema com uma simulação de chat. As perguntas são enviadas para o backend que se encarregará de realizar o processo de RAG e enviará as respostas para a tela. Quando o backend responde com status 429, a tela informa que o usuário só pode fazer até 3 requisições por minuto.
    ./start-free: tela para o usuario preencher as informações dele que serão enviadas para o backend e banco de dados. Caso o cadastro de certo, o usuario recebera um código unico de acesso para acessar a tela /auth.
    ./auth: tela para o usuario preencher o código de acesso pessoal para acessar o sistema.
    ./form-service: tela principal do sistema acessivel somente apos o usuario inserir seu código de acesso. Nessa tela o usuario ira preencher o nome da empresa dele e as caracteristicas da empresa, como ela funciona e outras informações pertinentes para alimentar o banco de dados do sistema RAG.

O roteamento de página fica dentro do arquivo ./src/app/app-routing.module com o nome das telas e seus paths
