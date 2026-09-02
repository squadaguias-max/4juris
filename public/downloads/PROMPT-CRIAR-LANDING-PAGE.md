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
3. Confirme que essa é a pasta de trabalho e identifique se o projeto é HTML estático ou uma aplicação com dependências e processo de build.
4. Confirme brevemente qual template está sendo usado. A escolha já foi acordada com o cliente e não precisa ser refeita.
5. Leia o `README.md`, o `MEMORIA.md` e as configurações existentes na pasta, quando disponíveis.
6. Trabalhe diretamente na pasta extraída. Não crie outra cópia nem procure uma pasta central de templates.
7. Personalize todo o projeto com os dados do briefing. Remova nomes, contatos, textos, imagens, metadados e demais conteúdos demonstrativos do modelo.
8. Crie os textos iniciais quando o briefing autorizar o uso de IA. Não invente dados profissionais, OAB, contatos, endereço, credenciais, resultados, depoimentos ou estatísticas.
9. Se existir `package.json`, instale as dependências dentro da pasta extraída. Se o template for HTML estático, não instale Node, React, Vite ou outro framework apenas para executar esta tarefa.
10. Teste links, âncoras, botões, WhatsApp, formulários e responsividade.
11. Em projetos com `package.json`, execute os scripts existentes de lint e build. Em templates estáticos, valide diretamente HTML, CSS, JavaScript, recursos e navegação, sem inventar comandos inexistentes.

Se faltar uma informação indispensável que não possa ser criada pela IA, faça uma única lista consolidada de perguntas. OAB e WhatsApp podem ser marcados como `Enviar depois`; nesse caso, crie o projeto, registre a pendência e informe que ele ainda não está pronto para publicação.

## Respeito à tecnologia do template

Antes de editar, classifique o projeto em uma das opções abaixo e siga somente o fluxo correspondente.

### Template HTML estático

Considere estático o template cuja página é formada diretamente por arquivos como `index.html`, `style.css`, outros CSS, JavaScript e uma pasta `assets`, sem `package.json` ou processo de compilação necessário.

- Preserve a base HTML/CSS/JavaScript existente. Não converta o projeto para React, Vue, Next, Vite ou outro framework sem solicitação expressa.
- Edite metadados, JSON-LD e conteúdo semântico diretamente no `<head>` e no `<body>` do `index.html`.
- Mantenha CSS, JavaScript, imagens, fontes, favicon, imagem social e outros recursos em caminhos relativos válidos para hospedagem estática.
- Coloque `robots.txt`, `sitemap.xml`, manifesto e demais arquivos públicos na raiz que será publicada, salvo quando a hospedagem exigir outra estrutura.
- O próprio HTML estático é a saída de produção. Não crie pasta `dist`, etapa de hidratação, script de pré-renderização ou dependências apenas para simular um build.
- Para testar, sirva a pasta com um servidor HTTP local simples. Não valide somente abrindo o arquivo com `file://`, pois caminhos, módulos, formulários e políticas do navegador podem se comportar de modo diferente.
- Se houver JavaScript minificado ou difícil de manter, faça apenas as alterações necessárias e preserve as funcionalidades existentes. Não reescreva toda a arquitetura sem necessidade.

### Aplicação com build

Considere aplicação com build o projeto que possui `package.json`, dependências e scripts como `dev`, `build`, `lint` ou equivalentes.

- Preserve o framework, o roteamento, a organização de componentes e o processo de build já adotados.
- Instale dependências e use somente os scripts reais declarados pelo projeto.
- Identifique a saída publicada pelo projeto, como `dist`, `build`, `out` ou outra configurada. Não suponha que todas as aplicações usam `dist`.
- Em aplicações renderizadas apenas no navegador, adote SSR, geração estática ou pré-renderização somente quando necessário para entregar o conteúdo principal no HTML inicial e quando a solução for compatível com a base existente.
- Preserve a hidratação e as interações quando houver HTML pré-renderizado.

Em ambos os casos, o resultado visual e funcional deve respeitar o template escolhido. A tecnologia deve servir à personalização; trocar a arquitetura não é parte automática do trabalho.

## SEO obrigatório

SEO faz parte da criação da Landing Page e não deve ser tratado apenas como a inclusão de um título e uma descrição. Implemente os itens abaixo de acordo com a tecnologia do template e com os dados confirmados no briefing.

### Estratégia de busca e conteúdo

- Identifique a intenção principal de busca combinando área jurídica, serviço prioritário, público e localização. Exemplo de estrutura: `advogado previdenciário em [cidade]`, sem copiar essa expressão quando ela não corresponder ao briefing.
- Defina um tema principal e termos secundários relacionados aos serviços reais. Distribua-os naturalmente no título, H1, subtítulos, abertura, áreas de atuação, biografia, perguntas frequentes e localização.
- Não repita palavras-chave de forma artificial, não crie texto para preencher espaço e não use `meta keywords`.
- Escreva conteúdo útil, específico e coerente com o briefing. Explique problemas atendidos, serviços, processo de atendimento, abrangência territorial e dúvidas reais do público.
- Reforce a confiança com nome profissional, OAB, biografia, especializações, experiência e demais credenciais que tenham sido fornecidas e autorizadas. Nunca invente sinais de autoridade.
- Inclua localização no conteúdo quando houver atuação local. Diferencie com clareza atendimento presencial, on-line e nacional.
- Se houver perguntas frequentes, use perguntas de intenção real e mantenha as respostas informativas, sem promessa de resultado.

### Metadados e compartilhamento

- Crie um `<title>` único, descritivo e conciso, combinando serviço ou área principal, localização quando relevante e nome da marca.
- Crie uma meta description específica e persuasiva, normalmente entre 140 e 160 caracteres, sem promessas e sem sequência artificial de termos.
- Configure `lang="pt-BR"`, viewport, favicon, cor do tema, autor quando aplicável e diretivas `robots` e `googlebot` compatíveis com indexação e prévia ampla de imagens.
- Inclua URL canonical absoluta e consistente. Em aplicações com build, centralize a URL pública em uma configuração como `VITE_SITE_URL`, `SITE_URL` ou equivalente. Em HTML estático, mantenha um único valor de domínio documentado e replique-o com cuidado em canonical, sitemap, Open Graph e dados estruturados.
- Nunca invente um domínio nem publique canonical apontando para `localhost`. Se o domínio oficial ainda não existir, prepare a configuração, registre a pendência e não declare o site pronto para indexação.
- Use `hreflang` somente quando a estrutura de idiomas ou regiões justificar seu uso.
- Adicione Open Graph e Twitter Card com título, descrição, URL e imagem social autorizada. Prefira uma imagem representativa de 1200 × 630 px, com dimensões, tipo e texto alternativo declarados.
- Não gere nem altere a aparência do profissional sem autorização para criar a imagem social. Quando não houver material adequado, registre a pendência.

### Dados estruturados

- Adicione JSON-LD válido e compatível com o conteúdo visível da página.
- Use `WebSite` para identificar o site e `LegalService` ou outro subtipo adequado de `LocalBusiness` para o escritório, incluindo apenas dados confirmados.
- Quando houver uma pessoa claramente responsável pelo conteúdo ou pelo escritório, use `Person` com nome, cargo, OAB e conhecimentos efetivamente informados.
- Quando houver FAQ visível, use `FAQPage` com as mesmas perguntas e respostas apresentadas ao visitante. Dados estruturados não devem conter conteúdo oculto, diferente ou promocional.
- Inclua endereço, telefone, e-mail, horário, área atendida, logotipo e perfis externos apenas quando esses dados estiverem confirmados e puderem ser publicados.
- Em sites com várias páginas, considere `BreadcrumbList` e dados específicos por página. Não marque todos os conteúdos com schemas que não representam sua finalidade real.
- Valide o JSON-LD e corrija erros de sintaxe, campos conflitantes e URLs inacessíveis. Dados estruturados aumentam a compreensão da página, mas não garantem resultado avançado no Google.

### Rastreamento, indexação e rotas

- Crie `robots.txt` permitindo o rastreamento da página pública e indicando a URL absoluta do sitemap.
- Crie `sitemap.xml` apenas com URLs canônicas, públicas e indexáveis. Não inclua rotas administrativas, de login, páginas vazias, demonstrações ou URLs inexistentes.
- Em HTML estático, coloque esses arquivos na raiz publicada. Em aplicações com build, use a pasta pública ou o mecanismo do framework que copie os arquivos para a raiz da saída final.
- Em uma Landing Page de página única, mantenha somente a URL necessária. Remova ou bloqueie a indexação de rotas residuais do template que contenham conteúdo demonstrativo, técnico ou duplicado.
- Páginas inexistentes devem retornar 404 real quando a hospedagem permitir e usar `noindex`. Evite soft 404 e redirecionamento indiscriminado de qualquer URL para a página inicial.
- Se o projeto tiver manifesto, mantenha nome, idioma, ícones, cores e URL inicial coerentes com a marca.

### HTML rastreável e semântica

- O conteúdo principal deve existir no HTML inicial entregue em produção.
- Em templates estáticos, escreva o conteúdo diretamente no `index.html`; o template já é rastreável e não precisa de React, hidratação ou pré-renderização.
- Em React, Vue ou outras SPAs cujo HTML publicado contenha somente um ponto de montagem vazio, use SSR, geração estática ou pré-renderização compatível com a base existente. Valide o `index.html` da saída real configurada pelo projeto, seja ela `dist`, `build`, `out` ou outra.
- Quando a aplicação usar pré-renderização, preserve a hidratação e as interações no navegador. Esta regra não se aplica a HTML estático tradicional.
- Use exatamente um H1 que descreva a proposta principal. Organize H2 e H3 em uma hierarquia lógica, sem escolher títulos apenas pelo tamanho visual.
- Use elementos semânticos como `header`, `nav`, `main`, `section`, `article`, `address` e `footer` quando apropriado.
- Dê identificadores descritivos às seções e mantenha as âncoras funcionais.
- Escreva texto alternativo útil para imagens informativas e deixe `alt=""` em elementos meramente decorativos.
- Exiba nome, OAB, telefone, e-mail, endereço e horários de forma consistente entre conteúdo visível, configurações, links, mapa e dados estruturados.

### Performance e experiência

- Identifique a imagem que representa o maior conteúdo visível inicial e priorize seu carregamento. Ela deve aparecer no HTML inicial como imagem rastreável sempre que fizer sentido, e não apenas como fundo CSS.
- Declare largura e altura das imagens para reduzir mudanças de layout. Use carregamento tardio somente nas imagens e iframes abaixo da primeira dobra.
- Otimize fotografias em WebP ou AVIF e use PNG ou SVG adequadamente para marcas. Não carregue arquivos originais muito maiores que o tamanho de exibição.
- Evite cascatas desnecessárias para fontes, scripts e estilos. Quando houver fontes externas, use preconnect ou hospedagem local de maneira consistente e não duplique solicitações.
- Preserve boa leitura, contraste, foco visível, navegação por teclado, botão de menu acessível e link para pular ao conteúdo quando aplicável.
- Verifique a primeira dobra, menus, textos longos, imagens, CTAs e formulários em celular, tablet e desktop. Corrija rolagem horizontal e conteúdo cortado.

### Validação SEO antes da entrega

Valide a versão que realmente será publicada: a própria pasta do template, no caso de HTML estático, ou a saída configurada do build, no caso de uma aplicação.

1. Sirva a pasta publicada localmente por HTTP e confirme resposta para página, `robots.txt`, `sitemap.xml`, favicon e imagem social.
2. Verifique que o HTML recebido sem executar JavaScript contém o conteúdo principal e exatamente um H1.
3. Confirme title, meta description, canonical, robots, Open Graph e URL da imagem social.
4. Faça o parse do JSON-LD e confirme que os tipos e dados correspondem ao conteúdo visível.
5. Confirme que sitemap e canonical usam o mesmo domínio público.
6. Verifique que não sobraram nomes, URLs, imagens, rotas ou schemas do template original.
7. Em aplicações, execute lint e build sem erros. Em HTML estático, valide a sintaxe dos arquivos e confirme que não há recursos ausentes ou erros no console.
8. Teste WhatsApp, telefone, e-mail, formulários, mapa, navegação, âncoras e links externos.
9. Faça inspeção visual da versão publicada em desktop e celular, independentemente da tecnologia usada.

Registre no projeto, em `SEO.md` ou documentação equivalente, o posicionamento trabalhado, as configurações de domínio, o que foi implementado, as pendências e o checklist posterior à publicação.

Após o site ser publicado, recomende à equipe verificar o domínio no Google Search Console, enviar o sitemap, testar os dados estruturados e manter o Perfil da Empresa no Google consistente com nome, endereço, telefone, horário e domínio do site.

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
- SEO técnico, local, semântico e de compartilhamento conforme a seção obrigatória deste prompt;
- título, descrição, canonical, favicon, imagem social e identidade visual;
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
- posicionamento de busca e itens de SEO implementados;
- informações pendentes;
- tecnologia preservada: HTML estático ou aplicação com build;
- resultado da validação da versão publicada, links e responsividade;
- resultado de lint e build quando esses scripts existirem, ou da validação direta de HTML, CSS e JavaScript no template estático;
- se o site está pronto ou bloqueado para publicação.
