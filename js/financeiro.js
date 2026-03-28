/* ─── FINANCEIRO ─────────────────────────────────────────────────────────────── */
function renderFinanceiro() {
  const el = document.getElementById("tab-financeiro");

  const rows = campaigns.map(c => {
    const inv  = Number(c.investido  || 0);
    const rec  = Number(c.receita    || 0);
    const orc  = Number(c.orcamento  || 0);
    const lucro = rec - inv;
    const roi  = inv > 0 ? (((rec - inv) / inv) * 100).toFixed(1) : null;
    const leads = Number(c.leads || 0);
    const conversoes = Number(c.conversoes || 0);
    const cpl  = leads > 0 ? (inv / leads).toFixed(2) : null; // R$ por lead
    // CPConv agora é taxa de conversão em % (conversões / leads * 100)
    const cpconv = (conversoes > 0 && leads > 0) ? ((conversoes / leads) * 100).toFixed(1) : null;
    const gap  = orc - inv;
    return { ...c, inv, rec, orc, lucro, roi, cpl, cpconv, gap };
  });

  const totOrc   = rows.reduce((a, r) => a + r.orc, 0);
  const totInv   = rows.reduce((a, r) => a + r.inv, 0);
  const totRec   = rows.reduce((a, r) => a + r.rec, 0);
  const totLucro = totRec - totInv;
  const totRoi   = totInv > 0 ? (((totRec - totInv) / totInv) * 100).toFixed(1) : 0;

  const summaries = [
    { label:"Orçamento Total", v:currency(totOrc),   color:"#3B82F6" },
    { label:"Total Investido", v:currency(totInv),   color:"#7C3AED" },
    { label:"Receita Total",   v:currency(totRec),   color:"#10B981" },
    { label:"Lucro / Prejuízo",v:currency(totLucro), color: totLucro >= 0 ? "#10B981" : "#EF4444" },
    { label:"ROI Geral",       v:`${totRoi}%`,        color: Number(totRoi) >= 0 ? "#10B981" : "#EF4444" },
  ];

  el.innerHTML = `
    <div class="page-header">
      <h1>Financeiro</h1>
      <p>Custos, investimentos, receitas e ROI por campanha</p>
    </div>
    <div class="grid-5" style="margin-bottom:22px">
      ${summaries.map(k => `
        <div class="card" style="padding:16px 18px">
          <div style="color:rgba(255,255,255,.35);font-size:10px;font-weight:700;letter-spacing:1.4px;margin-bottom:6px">${k.label.toUpperCase()}</div>
          <div style="color:${k.color};font-weight:800;font-size:18px">${k.v}</div>
        </div>`).join("")}
    </div>
    <div class="card fin-table-wrap">
      <table>
        <thead>
          <tr>${["Campanha","Status","Orçamento","Investido","Saldo","Receita","Lucro","ROI","CPL","CPConv"].map(h => `<th>${h.toUpperCase()}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map(r => {
            const cfg = statusCfg(r.status);
            return `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:8px;height:8px;border-radius:2px;background:${r.cor};flex-shrink:0"></div>
                    <span style="color:#fff;font-weight:600;white-space:nowrap">${r.nome}</span>
                  </div>
                </td>
                <td><span class="status-badge" style="background:${cfg.bg};color:${cfg.color}">${r.status}</span></td>
                <td style="color:rgba(255,255,255,.6)">${currency(r.orc)}</td>
                <td style="color:#3B82F6;font-weight:600">${currency(r.inv)}</td>
                <td style="color:${r.gap >= 0 ? "#10B981" : "#EF4444"};font-weight:600">${currency(r.gap)}</td>
                <td style="color:#10B981;font-weight:600">${currency(r.rec)}</td>
                <td style="color:${r.lucro >= 0 ? "#10B981" : "#EF4444"};font-weight:700">${currency(r.lucro)}</td>
                <td style="color:${r.roi === null ? "rgba(255,255,255,.2)" : Number(r.roi) >= 0 ? "#10B981" : "#EF4444"};font-weight:700">${r.roi !== null ? `${r.roi}%` : "—"}</td>
                <td style="color:rgba(255,255,255,.5)">${r.cpl ? `R$ ${r.cpl}` : "—"}</td>
                <td style="color:rgba(255,255,255,.5)">${r.cpconv !== null ? `${r.cpconv}%` : "—"}</td>
              </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}
