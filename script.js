// script.js

// Estado da aplicação (banco de dados temporário na memória)
let campaigns = [];

// Elementos do DOM
const form = document.getElementById('campaignForm');
const tableBody = document.getElementById('campaignTableBody');
const aiInsightsList = document.getElementById('aiInsights');

// Elementos de Métricas Totais
const totalSpendEl = document.getElementById('totalSpend');
const totalRevenueEl = document.getElementById('totalRevenue');
const totalROIEl = document.getElementById('totalROI');
const healthStatusDot = document.getElementById('healthStatusDot');
const healthStatusText = document.getElementById('healthStatusText');

// Função para formatar moeda BRL
const formatBRL = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// 1. Ouvinte de evento do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede a página de recarregar

    // Capturar valores
    const name = document.getElementById('campName').value;
    const spend = parseFloat(document.getElementById('campSpend').value);
    const leads = parseInt(document.getElementById('campLeads').value);
    const sales = parseInt(document.getElementById('campSales').value);
    const revenue = parseFloat(document.getElementById('campRevenue').value);

    // Cálculos Básicos
    const cpl = leads > 0 ? spend / leads : 0;
    const conversion = leads > 0 ? (sales / leads) * 100 : 0;
    const roi = spend > 0 ? revenue / spend : 0;

    // Criar objeto da campanha
    const newCampaign = {
        name, spend, leads, sales, revenue, cpl, conversion, roi
    };

    // Adicionar ao "banco de dados"
    campaigns.push(newCampaign);

    // Atualizar a interface
    updateInterface();
    form.reset(); // Limpar formulário
    window.location.hash = "#dashboard"; // Rolar para o dashboard
});

// 2. Função principal para atualizar toda a interface
function updateInterface() {
    renderTable();
    updateTotalsAndHealth();
    generateAiInsights();
}

// 3. Renderizar a tabela de campanhas
function renderTable() {
    tableBody.innerHTML = ''; // Limpar tabela existente

    campaigns.forEach(camp => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50';

        // Definir cor do ROI
        let roiClass = 'font-semibold ';
        if (camp.roi >= 3) roiClass += 'text-green-600';
        else if (camp.roi < 1) roiClass += 'text-red-600';
        else roiClass += 'text-gray-700';

        row.innerHTML = `
            <td class="px-4 py-4 font-medium text-gray-800">${camp.name}</td>
            <td class="px-4 py-4">${formatBRL(camp.spend)}</td>
            <td class="px-4 py-4">${camp.leads}</td>
            <td class="px-4 py-4">${camp.sales}</td>
            <td class="px-4 py-4">${formatBRL(camp.cpl)}</td>
            <td class="px-4 py-4">${camp.conversion.toFixed(1)}%</td>
            <td class="px-4 py-4 ${roiClass}">${camp.roi.toFixed(1)}x</td>
        `;
        tableBody.appendChild(row);
    });
}

// 4. Atualizar Totais e Saúde do Negócio
function updateTotalsAndHealth() {
    const totalSpend = campaigns.reduce((sum, camp) => sum + camp.spend, 0);
    const totalRevenue = campaigns.reduce((sum, camp) => sum + camp.revenue, 0);
    const avgROI = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    totalSpendEl.innerText = formatBRL(totalSpend);
    totalRevenueEl.innerText = formatBRL(totalRevenue);
    totalROIEl.innerText = avgROI.toFixed(1) + 'x';

    // Lógica de Saúde do Negócio
    if (campaigns.length === 0) {
        healthStatusDot.className = 'w-3 h-3 rounded-full bg-gray-300';
        healthStatusText.innerText = 'Aguardando Dados';
        healthStatusText.className = 'text-lg font-semibold text-gray-600';
    } else if (avgROI >= 3) {
        healthStatusDot.className = 'w-3 h-3 rounded-full bg-green-500';
        healthStatusText.innerText = 'Crescendo (ROI Alto)';
        healthStatusText.className = 'text-lg font-semibold text-green-600';
    } else if (avgROI >= 1.5) {
        healthStatusDot.className = 'w-3 h-3 rounded-full bg-yellow-400';
        healthStatusText.innerText = 'Estável (ROI Médio)';
        healthStatusText.className = 'text-lg font-semibold text-yellow-600';
    } else {
        healthStatusDot.className = 'w-3 h-3 rounded-full bg-red-500';
        healthStatusText.innerText = 'Alerta (ROI Baixo)';
        healthStatusText.className = 'text-lg font-semibold text-red-600';
    }
}

// 5. Simulação da IA (Geração de Insights)
function generateAiInsights() {
    aiInsightsList.innerHTML = ''; // Limpar insights

    if (campaigns.length === 0) {
        aiInsightsList.innerHTML = '<li class="text-gray-500">Cadastre sua primeira campanha para receber análises.</li>';
        return;
    }

    const insights = [];

    // Encontrar melhor e pior campanha baseado no ROI
    let bestCamp = campaigns[0];
    let worstCamp = campaigns[0];

    campaigns.forEach(camp => {
        if (camp.roi > bestCamp.roi) bestCamp = camp;
        if (camp.roi < worstCamp.roi) worstCamp = camp;
    });

    // Insight 1: Elogio à melhor
    if (bestCamp.roi >= 2) {
        insights.push(`🌟 Excelente performance na campanha <strong>"${bestCamp.name}"</strong> (ROI ${bestCamp.roi.toFixed(1)}x). Considere aumentar o orçamento dela.`);
    }

    // Insight 2: Alerta à pior
    if (worstCamp.roi < 1 && worstCamp.spend > 50) {
        insights.push(`⚠️ Alerta na campanha <strong>"${worstCamp.name}"</strong>. Você está gastando mais do que faturando (ROI ${worstCamp.roi.toFixed(1)}x). Sugiro pausar ou revisar o anúncio imediatemente.`);
    }

    // Insight 3: Dica de conversão geral
    const totalLeads = campaigns.reduce((sum, camp) => sum + camp.leads, 0);
    const totalSales = campaigns.reduce((sum, camp) => sum + camp.sales, 0);
    const avgConv = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;

    if (avgConv < 3 && totalLeads > 20) {
        insights.push(`💡 Sua taxa de conversão geral está baixa (${avgConv.toFixed(1)}%). O problema pode não ser o anúncio, mas o seu atendimento no WhatsApp ou o preço no site.`);
    }

    // Adicionar insights à lista
    if (insights.length === 0) {
        aiInsightsList.innerHTML = '<li>A IA ainda está aprendendo com seus dados. Continue cadastrando.</li>';
    } else {
        insights.forEach(ins => {
            const li = document.createElement('li');
            li.innerHTML = ins;
            aiInsightsList.appendChild(li);
        });
    }
}
