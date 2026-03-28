import { useState, useRef } from "react";

// ─── CONSTANTS & HELPERS ──────────────────────────────────────────────────────
const T = new Date();
const pad = n => String(n).padStart(2,"0");
const fmt = d => `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
const fmtI = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseD = s => { const[y,m,d]=s.split("-"); return new Date(+y,+m-1,+d); };
const currency = v => `R$ ${Number(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}`;
const daysInMonth = (y,m) => new Date(y,m+1,0).getDate();
const firstDay = (y,m) => new Date(y,m,1).getDay();

const MONTHS=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const CANAIS=["Instagram","Facebook","Google Ads","TikTok","YouTube","E-mail Marketing","WhatsApp","LinkedIn","Multi-canal","Outros"];
const STATUS_LIST=["Planejada","Ativa","Pausada","Encerrada"];
const OBJETIVOS=["Gerar vendas","Aumentar seguidores","Gerar leads","Reconhecimento de marca","Lançamento de produto","Retenção de clientes","Outro"];
const COLS=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#EC4899","#06B6D4","#84CC16","#F97316","#6366F1"];

const BR_DATES={
  "01-01":"🎆 Ano Novo","02-12":"🎭 Carnaval","02-13":"🎭 Carnaval","04-18":"✝ Sexta Santa",
  "04-20":"🐣 Páscoa","05-01":"👷 Dia do Trabalho","05-11":"💐 Dia das Mães",
  "06-12":"❤️ Dia dos Namorados","08-10":"👔 Dia dos Pais","09-07":"🇧🇷 Independência",
  "10-12":"👑 N.Sra.Aparecida","10-31":"🎃 Halloween","11-02":"🕯 Finados",
  "11-15":"🇧🇷 Proclamação","11-28":"🛍 Black Friday","12-24":"🎄 Véspera Natal","12-25":"🎁 Natal","12-31":"🥂 Réveillon"
};

const statusCfg = s=>({
  Ativa:     {bg:"rgba(16,185,129,.15)",color:"#10B981",dot:"#10B981"},
  Planejada: {bg:"rgba(59,130,246,.15)", color:"#3B82F6",dot:"#3B82F6"},
  Pausada:   {bg:"rgba(245,158,11,.15)", color:"#F59E0B",dot:"#F59E0B"},
  Encerrada: {bg:"rgba(100,100,120,.15)",color:"#888",   dot:"#666"},
}[s]||{bg:"rgba(100,100,120,.15)",color:"#888",dot:"#666"});

const INIT_CAMPAIGNS = [
  {id:1,nome:"Lançamento Verão",inicio:"2026-03-01",fim:"2026-03-31",status:"Ativa",canal:"Instagram",objetivo:"Gerar vendas",orcamento:5000,investido:3200,receita:9800,leads:210,conversoes:48,descricao:"Campanha de lançamento coleção verão",cor:COLS[0],publico:"25-35 anos",tags:["verão","moda"]},
  {id:2,nome:"Dia das Mães",inicio:"2026-04-25",fim:"2026-05-11",status:"Planejada",canal:"Multi-canal",objetivo:"Gerar vendas",orcamento:8000,investido:0,receita:0,leads:0,conversoes:0,descricao:"Campanha especial Dia das Mães",cor:COLS[1],publico:"30-55 anos",tags:["datas","mães"]},
  {id:3,nome:"Black Friday",inicio:"2026-11-20",fim:"2026-11-30",status:"Planejada",canal:"E-mail Marketing",objetivo:"Gerar vendas",orcamento:12000,investido:0,receita:0,leads:0,conversoes:0,descricao:"Promoções especiais Black Friday",cor:COLS[2],publico:"Geral",tags:["black friday","desconto"]},
  {id:4,nome:"Retenção Q1",inicio:"2026-01-10",fim:"2026-02-28",status:"Encerrada",canal:"WhatsApp",objetivo:"Retenção de clientes",orcamento:2500,investido:2500,receita:6200,leads:0,conversoes:30,descricao:"Campanha de retenção de clientes do Q1",cor:COLS[4],publico:"Clientes ativos",tags:["retenção"]},
];

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const card = {background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14};
const INP = {width:"100%",padding:"10px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#f0f0f0",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,outline:"none",boxSizing:"border-box"};
const LBL = {color:"rgba(255,255,255,0.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1.4,display:"block",marginBottom:5,marginTop:14};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({tab,setTab}){
  const items=[
    {id:"dashboard",icon:"⊞",label:"Dashboard"},
    {id:"campanhas",icon:"◈",label:"Campanhas"},
    {id:"calendario",icon:"◫",label:"Calendário"},
    {id:"financeiro",icon:"◎",label:"Financeiro"},
    {id:"ia",icon:"✦",label:"IA Estratégica"},
  ];
  return(
    <aside style={{width:220,background:"#0c0c18",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:100}}>
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(135deg,#2563EB,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:900,color:"#fff"}}>C</div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:15,fontFamily:"'Plus Jakarta Sans',sans-serif",letterSpacing:.5}}>CampaignOS</div>
            <div style={{color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:500,letterSpacing:1.5}}>PLATAFORMA</div>
          </div>
        </div>
      </div>
      <nav style={{flex:1,padding:"14px 10px"}}>
        {items.map(it=>{
          const active=tab===it.id;
          return(
            <button key={it.id} onClick={()=>setTab(it.id)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 14px",borderRadius:10,border:"none",cursor:"pointer",background:active?"rgba(37,99,235,0.18)":"transparent",color:active?"#fff":"rgba(255,255,255,0.4)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:active?700:400,marginBottom:3,transition:"all .2s",textAlign:"left",borderLeft:active?"2px solid #2563EB":"2px solid transparent"}}>
              <span style={{fontSize:15,opacity:.9}}>{it.icon}</span>{it.label}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"14px 10px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#10B981"}}/>
          <span style={{color:"rgba(255,255,255,0.3)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>IA Conectada</span>
        </div>
      </div>
    </aside>
  );
}

// ─── MODAL CRIAR/EDITAR CAMPANHA ──────────────────────────────────────────────
function CampaignModal({onClose,onSave,editing,onAI}){
  const blank={nome:"",inicio:fmtI(T),fim:fmtI(new Date(T.getFullYear(),T.getMonth(),T.getDate()+30)),status:"Planejada",canal:"Instagram",objetivo:"Gerar vendas",orcamento:"",investido:"",receita:"",leads:"",conversoes:"",descricao:"",publico:"",cor:COLS[Math.floor(Math.random()*COLS.length)],tags:[]};
  const[form,setForm]=useState(editing||blank);
  const[aiLoading,setAiLoading]=useState(false);
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));

  const gerarIA=async()=>{
    if(!form.nome){alert("Preencha o nome da campanha primeiro.");return;}
    setAiLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:900,
        messages:[{role:"user",content:`Você é especialista em marketing digital. Preencha os campos desta campanha com base nas informações fornecidas.

Nome: ${form.nome}
Canal: ${form.canal}
Objetivo: ${form.objetivo}
Público: ${form.publico||"não informado"}
Orçamento: ${form.orcamento?"R$"+form.orcamento:"não informado"}

Responda APENAS em JSON válido, sem markdown:
{
  "descricao": "descrição completa da campanha (3 linhas)",
  "resultado_esperado_leads": número estimado de leads,
  "resultado_esperado_conversoes": número estimado de conversões,
  "receita_esperada": valor em reais estimado,
  "publico_refinado": "público-alvo refinado e detalhado",
  "tags": ["tag1","tag2","tag3"],
  "dica_estrategica": "dica prática para essa campanha (2 linhas)"
}`}]
      })});
      const d=await r.json();
      const txt=d.content?.[0]?.text||"{}";
      const clean=txt.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setForm(p=>({...p,
        descricao:parsed.descricao||p.descricao,
        leads:parsed.resultado_esperado_leads||p.leads,
        conversoes:parsed.resultado_esperado_conversoes||p.conversoes,
        receita:parsed.receita_esperada||p.receita,
        publico:parsed.publico_refinado||p.publico,
        tags:parsed.tags||p.tags,
        _dica:parsed.dica_estrategica
      }));
    }catch(e){console.error(e);}
    setAiLoading(false);
  };

  const roi=form.orcamento&&form.receita?((((Number(form.receita)-Number(form.orcamento))/Number(form.orcamento))*100).toFixed(1)):null;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)"}}>
      <div style={{background:"#111122",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:0,width:660,maxHeight:"94vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.7)"}}>
        {/* Header */}
        <div style={{padding:"24px 28px 20px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#111122",zIndex:10}}>
          <div>
            <h2 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:19}}>{editing?"Editar Campanha":"Nova Campanha"}</h2>
            <p style={{color:"rgba(255,255,255,0.3)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:2}}>Preencha manualmente ou use a IA para completar</p>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:"none",color:"#888",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        <div style={{padding:"4px 28px 28px"}}>
          {/* AI Button */}
          <button onClick={gerarIA} disabled={aiLoading} style={{width:"100%",marginTop:18,padding:"13px",border:"1px dashed rgba(124,58,237,.4)",cursor:aiLoading?"not-allowed":"pointer",borderRadius:12,background:"rgba(124,58,237,.08)",color:aiLoading?"#888":"#a78bfa",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .2s"}}>
            {aiLoading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>IA preenchendo campos...</>:<><span>✦</span>Completar com IA (preencha nome, canal e objetivo antes)</>}
          </button>

          {form._dica&&(
            <div style={{marginTop:12,padding:"12px 16px",background:"rgba(124,58,237,.1)",border:"1px solid rgba(124,58,237,.2)",borderRadius:10}}>
              <div style={{color:"#a78bfa",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,marginBottom:4}}>💡 Dica da IA</div>
              <div style={{color:"rgba(255,255,255,.6)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{form._dica}</div>
            </div>
          )}

          <label style={LBL}>NOME DA CAMPANHA *</label>
          <input style={INP} value={form.nome} onChange={e=>set("nome",e.target.value)} placeholder="Ex: Black Friday 2026" />

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={LBL}>INÍCIO</label><input type="date" style={INP} value={form.inicio} onChange={e=>set("inicio",e.target.value)}/></div>
            <div><label style={LBL}>FIM</label><input type="date" style={INP} value={form.fim} onChange={e=>set("fim",e.target.value)}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={LBL}>CANAL</label><select style={INP} value={form.canal} onChange={e=>set("canal",e.target.value)}>{CANAIS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label style={LBL}>OBJETIVO</label><select style={INP} value={form.objetivo} onChange={e=>set("objetivo",e.target.value)}>{OBJETIVOS.map(o=><option key={o}>{o}</option>)}</select></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={LBL}>STATUS</label><select style={INP} value={form.status} onChange={e=>set("status",e.target.value)}>{STATUS_LIST.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={LBL}>PÚBLICO-ALVO</label><input style={INP} value={form.publico} onChange={e=>set("publico",e.target.value)} placeholder="Ex: Mulheres 25-40 anos"/></div>
          </div>

          <div style={{marginTop:18,padding:"16px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12}}>
            <div style={{color:"rgba(255,255,255,.5)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1.4,marginBottom:12}}>💰 DADOS FINANCEIROS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
              <div><label style={{...LBL,marginTop:0}}>ORÇAMENTO (R$)</label><input type="number" style={INP} value={form.orcamento} onChange={e=>set("orcamento",e.target.value)} placeholder="0"/></div>
              <div><label style={{...LBL,marginTop:0}}>INVESTIDO (R$)</label><input type="number" style={INP} value={form.investido} onChange={e=>set("investido",e.target.value)} placeholder="0"/></div>
              <div><label style={{...LBL,marginTop:0}}>RECEITA (R$)</label><input type="number" style={INP} value={form.receita} onChange={e=>set("receita",e.target.value)} placeholder="0"/></div>
            </div>
            {roi&&<div style={{marginTop:10,padding:"8px 12px",background:Number(roi)>=0?"rgba(16,185,129,.1)":"rgba(239,68,68,.1)",borderRadius:8,color:Number(roi)>=0?"#10B981":"#EF4444",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>ROI estimado: {roi}%</div>}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={LBL}>LEADS ESPERADOS</label><input type="number" style={INP} value={form.leads} onChange={e=>set("leads",e.target.value)} placeholder="0"/></div>
            <div><label style={LBL}>CONVERSÕES ESPERADAS</label><input type="number" style={INP} value={form.conversoes} onChange={e=>set("conversoes",e.target.value)} placeholder="0"/></div>
          </div>

          <label style={LBL}>DESCRIÇÃO / ESTRATÉGIA</label>
          <textarea style={{...INP,resize:"vertical",minHeight:72}} value={form.descricao} onChange={e=>set("descricao",e.target.value)} placeholder="Descreva o objetivo, estratégia e detalhes da campanha..."/>

          <label style={LBL}>COR DA CAMPANHA</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
            {COLS.map(c=><button key={c} onClick={()=>set("cor",c)} style={{width:26,height:26,borderRadius:"50%",background:c,border:form.cor===c?"3px solid #fff":"3px solid transparent",cursor:"pointer",outline:"none",transition:"border .15s"}}/>)}
          </div>

          <div style={{display:"flex",gap:10,marginTop:22}}>
            <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:10,border:"1px solid rgba(255,255,255,.08)",background:"transparent",color:"#aaa",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,cursor:"pointer"}}>Cancelar</button>
            <button onClick={()=>onSave(form)} disabled={!form.nome} style={{flex:2,padding:"12px",borderRadius:10,border:"none",cursor:form.nome?"pointer":"not-allowed",background:form.nome?"linear-gradient(90deg,#2563EB,#7C3AED)":"rgba(255,255,255,.05)",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,boxShadow:form.nome?"0 4px 20px rgba(37,99,235,.35)":"none",transition:"all .2s"}}>
              {editing?"Salvar Alterações":"Criar Campanha"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({campaigns,setTab}){
  const ativas=campaigns.filter(c=>c.status==="Ativa");
  const totalOrc=campaigns.reduce((a,c)=>a+Number(c.orcamento||0),0);
  const totalInv=campaigns.reduce((a,c)=>a+Number(c.investido||0),0);
  const totalRec=campaigns.reduce((a,c)=>a+Number(c.receita||0),0);
  const totalLeads=campaigns.reduce((a,c)=>a+Number(c.leads||0),0);
  const totalConv=campaigns.reduce((a,c)=>a+Number(c.conversoes||0),0);
  const roi=totalInv>0?(((totalRec-totalInv)/totalInv)*100).toFixed(1):0;
  const roiPos=Number(roi)>=0;

  const kpis=[
    {label:"Total Investido",value:currency(totalInv),sub:`Orçado: ${currency(totalOrc)}`,color:"#2563EB",icon:"💰"},
    {label:"Receita Gerada",value:currency(totalRec),sub:`ROI: ${roi}%`,color:roiPos?"#10B981":"#EF4444",icon:"📈"},
    {label:"Leads Gerados",value:totalLeads.toLocaleString(),sub:`${totalConv} conversões`,color:"#7C3AED",icon:"👥"},
    {label:"Campanhas Ativas",value:ativas.length,sub:`de ${campaigns.length} total`,color:"#F59E0B",icon:"🚀"},
  ];

  const top=[...campaigns].filter(c=>Number(c.receita)>0).sort((a,b)=>Number(b.receita)-Number(a.receita)).slice(0,4);

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:24}}>
        <h1 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24}}>Dashboard</h1>
        <p style={{color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>Visão geral de todas as campanhas · {fmt(T)}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {kpis.map(k=>(
          <div key={k.label} style={{...card,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:16,right:16,fontSize:22,opacity:.6}}>{k.icon}</div>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1.4,marginBottom:8}}>{k.label.toUpperCase()}</div>
            <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:22,marginBottom:4}}>{k.value}</div>
            <div style={{color:k.color,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>{k.sub}</div>
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${k.color}40,${k.color})`}}/>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:16,marginBottom:16}}>
        {/* Top Campanhas */}
        <div style={{...card,padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>Top Campanhas por Receita</div>
            <button onClick={()=>setTab("campanhas")} style={{color:"#2563EB",background:"none",border:"none",cursor:"pointer",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>Ver todas →</button>
          </div>
          {top.length===0&&<div style={{color:"rgba(255,255,255,.2)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",textAlign:"center",padding:30}}>Nenhuma campanha com receita ainda</div>}
          {top.map((c,i)=>{
            const pct=totalRec>0?((Number(c.receita)/totalRec)*100).toFixed(0):0;
            const cfg=statusCfg(c.status);
            return(
              <div key={c.id} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:10,height:10,borderRadius:3,background:c.cor,flexShrink:0}}/>
                    <span style={{color:"rgba(255,255,255,.8)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600}}>{c.nome}</span>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{color:"#10B981",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>{currency(c.receita)}</span>
                    <span style={{padding:"1px 7px",borderRadius:20,fontSize:10,background:cfg.bg,color:cfg.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>{c.status}</span>
                  </div>
                </div>
                <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.06)"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:c.cor,borderRadius:3,transition:"width 1s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                  <span style={{color:"rgba(255,255,255,.25)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{c.canal}</span>
                  <span style={{color:"rgba(255,255,255,.25)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{pct}% da receita total</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo Financeiro */}
        <div style={{...card,padding:22}}>
          <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,marginBottom:18}}>Resumo Financeiro</div>
          {[
            {label:"Orçamento Total",value:totalOrc,color:"#2563EB"},
            {label:"Total Investido",value:totalInv,color:"#7C3AED"},
            {label:"Receita Total",value:totalRec,color:"#10B981"},
            {label:"Lucro / Prejuízo",value:totalRec-totalInv,color:(totalRec-totalInv)>=0?"#10B981":"#EF4444"},
          ].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:3,height:18,borderRadius:2,background:r.color}}/>
                <span style={{color:"rgba(255,255,255,.5)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{r.label}</span>
              </div>
              <span style={{color:r.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14}}>{currency(r.value)}</span>
            </div>
          ))}
          <div style={{marginTop:16,padding:"12px 14px",background:roiPos?"rgba(16,185,129,.08)":"rgba(239,68,68,.08)",border:`1px solid ${roiPos?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)"}`,borderRadius:10,textAlign:"center"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1,marginBottom:4}}>ROI GERAL</div>
            <div style={{color:roiPos?"#10B981":"#EF4444",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:28}}>{roi}%</div>
          </div>
        </div>
      </div>

      {/* Campanhas Ativas agora */}
      {ativas.length>0&&(
        <div style={{...card,padding:22}}>
          <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,marginBottom:14}}>
            <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:"#10B981",marginRight:8,animation:"pulse 2s infinite"}}/>
            Campanhas em Andamento
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
            {ativas.map(c=>{
              const start=parseD(c.inicio),end=parseD(c.fim);
              const total=(end-start)/86400000;
              const elapsed=Math.max(0,Math.min(total,(T-start)/86400000));
              const pct=total>0?Math.round((elapsed/total)*100):0;
              return(
                <div key={c.id} style={{background:"rgba(255,255,255,.03)",border:`1px solid ${c.cor}30`,borderRadius:12,padding:16,borderLeft:`3px solid ${c.cor}`}}>
                  <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,marginBottom:4}}>{c.nome}</div>
                  <div style={{color:"rgba(255,255,255,.4)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:10}}>{c.canal} · até {fmt(end)}</div>
                  <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.06)"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:c.cor,borderRadius:2}}/>
                  </div>
                  <div style={{color:"rgba(255,255,255,.25)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:4}}>{pct}% do período</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CAMPANHAS ────────────────────────────────────────────────────────────────
function Campanhas({campaigns,onEdit,onDelete,onNew}){
  const[filter,setFilter]=useState("Todas");
  const[search,setSearch]=useState("");
  const filtered=campaigns.filter(c=>{
    const matchS=filter==="Todas"||c.status===filter;
    const matchQ=c.nome.toLowerCase().includes(search.toLowerCase())||c.canal.toLowerCase().includes(search.toLowerCase());
    return matchS&&matchQ;
  });

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h1 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24}}>Campanhas</h1>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>{campaigns.length} campanhas cadastradas</p>
        </div>
        <button onClick={onNew} style={{padding:"11px 22px",border:"none",cursor:"pointer",borderRadius:10,background:"linear-gradient(90deg,#2563EB,#7C3AED)",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,boxShadow:"0 4px 16px rgba(37,99,235,.35)"}}>+ Nova Campanha</button>
      </div>

      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar campanha..." style={{...INP,width:220,flex:"none"}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["Todas",...STATUS_LIST].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{padding:"8px 14px",borderRadius:8,border:"none",cursor:"pointer",background:filter===s?"rgba(37,99,235,.2)":"rgba(255,255,255,.04)",color:filter===s?"#3B82F6":"rgba(255,255,255,.4)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:filter===s?700:400,transition:"all .2s"}}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gap:10}}>
        {filtered.length===0&&<div style={{textAlign:"center",padding:60,color:"rgba(255,255,255,.2)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Nenhuma campanha encontrada</div>}
        {filtered.map(c=>{
          const start=parseD(c.inicio),end=parseD(c.fim);
          const total=(end-start)/86400000;
          const elapsed=Math.max(0,Math.min(total,(T-start)/86400000));
          const pct=total>0?Math.round((elapsed/total)*100):0;
          const cfg=statusCfg(c.status);
          const roi=Number(c.investido)>0?(((Number(c.receita)-Number(c.investido))/Number(c.investido))*100).toFixed(1):null;
          return(
            <div key={c.id} style={{...card,padding:20,display:"grid",gridTemplateColumns:"4px 1fr auto",gap:16,alignItems:"start",animation:"fadeIn .3s ease"}}>
              <div style={{width:4,borderRadius:4,background:c.cor,alignSelf:"stretch"}}/>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15}}>{c.nome}</span>
                  <span style={{padding:"2px 10px",borderRadius:20,fontSize:10,background:cfg.bg,color:cfg.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>{c.status}</span>
                  {c.tags&&c.tags.map(t=><span key={t} style={{padding:"1px 8px",borderRadius:20,fontSize:10,background:"rgba(255,255,255,.06)",color:"rgba(255,255,255,.4)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>#{t}</span>)}
                </div>
                {c.descricao&&<div style={{color:"rgba(255,255,255,.35)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:10,maxWidth:500}}>{c.descricao}</div>}
                <div style={{display:"flex",gap:16,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{color:"rgba(255,255,255,.4)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📅 {fmt(start)} → {fmt(end)}</span>
                  <span style={{color:"rgba(255,255,255,.4)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📡 {c.canal}</span>
                  <span style={{color:"rgba(255,255,255,.4)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🎯 {c.objetivo}</span>
                  {c.publico&&<span style={{color:"rgba(255,255,255,.4)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>👥 {c.publico}</span>}
                </div>
                <div style={{display:"flex",gap:16,marginBottom:10,flexWrap:"wrap"}}>
                  <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Orçamento: <b style={{color:"#fff"}}>{currency(c.orcamento)}</b></span>
                  <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Investido: <b style={{color:"#3B82F6"}}>{currency(c.investido)}</b></span>
                  <span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Receita: <b style={{color:"#10B981"}}>{currency(c.receita)}</b></span>
                  {roi&&<span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>ROI: <b style={{color:Number(roi)>=0?"#10B981":"#EF4444"}}>{roi}%</b></span>}
                  {Number(c.leads)>0&&<span style={{color:"rgba(255,255,255,.5)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Leads: <b style={{color:"#7C3AED"}}>{c.leads}</b></span>}
                </div>
                <div style={{height:5,borderRadius:3,background:"rgba(255,255,255,.05)",maxWidth:300}}>
                  <div style={{height:"100%",width:`${pct}%`,background:c.cor,borderRadius:3,transition:"width 1s ease",opacity:.8}}/>
                </div>
                <div style={{color:"rgba(255,255,255,.2)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>{pct}% do período</div>
              </div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>onEdit(c)} style={{background:"rgba(255,255,255,.06)",border:"none",color:"#aaa",padding:"8px 13px",borderRadius:8,cursor:"pointer",fontSize:13}}>✎</button>
                <button onClick={()=>onDelete(c.id)} style={{background:"rgba(239,68,68,.08)",border:"none",color:"#EF4444",padding:"8px 13px",borderRadius:8,cursor:"pointer",fontSize:13}}>✕</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CALENDÁRIO ───────────────────────────────────────────────────────────────
function Calendario({campaigns,onNew}){
  const[year,setYear]=useState(T.getFullYear());
  const[month,setMonth]=useState(T.getMonth());
  const[hov,setHov]=useState(null);
  const prev=()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1);};
  const next=()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1);};
  const days=daysInMonth(year,month);
  const startDay=firstDay(year,month);
  const cells=Array.from({length:startDay+days},(_,i)=>i<startDay?null:i-startDay+1);
  while(cells.length%7!==0)cells.push(null);
  const campsFor=day=>{
    if(!day)return[];
    const d=new Date(year,month,day);
    return campaigns.filter(c=>{const s=parseD(c.inicio),e=parseD(c.fim);return d>=s&&d<=e;});
  };
  const visible=campaigns.filter(c=>{
    const s=parseD(c.inicio),e=parseD(c.fim);
    return s<=new Date(year,month+1,0)&&e>=new Date(year,month,1);
  });

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24}}>Calendário</h1>
          <p style={{color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>Visualize campanhas e datas comemorativas</p>
        </div>
        <button onClick={onNew} style={{padding:"11px 22px",border:"none",cursor:"pointer",borderRadius:10,background:"linear-gradient(90deg,#2563EB,#7C3AED)",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,boxShadow:"0 4px 16px rgba(37,99,235,.35)"}}>+ Nova Campanha</button>
      </div>

      <div style={{...card,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <button onClick={prev} style={{background:"rgba(255,255,255,.06)",border:"none",color:"#fff",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18}}>‹</button>
            <h2 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:20,minWidth:200,textAlign:"center"}}>{MONTHS[month]} {year}</h2>
            <button onClick={next} style={{background:"rgba(255,255,255,.06)",border:"none",color:"#fff",width:36,height:36,borderRadius:8,cursor:"pointer",fontSize:18}}>›</button>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {visible.slice(0,6).map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:2,background:c.cor}}/>
                <span style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{c.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {DAYS.map(d=><div key={d} style={{textAlign:"center",color:"rgba(255,255,255,.25)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1,padding:"5px 0"}}>{d}</div>)}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {cells.map((day,idx)=>{
            const camps=campsFor(day);
            const isToday=day===T.getDate()&&month===T.getMonth()&&year===T.getFullYear();
            const hkey=day?`${pad(month+1)}-${pad(day)}`:null;
            const holiday=hkey?BR_DATES[hkey]:null;
            return(
              <div key={idx} onMouseEnter={()=>day&&camps.length&&setHov({day,camps})} onMouseLeave={()=>setHov(null)}
                style={{minHeight:78,borderRadius:10,padding:"7px 6px",background:day?(isToday?"rgba(37,99,235,.15)":"rgba(255,255,255,.03)"):"transparent",border:isToday?"1px solid rgba(37,99,235,.5)":"1px solid rgba(255,255,255,.04)",cursor:camps.length?"pointer":"default",transition:"background .15s",position:"relative"}}>
                {day&&(
                  <>
                    <div style={{fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:isToday?800:500,color:isToday?"#3B82F6":holiday?"#F59E0B":"rgba(255,255,255,.5)",marginBottom:2}}>{day}</div>
                    {holiday&&<div style={{fontSize:8,color:"#F59E0B",fontFamily:"'Plus Jakarta Sans',sans-serif",lineHeight:1.2,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{holiday}</div>}
                    {camps.slice(0,3).map(c=><div key={c.id} style={{height:4,borderRadius:2,background:c.cor,marginBottom:2,opacity:.9}}/>)}
                    {camps.length>3&&<div style={{fontSize:9,color:"rgba(255,255,255,.3)",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>+{camps.length-3}</div>}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {hov&&(
          <div style={{marginTop:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",borderRadius:12,padding:16,animation:"fadeIn .2s ease"}}>
            <div style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1,marginBottom:10}}>DIA {hov.day} DE {MONTHS[month].toUpperCase()}</div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {hov.camps.map(c=>{
                const cfg=statusCfg(c.status);
                return(
                  <div key={c.id} style={{background:"rgba(255,255,255,.04)",borderRadius:8,padding:"10px 14px",borderLeft:`3px solid ${c.cor}`,minWidth:200}}>
                    <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700,marginBottom:3}}>{c.nome}</div>
                    <div style={{color:"rgba(255,255,255,.35)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:5}}>{c.canal} · {fmt(parseD(c.inicio))} → {fmt(parseD(c.fim))}</div>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,background:cfg.bg,color:cfg.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>{c.status}</span>
                      {Number(c.orcamento)>0&&<span style={{color:"rgba(255,255,255,.4)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{currency(c.orcamento)}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FINANCEIRO ───────────────────────────────────────────────────────────────
function Financeiro({campaigns}){
  const rows=campaigns.map(c=>{
    const inv=Number(c.investido||0);
    const rec=Number(c.receita||0);
    const orc=Number(c.orcamento||0);
    const lucro=rec-inv;
    const roi=inv>0?(((rec-inv)/inv)*100).toFixed(1):null;
    const cpl=Number(c.leads)>0?(inv/Number(c.leads)).toFixed(2):null;
    const cpp=Number(c.conversoes)>0?(inv/Number(c.conversoes)).toFixed(2):null;
    const gap=orc-inv;
    return{...c,inv,rec,orc,lucro,roi,cpl,cpp,gap};
  });
  const totOrc=rows.reduce((a,r)=>a+r.orc,0);
  const totInv=rows.reduce((a,r)=>a+r.inv,0);
  const totRec=rows.reduce((a,r)=>a+r.rec,0);
  const totLucro=totRec-totInv;
  const totRoi=totInv>0?(((totRec-totInv)/totInv)*100).toFixed(1):0;

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:22}}>
        <h1 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24}}>Financeiro</h1>
        <p style={{color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>Custos, investimentos, receitas e ROI por campanha</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:22}}>
        {[
          {label:"Orçamento Total",v:currency(totOrc),color:"#3B82F6"},
          {label:"Total Investido",v:currency(totInv),color:"#7C3AED"},
          {label:"Receita Total",v:currency(totRec),color:"#10B981"},
          {label:"Lucro / Prejuízo",v:currency(totLucro),color:totLucro>=0?"#10B981":"#EF4444"},
          {label:"ROI Geral",v:`${totRoi}%`,color:Number(totRoi)>=0?"#10B981":"#EF4444"},
        ].map(k=>(
          <div key={k.label} style={{...card,padding:"16px 18px"}}>
            <div style={{color:"rgba(255,255,255,.35)",fontSize:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1.4,marginBottom:6}}>{k.label.toUpperCase()}</div>
            <div style={{color:k.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18}}>{k.v}</div>
          </div>
        ))}
      </div>

      <div style={{...card,overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:"1px solid rgba(255,255,255,.08)"}}>
              {["Campanha","Status","Orçamento","Investido","Saldo","Receita","Lucro","ROI","CPL","CPConv"].map(h=>(
                <th key={h} style={{padding:"14px 16px",textAlign:"left",color:"rgba(255,255,255,.3)",fontSize:11,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,letterSpacing:1.2,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r=>{
              const cfg=statusCfg(r.status);
              return(
                <tr key={r.id} style={{borderBottom:"1px solid rgba(255,255,255,.04)",transition:"background .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:2,background:r.cor,flexShrink:0}}/>
                      <span style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,whiteSpace:"nowrap"}}>{r.nome}</span>
                    </div>
                  </td>
                  <td style={{padding:"14px 16px"}}><span style={{padding:"2px 8px",borderRadius:20,fontSize:10,background:cfg.bg,color:cfg.color,fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700}}>{r.status}</span></td>
                  <td style={{padding:"14px 16px",color:"rgba(255,255,255,.6)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>{currency(r.orc)}</td>
                  <td style={{padding:"14px 16px",color:"#3B82F6",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600}}>{currency(r.inv)}</td>
                  <td style={{padding:"14px 16px",color:r.gap>=0?"#10B981":"#EF4444",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600}}>{currency(r.gap)}</td>
                  <td style={{padding:"14px 16px",color:"#10B981",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600}}>{currency(r.rec)}</td>
                  <td style={{padding:"14px 16px",color:r.lucro>=0?"#10B981":"#EF4444",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>{currency(r.lucro)}</td>
                  <td style={{padding:"14px 16px",color:r.roi===null?"rgba(255,255,255,.2)":Number(r.roi)>=0?"#10B981":"#EF4444",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:700}}>{r.roi!==null?`${r.roi}%`:"—"}</td>
                  <td style={{padding:"14px 16px",color:"rgba(255,255,255,.5)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>{r.cpl?`R$ ${r.cpl}`:"—"}</td>
                  <td style={{padding:"14px 16px",color:"rgba(255,255,255,.5)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>{r.cpp?`R$ ${r.cpp}`:"—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── IA ESTRATÉGICA ───────────────────────────────────────────────────────────
function IAEstrategica({campaigns}){
  const[mode,setMode]=useState("sugestoes");
  const[loading,setLoading]=useState(false);
  const[result,setResult]=useState(null);
  const[segmento,setSegmento]=useState("");
  const[pergunta,setPergunta]=useState("");

  const call=async(prompt)=>{
    setLoading(true);setResult(null);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:1400,
        messages:[{role:"user",content:prompt}]
      })});
      const d=await r.json();
      setResult(d.content?.[0]?.text||"Erro.");
    }catch{setResult("Erro de conexão.");}
    setLoading(false);
  };

  const campResumo=campaigns.map(c=>`• ${c.nome} | ${c.status} | ${c.canal} | Invest: R$${c.investido||0} | Receita: R$${c.receita||0} | Leads: ${c.leads||0}`).join("\n");

  const sugestoes=()=>call(`Você é um especialista em marketing digital estratégico brasileiro.

Data atual: ${fmt(T)}
${segmento?`Segmento: ${segmento}`:""}

Campanhas existentes:
${campResumo||"Nenhuma campanha ainda."}

Sugira 4 oportunidades de campanha para os próximos 3 meses com base em datas comemorativas brasileiras, tendências e lacunas no calendário.

Para cada uma use EXATAMENTE este formato:

---
📅 NOME DA CAMPANHA
📆 Período: [data início] a [data fim]  
🎯 Oportunidade: [por que agora — data/tendência]
💡 Conceito: [ideia criativa detalhada — 3 linhas]
📣 Canal: [canal recomendado e por quê]
💰 Investimento sugerido: [faixa de valor]
📊 Resultado esperado: [leads/conversões/ROI estimado]
⚡ Urgência: Alta / Média / Baixa
---`);

  const analise=()=>call(`Você é um analista de marketing. Analise as campanhas abaixo e gere um relatório estratégico completo.

Campanhas:
${campResumo||"Nenhuma campanha ainda."}

Responda com:

## 🏆 MELHORES CAMPANHAS
[analise as 3 melhores por ROI/resultado]

## ⚠️ PONTOS DE ATENÇÃO
[campanhas com baixo desempenho e o que fazer]

## 💡 RECOMENDAÇÕES ESTRATÉGICAS
[5 ações práticas e prioritárias para melhorar resultados]

## 📊 INSIGHTS DE DADOS
[padrões, canais que mais convertem, público mais eficiente]

## 🚀 PRÓXIMOS PASSOS
[plano de ação para as próximas 4 semanas]`);

  const consulta=()=>{
    if(!pergunta.trim())return;
    call(`Você é um especialista em marketing digital. Responda de forma clara, prática e detalhada.

Contexto das campanhas atuais:
${campResumo||"Nenhuma campanha ainda."}
${segmento?`Segmento: ${segmento}`:""}

Pergunta do usuário: ${pergunta}

Dê uma resposta completa, com exemplos práticos e passos concretos quando necessário.`);
  };

  const MODES=[{id:"sugestoes",label:"💡 Sugestões",sub:"Próximas campanhas"},{id:"analise",label:"📊 Análise",sub:"Performance atual"},{id:"consulta",label:"💬 Consultor",sub:"Tire dúvidas"}];

  return(
    <div style={{animation:"fadeIn .35s ease"}}>
      <div style={{marginBottom:22}}>
        <h1 style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:24}}>IA Estratégica</h1>
        <p style={{color:"rgba(255,255,255,.35)",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",marginTop:3}}>Inteligência artificial para otimizar suas campanhas</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:22}}>
        {MODES.map(m=>(
          <button key={m.id} onClick={()=>{setMode(m.id);setResult(null);}} style={{padding:"18px 20px",border:"none",cursor:"pointer",borderRadius:14,background:mode===m.id?"rgba(124,58,237,.18)":"rgba(255,255,255,.03)",textAlign:"left",borderLeft:mode===m.id?"3px solid #7C3AED":"3px solid transparent",transition:"all .2s"}}>
            <div style={{color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:15,marginBottom:4}}>{m.label}</div>
            <div style={{color:"rgba(255,255,255,.35)",fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{m.sub}</div>
          </button>
        ))}
      </div>

      <div style={{...card,padding:24}}>
        {(mode==="sugestoes"||mode==="analise")&&(
          <div style={{marginBottom:18}}>
            <label style={{...LBL,marginTop:0}}>SEU SEGMENTO (opcional)</label>
            <div style={{display:"flex",gap:10}}>
              <input value={segmento} onChange={e=>setSegmento(e.target.value)} placeholder="Ex: moda, restaurante, tecnologia, educação..." style={{...INP,flex:1}}/>
              <button onClick={mode==="sugestoes"?sugestoes:analise} disabled={loading} style={{padding:"10px 24px",border:"none",cursor:loading?"not-allowed":"pointer",borderRadius:10,background:loading?"rgba(124,58,237,.3)":"linear-gradient(90deg,#7C3AED,#2563EB)",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,whiteSpace:"nowrap",boxShadow:loading?"none":"0 4px 16px rgba(124,58,237,.35)",display:"flex",alignItems:"center",gap:8}}>
                {loading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>Analisando...</>:mode==="sugestoes"?"✦ Gerar Sugestões":"✦ Analisar Campanhas"}
              </button>
            </div>
          </div>
        )}

        {mode==="consulta"&&(
          <div style={{marginBottom:18}}>
            <label style={{...LBL,marginTop:0}}>FAÇA SUA PERGUNTA</label>
            <div style={{display:"flex",gap:10}}>
              <input value={pergunta} onChange={e=>setPergunta(e.target.value)} onKeyDown={e=>e.key==="Enter"&&consulta()} placeholder="Ex: Como melhorar meu ROI? Qual canal usar para lançamento? Como estruturar uma campanha de Black Friday?" style={{...INP,flex:1}}/>
              <button onClick={consulta} disabled={loading||!pergunta.trim()} style={{padding:"10px 24px",border:"none",cursor:(loading||!pergunta.trim())?"not-allowed":"pointer",borderRadius:10,background:(loading||!pergunta.trim())?"rgba(124,58,237,.3)":"linear-gradient(90deg,#7C3AED,#2563EB)",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,whiteSpace:"nowrap",boxShadow:(loading||!pergunta.trim())?"none":"0 4px 16px rgba(124,58,237,.35)",display:"flex",alignItems:"center",gap:8}}>
                {loading?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>◌</span>Pensando...</>:"✦ Perguntar"}
              </button>
            </div>
          </div>
        )}

        {!result&&!loading&&(
          <div style={{textAlign:"center",padding:"50px 20px",border:"1px dashed rgba(255,255,255,.07)",borderRadius:12}}>
            <div style={{fontSize:44,marginBottom:12}}>✦</div>
            <div style={{color:"rgba(255,255,255,.4)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,fontWeight:600,marginBottom:6}}>IA Pronta</div>
            <div style={{color:"rgba(255,255,255,.2)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>{mode==="sugestoes"?"Clique em Gerar Sugestões para receber ideias de campanhas":mode==="analise"?"Clique em Analisar para receber insights das suas campanhas":"Digite sua dúvida sobre marketing e a IA responderá"}</div>
          </div>
        )}

        {loading&&(
          <div style={{textAlign:"center",padding:"50px 20px"}}>
            <div style={{width:50,height:50,borderRadius:"50%",border:"3px solid rgba(124,58,237,.15)",borderTop:"3px solid #7C3AED",margin:"0 auto 16px",animation:"spin 1s linear infinite"}}/>
            <div style={{color:"rgba(255,255,255,.4)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>IA processando...</div>
          </div>
        )}

        {result&&!loading&&(
          <div>
            {mode==="sugestoes"?(
              <div style={{display:"grid",gap:14}}>
                {result.split("---").filter(s=>s.trim()).map((bloco,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:22,animation:`fadeIn .4s ease ${i*.1}s both`,borderLeft:`3px solid ${COLS[i%COLS.length]}`}}>
                    <div style={{color:"rgba(255,255,255,.85)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{bloco.trim()}</div>
                  </div>
                ))}
              </div>
            ):(
              <div style={{color:"rgba(255,255,255,.8)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{result}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const[tab,setTab]=useState("dashboard");
  const[campaigns,setCampaigns]=useState(INIT_CAMPAIGNS);
  const[modal,setModal]=useState(false);
  const[editing,setEditing]=useState(null);

  const save=form=>{
    if(editing)setCampaigns(p=>p.map(c=>c.id===editing.id?{...form,id:editing.id}:c));
    else setCampaigns(p=>[...p,{...form,id:Date.now()}]);
    setModal(false);setEditing(null);
  };
  const openEdit=c=>{setEditing(c);setModal(true);};
  const openNew=()=>{setEditing(null);setModal(true);};
  const del=id=>setCampaigns(p=>p.filter(c=>c.id!==id));

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0a0a16;font-family:'Plus Jakarta Sans',sans-serif}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(37,99,235,.3);border-radius:2px}
        select option{background:#1a1a2e}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(.5)}
        textarea{font-family:'Plus Jakarta Sans',sans-serif}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:"#0a0a16"}}>
        <Sidebar tab={tab} setTab={setTab}/>
        <main style={{marginLeft:220,flex:1,padding:"32px 36px",minHeight:"100vh"}}>
          {tab==="dashboard"  &&<Dashboard campaigns={campaigns} setTab={setTab}/>}
          {tab==="campanhas"  &&<Campanhas campaigns={campaigns} onEdit={openEdit} onDelete={del} onNew={openNew}/>}
          {tab==="calendario" &&<Calendario campaigns={campaigns} onNew={openNew}/>}
          {tab==="financeiro" &&<Financeiro campaigns={campaigns}/>}
          {tab==="ia"         &&<IAEstrategica campaigns={campaigns}/>}
        </main>
      </div>

      {modal&&<CampaignModal onClose={()=>{setModal(false);setEditing(null);}} onSave={save} editing={editing}/>}
    </>
  );
}
