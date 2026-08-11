# Prompt para criar uma Landing Page Jurídica

Crie uma Landing Page jurídica completa usando o briefing preenchido pelo cliente e os materiais reunidos pela equipe.

A equipe baixará o template previamente acordado com o cliente. O ZIP será extraído no local escolhido pela equipe, e a pasta resultante será renomeada com o nome do cliente ou do projeto. Não existe caminho obrigatório.

Trabalhe diretamente nessa pasta extraída. Ela é o projeto exclusivo do cliente. Não é necessário localizar uma biblioteca original nem criar outra cópia: se o modelo for necessário novamente, ele poderá ser baixado outra vez.

## Material fornecido pela equipe

A equipe fornecerá:

- este prompt;
- o briefing completo do site;
- o caminho da pasta extraída do template escolhido;
- arquivos de marca, imagens e demais materiais enviados pelo cliente.

## Fluxo de criação

1. Leia todo o briefing e os arquivos enviados.
2. Localize a pasta do template que a equipe baixou, extraiu e renomeou para o cliente.
3. Confirme que essa é a pasta de trabalho e que contém os arquivos do projeto, incluindo o `package.json` quando aplicável.
4. Confirme brevemente qual template está sendo usado. A escolha já foi acordada com o cliente e não precisa ser refeita.
5. Leia o `README.md`, o `MEMORIA.md` e as configurações existentes na pasta, quando disponíveis.
6. Trabalhe diretamente na pasta extraída. Não crie outra cópia nem procure uma pasta central de templates.
7. Personalize todo o projeto com os dados do briefing. Remova nomes, contatos, textos, imagens, metadados e demais conteúdos demonstrativos do modelo.
8. Crie os textos iniciais quando o briefing autorizar o uso de IA. Não invente dados profissionais, OAB, contatos, endereço, credenciais, resultados, depoimentos ou estatísticas.
9. Instale as dependências dentro da pasta extraída.
10. Teste links, âncoras, botões, WhatsApp, formulários e responsividade.
11. Execute lint e build usando os comandos definidos no `package.json` do projeto e corrija os erros encontrados.

Se faltar uma informação indispensável que não possa ser criada pela IA, faça uma única lista consolidada de perguntas. OAB e WhatsApp podem ser marcados como `Enviar depois`; nesse caso, crie o projeto, registre a pendência e informe que ele ainda não está pronto para publicação.

## Estrutura esperada

Use as seções do template escolhido e adapte-as ao briefing. Quando aplicável, a Landing Page deve conter:

- navegação fixa e responsiva;
- abertura com proposta de valor e CTA;
- apresentação profissional;
- serviços ou áreas de atuação;
- diferenciais ou processo de atendimento;
- perguntas frequentes;
- contatos e regiões atendidas;
- OAB visível;
- aviso institucional;
- rodapé;
- título, descrição SEO, favicon e identidade visual;
- boa apresentação em celular, tablet e desktop.

Não inclua automaticamente equipe, publicações, blog, vídeos, mapa, depoimentos, integrações ou páginas adicionais. Inclua esses elementos quando forem fornecidos, solicitados ou claramente necessários ao briefing.

## Regras de conteúdo

- Não prometa resultados nem use expressões como “causa ganha” ou “resultado garantido”.
- Não invente depoimentos, métricas ou credenciais.
- Não publique imagens sem autorização.
- Informe que cada caso depende de análise individual.
- Evite coleta desnecessária de dados pessoais.
- Campos de telefone, WhatsApp, CPF, CNPJ, CEP, datas e valores devem ter máscara, limite, exemplo e validação adequados.
- Enquanto o WhatsApp estiver pendente, não crie links externos ou `tel:` inválidos.

Inclua no rodapé:

> Este material tem caráter meramente informativo e não constitui publicidade profissional nos termos do Provimento nº 205/2021 do CFOAB. As informações aqui veiculadas não garantem resultados específicos.

## Entrega

Ao concluir, informe:

- nome e caminho da pasta trabalhada;
- template utilizado;
- principais personalizações realizadas;
- informações pendentes;
- resultado dos testes, lint e build;
- se o site está pronto ou bloqueado para publicação.
