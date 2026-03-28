/* ─── IA ESTRATÉGICA ─────────────────────────────────────────────────────────── */

/* ─── DADOS DE EXEMPLO (substituir pela API futuramente) ─────────────────────── */
const MOCK_SUGESTOES = [
  {
    titulo: "🐰 Páscoa Chocolateira",
    periodo: "28 de Março a 05 de Abril de 2026",
    oportunidade: "Segunda maior data do varejo brasileiro. Consumidores buscam chocolates artesanais, cestas personalizadas e experiências únicas — ticket médio 60% acima do normal.",
    conceito: "Campanha 'Faça a Páscoa Deles Inesquecível' com curadoria de kits por perfil (infantil, casal, corporativo). Embalagens exclusivas com mensagem personalizada. Lives de bastidores mostrando o processo artesanal geram engajamento orgânico alto.",
    canal: "Instagram + WhatsApp — conteúdo visual do produto + atendimento direto para pedidos personalizados.",
    investimento: "R$ 3.000 – R$ 6.000",
    resultado: "Estimativa: 180–320 leads | 40–70 conversões | ROI ~140%",
    urgencia: "Alta",
    urgenciaCor: "#EF4444",
  }
  {
    titulo: "💐 Campanha Dia das Mães",
    periodo: "25 de Abril a 11 de Maio de 2026",
    oportunidade: "Uma das datas mais lucrativas do varejo brasileiro — famílias buscam presentes emocionais e experiências marcantes.",
    conceito: "Campanha emocional centrada em histórias reais de mães e filhos. Conteúdo em vídeo curto com depoimentos, combinado com oferta especial 'Kit Mãe Especial'. Cada compra gera doação para projeto social maternal.",
    canal: "Instagram + E-mail Marketing — alcance visual + nutrição de base já conquistada.",
    investimento: "R$ 3.000 – R$ 6.000",
    resultado: "Estimativa: 180–320 leads | 40–70 conversões | ROI ~140%",
    urgencia: "Alta",
    urgenciaCor: "#EF4444",
  },
  {
    titulo: "🎓 Volta às Aulas Digital",
    periodo: "1 a 31 de Janeiro de 2026",
    oportunidade: "Pico de busca por cursos, materiais e ferramentas de estudo. Momento ideal para captura de leads qualificados.",
    conceito: "Série de conteúdos educativos gratuitos (mini e-books, checklists) como isca digital, seguidos de oferta de produto/serviço premium. Enfatizar produtividade e crescimento pessoal no início do ano.",
    canal: "Google Ads + LinkedIn — intenção de compra alta via busca ativa.",
    investimento: "R$ 2.000 – R$ 4.500",
    resultado: "Estimativa: 250–400 leads | 25–50 conversões | ROI ~110%",
    urgencia: "Média",
    urgenciaCor: "#F59E0B",
  },
  {
    titulo: "🛍️ Pre-Black Friday",
    periodo: "1 a 27 de Novembro de 2026",
    oportunidade: "Consumidores pesquisam antes da Black Friday. Quem ativa lista de espera e antecipa oferta sai na frente da concorrência.",
    conceito: "Estratégia em 3 fases: Aquecimento (conteúdo de antecipação), Lista VIP (captura de e-mails com acesso antecipado) e Lançamento (oferta exclusiva 48h antes do dia oficial). Criar senso de escassez real.",
    canal: "E-mail Marketing + WhatsApp — canais diretos com maior taxa de abertura.",
    investimento: "R$ 5.000 – R$ 10.000",
    resultado: "Estimativa: 500–900 leads | 120–200 conversões | ROI ~200%",
    urgencia: "Alta",
    urgenciaCor: "#EF4444",
  },
  {
    titulo: "❤️ Dia dos Namorados",
    periodo: "1 a 12 de Junho de 2026",
    oportunidade: "Segunda data mais importante para presentes no Brasil. Ticket médio alto e decisão de compra emocional.",
    conceito: "Campanha 'Surpreenda de Verdade' com curadoria de presentes por perfil (aventureiro, romântico, criativo). Quiz interativo que recomenda produto ideal e coleta dados para remarketing.",
    canal: "Instagram + TikTok — conteúdo visual e dinâmico para geração Z e millennials.",
    investimento: "R$ 2.500 – R$ 5.000",
    resultado: "Estimativa: 150–280 leads | 35–65 conversões | ROI ~125%",
    urgencia: "Média",
    urgenciaCor: "#F59E0B",
  },
];

const MOCK_ANALISE = `🏆 MELHORES CAMPANHAS

▸ Lançamento Verão — ROI de 206%. Investimento de R$ 3.200 gerou R$ 9.800 em receita. Canal Instagram performou acima da média com excelente custo por lead (R$ 15,24). Campanha modelo para replicar.

▸ Retenção Q1 — Sem leads diretos, mas 30 conversões no WhatsApp indicam base aquecida. Custo por conversão de R$ 83,33 — muito eficiente para retenção.

⚠️ PONTOS DE ATENÇÃO

▸ Dia das Mães e Black Friday ainda não iniciaram investimento (R$ 0 investido). Risco de execução tardia comprometer resultados. Recomenda-se iniciar ativações de aquecimento imediatamente.

▸ Nenhuma campanha ativa em Google Ads ou TikTok — canais com alto potencial inexplorado no mix atual.

💡 RECOMENDAÇÕES ESTRATÉGICAS

1. Replicar estrutura da campanha Verão nos próximos lançamentos sazonais
2. Criar calendário de conteúdo para aquecimento do Dia das Mães já nessa semana
3. Testar Google Ads com verba pequena (R$ 500) para validar novo canal
4. Implementar fluxo de e-mail pós-compra para aumentar LTV dos 48 conversores do Verão
5. Definir metas de leads para Black Friday e criar lista de espera VIP agora

📊 INSIGHTS DE DADOS

▸ Canal mais eficiente: WhatsApp (retenção) e Instagram (aquisição)
▸ Melhor período: Março (campanha ativa com ROI 206%)
▸ Público com mais retorno: Clientes ativos (retenção supera aquisição em custo)
▸ Gap identificado: Sem campanha entre Junho e Novembro — janela desperdiçada

🚀 PRÓXIMOS PASSOS (4 semanas)

Semana 1 — Ativar orçamento inicial de R$ 800 para aquecimento Dia das Mães no Instagram
Semana 2 — Criar automação de e-mail para base de leads do Verão
Semana 3 — Configurar campanha de teste no Google Ads (R$ 300 de verba piloto)
Semana 4 — Revisar métricas e ajustar estratégia Black Friday com base nos dados coletados`;

const MOCK_CONSULTA = `Ótima pergunta! Para melhorar o ROI das suas campanhas, os principais alavancas são:

1. SEGMENTAÇÃO MAIS PRECISA
Revise o público-alvo das campanhas com menor retorno. Audiências muito amplas aumentam o custo por clique sem gerar conversões qualificadas. Use dados de campanhas que já funcionaram (como o Lançamento Verão) para criar públicos semelhantes.

2. FUNIL DE NUTRIÇÃO
Nem todo lead compra na primeira interação. Configure uma sequência de e-mails ou mensagens WhatsApp para nutrir contatos ao longo de 7–14 dias antes de apresentar a oferta principal.

3. TESTE A/B DE CRIATIVOS
Pequenas mudanças em título, imagem ou chamada para ação podem dobrar a taxa de conversão. Teste pelo menos 2 versões de cada anúncio e mantenha apenas o vencedor após 3–5 dias.

4. REVISÃO DO TICKET MÉDIO
ROI alto nem sempre significa lucro real. Verifique se o ticket médio cobre CAC (custo de aquisição) + custo do produto. Upsell e cross-sell pós-compra são formas eficientes de aumentar receita sem aumentar investimento.

5. TIMING DAS CAMPANHAS
Dados indicam que campanhas sazonais (datas comemorativas) têm ROI 40–80% superior a campanhas genéricas. Alinhe seu calendário às datas do mercado brasileiro.

Quer que eu detalhe algum desses pontos com exemplos práticos para o seu segmento?`;

/* ─── SIMULAÇÃO DE LOADING ───────────────────────────────────────────────────── */
function simularLoading(ms = 1400) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ─── RENDER ─────────────────────────────────────────────────────────────────── */
function renderIA() {
  const el = document.getElementById("tab-ia");
  const MODES = [
    { id:"sugestoes", label:"💡 Sugestões", sub:"Próximas campanhas" },
    { id:"analise",   label:"📊 Análise",   sub:"Performance atual" },
    { id:"consulta",  label:"💬 Consultor", sub:"Tire dúvidas" },
  ];

  el.innerHTML = `
    <div class="page-header">
      <h1>IA Estratégica</h1>
      <p>Inteligência artificial para otimizar suas campanhas</p>
    </div>
    <div class="ia-mode-grid">
      ${MODES.map(m => `
        <button class="ia-mode-btn${iaMode === m.id ? " active" : ""}" onclick="setIAMode('${m.id}')">
          <div class="ia-mode-label">${m.label}</div>
          <div class="ia-mode-sub">${m.sub}</div>
        </button>`).join("")}
    </div>
    <div class="card" style="padding:24px">
      <div id="ia-input-area">
        ${iaMode !== "consulta" ? `
          <div class="ia-input-row">
            <label class="lbl" style="margin-top:0">SEU SEGMENTO (opcional)</label>
            <div class="flex-row">
              <input id="ia-segmento" class="inp" style="flex:1" placeholder="Ex: moda, restaurante, tecnologia, educação..." />
              <button class="btn-ia" onclick="runIA()">✦ ${iaMode === "sugestoes" ? "Gerar Sugestões" : "Analisar Campanhas"}</button>
            </div>
          </div>` : `
          <div class="ia-input-row">
            <label class="lbl" style="margin-top:0">FAÇA SUA PERGUNTA</label>
            <div class="flex-row">
              <input id="ia-pergunta" class="inp" style="flex:1" placeholder="Ex: Como melhorar meu ROI? Qual canal usar para lançamento?" onkeydown="if(event.key==='Enter') runIA()" />
              <button class="btn-ia" onclick="runIA()">✦ Perguntar</button>
            </div>
          </div>`}
      </div>
      <div id="ia-output">
        <div class="ia-empty">
          <div class="ia-empty-icon">✦</div>
          <div class="ia-empty-title">IA Pronta</div>
          <div class="ia-empty-sub">${
            iaMode === "sugestoes"
              ? "Clique em Gerar Sugestões para receber ideias de campanhas"
              : iaMode === "analise"
              ? "Clique em Analisar para receber insights das suas campanhas"
              : "Digite sua dúvida sobre marketing e a IA responderá"
          }</div>
        </div>
      </div>
    </div>
  `;
}

function setIAMode(m) {
  iaMode = m;
  renderIA();
}

/* ─── RUNNER PRINCIPAL ───────────────────────────────────────────────────────── */
async function runIA() {
  const pergunta = document.getElementById("ia-pergunta")?.value || "";
  if (iaMode === "consulta" && !pergunta.trim()) return;

  const output = document.getElementById("ia-output");
  const btn = document.querySelector("#ia-input-area .btn-ia");

  /* Loading state */
  output.innerHTML = `<div class="ia-loading"><div class="ia-spinner"></div><div class="ia-loading-text">IA processando...</div></div>`;
  if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spin-inline">◌</span> Analisando...`; }

  await simularLoading(1400);

  /* Renderiza mock por modo */
  if (iaMode === "sugestoes") {
    output.innerHTML = MOCK_SUGESTOES.map((s, i) => `
      <div class="ia-suggestion-card" style="border-left-color:${COLS[i % COLS.length]};animation-delay:${i * 80}ms">
        <div class="ia-sug-header">
          <span class="ia-sug-titulo">${s.titulo}</span>
          <span class="ia-urgencia-badge" style="background:${s.urgenciaCor}22;color:${s.urgenciaCor}">
            ⚡ Urgência ${s.urgencia}
          </span>
        </div>
        <div class="ia-sug-grid">
          <div class="ia-sug-item">
            <span class="ia-sug-label">📆 PERÍODO</span>
            <span class="ia-sug-val">${s.periodo}</span>
          </div>
          <div class="ia-sug-item">
            <span class="ia-sug-label">💰 INVESTIMENTO</span>
            <span class="ia-sug-val">${s.investimento}</span>
          </div>
          <div class="ia-sug-item">
            <span class="ia-sug-label">📣 CANAL</span>
            <span class="ia-sug-val">${s.canal}</span>
          </div>
          <div class="ia-sug-item">
            <span class="ia-sug-label">📊 RESULTADO ESPERADO</span>
            <span class="ia-sug-val">${s.resultado}</span>
          </div>
        </div>
        <div class="ia-sug-section">
          <span class="ia-sug-label">🎯 OPORTUNIDADE</span>
          <p class="ia-sug-text">${s.oportunidade}</p>
        </div>
        <div class="ia-sug-section">
          <span class="ia-sug-label">💡 CONCEITO</span>
          <p class="ia-sug-text">${s.conceito}</p>
        </div>
        <button class="ia-sug-cta" onclick="openNewModal()">+ Criar esta campanha</button>
      </div>
    `).join("");

  } else if (iaMode === "analise") {
    output.innerHTML = `<div class="ia-result ia-analise-result">${MOCK_ANALISE}</div>`;

  } else {
    output.innerHTML = `
      <div class="ia-consulta-result">
        <div class="ia-consulta-pergunta">
          <span class="ia-consulta-icon">💬</span>
          <span class="ia-consulta-q">${pergunta || "Como melhorar meu ROI?"}</span>
        </div>
        <div class="ia-consulta-resposta">${MOCK_CONSULTA}</div>
      </div>`;
  }

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `✦ ${iaMode === "sugestoes" ? "Gerar Sugestões" : iaMode === "analise" ? "Analisar Campanhas" : "Perguntar"}`;
  }
}