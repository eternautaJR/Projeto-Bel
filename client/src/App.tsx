import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CarFront,
  CheckCircle2,
  ExternalLink,
  FileText,
  Handshake,
  Home,
  Info,
  Landmark,
  ListChecks,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

const LOGO_URL = `${import.meta.env.BASE_URL}logobdnovo.png`;

const condominiumTabs = ["Concept", "Latitud", "Mudrá", "Orygem"] as const;
type Condominium = (typeof condominiumTabs)[number];
type MainPage = "Informações" | "Anúncios ativos" | "Avalie com a gente";

type SaleRow = {
  unit: string;
  date: string;
  value: string;
  pricePerM2: string;
  area: string;
  complement: string;
  position: string;
};

type SaleSortKey = "date" | "value" | "area" | "pricePerM2";
type SortDirection = "asc" | "desc";

const latitudSales: SaleRow[] = [
  { unit: "Blc 2 Apt 403", date: "07/09/2026", value: "R$ 1.932.903,92", pricePerM2: "R$ 12.390,41", area: "156 m²", complement: "Bloco 2 • Apt 403", position: "Fundos" },
  { unit: "Blc 2 Apt 902", date: "07/06/2026", value: "R$ 2.600.000,00", pricePerM2: "R$ 16.666,67", area: "156 m²", complement: "Bloco 2 • Apt 902", position: "Fundos" },
  { unit: "Blc 2 Apt 403", date: "17/05/2026", value: "R$ 2.168.000,00", pricePerM2: "R$ 13.897,44", area: "156 m²", complement: "Bloco 2 • Apt 403", position: "Fundos" },
  { unit: "Blc 4 Apt 303", date: "21/04/2026", value: "R$ 2.550.000,00", pricePerM2: "R$ 13.636,36", area: "187 m²", complement: "Bloco 4 • Apt 303", position: "Fundos" },
  { unit: "Blc 2 Apt 801", date: "17/03/2026", value: "R$ 2.300.000,00", pricePerM2: "R$ 15.032,68", area: "153 m²", complement: "Bloco 2 • Apt 801", position: "Frente" },
  { unit: "Blc 4 Apt 1001", date: "27/07/2026", value: "R$ 4.115.100,00", pricePerM2: "R$ 11.062,10", area: "372 m²", complement: "Bloco 4 • Apt 1001", position: "Fundos" },
  { unit: "Blc 1 Apt 903", date: "26/07/2026", value: "R$ 2.122.302,77", pricePerM2: "R$ 16.978,42", area: "125 m²", complement: "Bloco 1 • Apt 903", position: "Fundos" },
  { unit: "Blc 3 Apt 204", date: "10/06/2026", value: "R$ 1.500.000,00", pricePerM2: "R$ 12.396,69", area: "121 m²", complement: "Bloco 3 • Apt 204", position: "Fundos" },
  { unit: "Blc 3 Apt 202", date: "31/05/2026", value: "R$ 1.531.200,00", pricePerM2: "R$ 12.760,00", area: "120 m²", complement: "Bloco 3 • Apt 202", position: "Fundos" },
  { unit: "Blc 1 Apt 402", date: "27/05/2026", value: "R$ 1.670.000,00", pricePerM2: "R$ 13.801,65", area: "121 m²", complement: "Bloco 1 • Apt 402", position: "Fundos" },
  { unit: "Blc 3 Apt 105", date: "18/05/2026", value: "R$ 1.611.242,60", pricePerM2: "R$ 13.316,05", area: "121 m²", complement: "Bloco 3 • Apt 105", position: "Fundos" },
  { unit: "Blc 3 Apt 401", date: "11/05/2026", value: "R$ 1.487.357,60", pricePerM2: "R$ 12.394,65", area: "120 m²", complement: "Bloco 3 • Apt 401", position: "Fundos" },
  { unit: "Blc 1 Apt 105", date: "05/04/2026", value: "R$ 1.750.000,00", pricePerM2: "R$ 14.583,33", area: "120 m²", complement: "Bloco 1 • Apt 105", position: "Fundos" },
  { unit: "Blc 3 Apt 906", date: "11/03/2026", value: "R$ 1.609.204,06", pricePerM2: "R$ 13.082,96", area: "123 m²", complement: "Bloco 3 • Apt 906", position: "Fundos" },
  { unit: "Blc 3 Apt 906", date: "11/03/2026", value: "R$ 1.601.147,74", pricePerM2: "R$ 13.342,90", area: "120 m²", complement: "Bloco 3 • Apt 906", position: "Fundos" },
  { unit: "Blc 3 Apt 401", date: "22/02/2026", value: "R$ 1.686.600,60", pricePerM2: "R$ 14.055,01", area: "120 m²", complement: "Bloco 3 • Apt 401", position: "Fundos" },
  { unit: "Blc 3 Apt 204", date: "03/02/2026", value: "R$ 1.600.000,00", pricePerM2: "R$ 13.008,13", area: "123 m²", complement: "Bloco 3 • Apt 204", position: "Fundos" },
  { unit: "Blc 1 Apt 105", date: "29/12/2025", value: "R$ 1.574.678,27", pricePerM2: "R$ 13.013,87", area: "121 m²", complement: "Bloco 1 • Apt 105", position: "Fundos" },
  { unit: "Blc 3 Apt 203", date: "10/12/2025", value: "R$ 2.228.070,00", pricePerM2: "R$ 17.824,56", area: "125 m²", complement: "Bloco 3 • Apt 203", position: "Fundos" },
  { unit: "Blc 3 Apt 402", date: "12/11/2025", value: "R$ 1.671.995,00", pricePerM2: "R$ 13.933,29", area: "120 m²", complement: "Bloco 3 • Apt 402", position: "Fundos" },
  { unit: "Blc 3 Apt 906", date: "03/11/2025", value: "R$ 1.586.169,30", pricePerM2: "R$ 12.895,69", area: "123 m²", complement: "Bloco 3 • Apt 906", position: "Fundos" },
  { unit: "Blc 1 Apt 203", date: "23/10/2025", value: "R$ 1.696.500,00", pricePerM2: "R$ 13.572,00", area: "125 m²", complement: "Bloco 1 • Apt 203", position: "Fundos" },
  { unit: "Blc 3 Apt 305", date: "23/10/2025", value: "R$ 1.696.500,00", pricePerM2: "R$ 14.020,66", area: "121 m²", complement: "Bloco 3 • Apt 305", position: "Fundos" },
  { unit: "Blc 1 Apt 603", date: "16/10/2025", value: "R$ 1.502.776,55", pricePerM2: "R$ 12.022,21", area: "125 m²", complement: "Bloco 1 • Apt 603", position: "Fundos" },
  { unit: "Blc 3 Apt 1003", date: "08/09/2025", value: "R$ 1.650.000,00", pricePerM2: "R$ 13.200,00", area: "125 m²", complement: "Bloco 3 • Apt 1003", position: "Fundos" },
  { unit: "Blc 4 Apt 1002", date: "13/07/2025", value: "R$ 4.905.537,66", pricePerM2: "R$ 13.186,93", area: "372 m²", complement: "Bloco 4 • Apt 1002", position: "Fundos" },
  { unit: "Blc 3 Apt 806", date: "13/07/2025", value: "R$ 1.843.395,61", pricePerM2: "R$ 14.986,96", area: "123 m²", complement: "Bloco 3 • Apt 806", position: "Fundos" },
  { unit: "Blc 1 Apt 101", date: "01/07/2025", value: "R$ 1.569.917,86", pricePerM2: "R$ 13.082,65", area: "120 m²", complement: "Bloco 1 • Apt 101", position: "Frente" },
  { unit: "Blc 1 Apt 502", date: "07/05/2025", value: "R$ 1.833.717,67", pricePerM2: "R$ 15.280,98", area: "120 m²", complement: "Bloco 1 • Apt 502", position: "Fundos" },
  { unit: "Blc 1 Apt 402", date: "07/05/2025", value: "R$ 1.816.555,50", pricePerM2: "R$ 15.137,96", area: "120 m²", complement: "Bloco 1 • Apt 402", position: "Fundos" },
  { unit: "Blc 3 Apt 606", date: "07/05/2025", value: "R$ 1.637.014,95", pricePerM2: "R$ 13.309,06", area: "123 m²", complement: "Bloco 3 • Apt 606", position: "Fundos" },
  { unit: "Blc 3 Apt 301", date: "07/05/2025", value: "R$ 1.872.601,99", pricePerM2: "R$ 15.605,02", area: "120 m²", complement: "Bloco 3 • Apt 301", position: "Fundos" },
  { unit: "Blc 4 Apt 304", date: "14/04/2025", value: "R$ 2.523.072,40", pricePerM2: "R$ 13.638,23", area: "185 m²", complement: "Bloco 4 • Apt 304", position: "Fundos" },
  { unit: "Blc 1 Apt 502", date: "27/04/2025", value: "R$ 1.810.674,12", pricePerM2: "R$ 15.088,95", area: "120 m²", complement: "Bloco 1 • Apt 502", position: "Fundos" },
  { unit: "Blc 2 Apt 604", date: "07/04/2025", value: "R$ 2.000.000,00", pricePerM2: "R$ 13.071,90", area: "153 m²", complement: "Bloco 2 • Apt 604", position: "Frente" },
  { unit: "Blc 1 Apt 402", date: "24/04/2025", value: "R$ 1.793.514,48", pricePerM2: "R$ 14.945,95", area: "120 m²", complement: "Bloco 1 • Apt 402", position: "Fundos" },
  { unit: "Blc 2 Apt 603", date: "20/03/2025", value: "R$ 2.100.000,00", pricePerM2: "R$ 13.461,54", area: "156 m²", complement: "Bloco 2 • Apt 603", position: "Fundos" },
  { unit: "Blc 3 Apt 204", date: "16/04/2025", value: "R$ 1.602.250,00", pricePerM2: "R$ 13.241,74", area: "121 m²", complement: "Bloco 3 • Apt 204", position: "Fundos" },
  { unit: "Blc 4 Apt 503", date: "16/02/2025", value: "R$ 2.767.385,00", pricePerM2: "R$ 14.798,85", area: "187 m²", complement: "Bloco 4 • Apt 503", position: "Fundos" },
  { unit: "Blc 2 Apt 103", date: "09/02/2025", value: "R$ 1.691.276,20", pricePerM2: "R$ 10.841,51", area: "156 m²", complement: "Bloco 2 • Apt 103", position: "Fundos" },
  { unit: "Blc 2 Apt 204", date: "30/01/2025", value: "R$ 1.642.084,00", pricePerM2: "R$ 10.732,58", area: "153 m²", complement: "Bloco 2 • Apt 204", position: "Frente" },
  { unit: "Blc 2 Apt 101", date: "28/01/2025", value: "R$ 2.320.809,50", pricePerM2: "R$ 15.168,69", area: "153 m²", complement: "Bloco 2 • Apt 101", position: "Frente" },
  { unit: "Blc 1 Apt 801", date: "02/04/2025", value: "R$ 1.843.644,50", pricePerM2: "R$ 15.363,70", area: "120 m²", complement: "Bloco 1 • Apt 801", position: "Frente" },
  { unit: "Blc 3 Apt 102", date: "20/02/2025", value: "R$ 1.570.000,00", pricePerM2: "R$ 13.083,33", area: "120 m²", complement: "Bloco 3 • Apt 102", position: "Fundos" },
  { unit: "Blc 1 Apt 1004", date: "21/01/2025", value: "R$ 1.734.206,61", pricePerM2: "R$ 14.332,29", area: "121 m²", complement: "Bloco 1 • Apt 1004", position: "Fundos" },
  { unit: "Blc 3 Apt 1003", date: "12/01/2025", value: "R$ 1.728.048,73", pricePerM2: "R$ 13.824,39", area: "125 m²", complement: "Bloco 3 • Apt 1003", position: "Fundos" },
];

function elapsedAgeFrom(month: number, year: number) {
  const today = new Date();
  let months = (today.getFullYear() - year) * 12 + today.getMonth() - month;
  if (today.getDate() < 1) months -= 1;
  months = Math.max(0, months);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return `${years} ${years === 1 ? "ano" : "anos"} e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`;
}

const navIcons: Record<MainPage, LucideIcon> = {
  Informações: BarChart3,
  "Anúncios ativos": Home,
  "Avalie com a gente": MessageCircle,
};

function condoToSlug(condo: Condominium) {
  return condo.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function pageToPath(page: MainPage) {
  if (page === "Informações") return "/";
  if (page === "Anúncios ativos") return "/anuncios-ativos";
  return "/avalie-com-a-gente";
}

function getRouteState(path: string): { page: MainPage; condo: Condominium } {
  const condo = condominiumTabs.find((item) => path === `/empreendimentos/${condoToSlug(item)}`);
  if (condo) return { page: "Informações", condo };
  if (path === "/anuncios-ativos") return { page: "Anúncios ativos", condo: "Latitud" };
  if (path === "/avalie-com-a-gente") return { page: "Avalie com a gente", condo: "Latitud" };
  return { page: "Informações", condo: "Latitud" };
}

function DashboardApp() {
  const [location, setLocation] = useLocation();
  const routeState = getRouteState(location);
  const activePage = routeState.page;
  const activeCondo = routeState.condo;
  const showingCondo = location.startsWith("/empreendimentos/");
  const [showSidebar, setShowSidebar] = useState(false);

  const pageTitle = useMemo(() => {
    if (activePage === "Informações") return "Informações";
    if (activePage === "Anúncios ativos") return "Anúncios ativos";
    return "Avalie com a gente";
  }, [activePage]);

  const navigate = (page: MainPage) => {
    setLocation(pageToPath(page));
    setShowSidebar(false);
  };

  const navigateCondo = (condo: Condominium) => {
    setLocation(`/empreendimentos/${condoToSlug(condo)}`);
    setShowSidebar(false);
  };

  return (
    <div className="app-shell">
      <button className="mobile-menu-button" onClick={() => setShowSidebar((current) => !current)} aria-label="Abrir menu">
        <ListChecks size={19} />
      </button>
      <aside className={`sidebar ${showSidebar ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <img src={LOGO_URL} alt="Bluedoor Imóveis" />
        </div>
        <div className="sidebar-rule" />
        <nav className="main-nav" aria-label="Navegação principal">
          <button className={`nav-item ${activePage === "Informações" ? "active" : ""}`} onClick={() => navigate("Informações")}>
            <BarChart3 size={18} />
            <span>Informações</span>
          </button>
          <div className="subnav" aria-label="Empreendimentos">
            {condominiumTabs.map((condo) => (
              <button
                key={condo}
                className={`subnav-item ${showingCondo && activeCondo === condo ? "selected" : ""}`}
                onClick={() => {
                  navigateCondo(condo);
                }}
              >
                <span className="subnav-dot" />
                <span>{condo}</span>
              </button>
            ))}
          </div>
          <button className={`nav-item ${activePage === "Anúncios ativos" ? "active" : ""}`} onClick={() => navigate("Anúncios ativos")}>
            <Home size={18} />
            <span>Anúncios ativos</span>
          </button>
          <button className={`nav-item ${activePage === "Avalie com a gente" ? "active" : ""}`} onClick={() => navigate("Avalie com a gente")}>
            <MessageCircle size={18} />
            <span>Avalie com a gente</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <ShieldCheck size={15} />
          <span>Portal de transparência</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">BLUEDOOR IMÓVEIS</span>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-meta">
            <div className="source-badge"><ShieldCheck size={16} /> Fonte: Bel Radar</div>
          </div>
        </header>
        {activePage === "Informações" && (showingCondo ? <CondominiumPage activeCondo={activeCondo} setActiveCondo={navigateCondo} /> : <InformationPage />)}
        {activePage === "Anúncios ativos" && <ActiveListingsPage />}
        {activePage === "Avalie com a gente" && <ContactPage />}
      </main>
    </div>
  );
}

function InformationPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner">
        <div className="intro-icon"><Info size={25} /></div>
        <div>
          <p className="section-kicker">Como funciona</p>
          <h2>Uma consulta clara para quem precisa tomar boas decisões.</h2>
          <p>Esta plataforma centraliza informações dos empreendimentos e suas unidades em um só lugar. Cada subaba apresenta exclusivamente os dados do respectivo condomínio.</p>
        </div>
      </section>
      <section className="surface-card how-it-works">
        <div className="section-heading"><div><p className="section-kicker">Visão guiada</p><h2>Como consultar</h2></div><Sparkles size={21} /></div>
        <div className="steps-grid">
          <Step number="01" title="Escolha um empreendimento" text="Use as subabas no menu lateral: Concept, Latitud, Mudrá ou Orygem." />
          <ArrowRight className="step-arrow" size={22} />
          <Step number="02" title="Consulte os dados" text="Visualize unidades, áreas por bloco, idade e vendas desde janeiro de 2025." />
          <ArrowRight className="step-arrow" size={22} />
          <Step number="03" title="Entre em contato" text="Encontrou o que precisava? Fale com a equipe da Bluedoor pela plataforma." />
        </div>
      </section>
      <div className="audience-grid">
        <AudienceCard icon={Users} title="Para moradores" text="Acompanhe informações do seu empreendimento com linguagem simples e visão organizada." />
        <AudienceCard icon={Handshake} title="Para parceiros" text="Consulte características, áreas e histórico antes de entrar em contato com a Bluedoor." />
        <AudienceCard icon={Landmark} title="Para administradoras" text="Tenha uma fonte central de consulta para dados do condomínio e de suas unidades." />
      </div>
      <section className="surface-card clarity-card">
        <div className="clarity-icon"><CheckCircle2 size={21} /></div>
        <div><strong>Regra de leitura</strong><p>Os dados dos condomínios não são misturados. Ao acessar uma subaba, você verá somente o empreendimento selecionado.</p></div>
      </section>
      <section className="surface-card feature-overview">
        <div className="section-heading"><div><p className="section-kicker">O que você encontra</p><h2>Informação sem ruído</h2></div><FileText size={21} /></div>
        <div className="feature-grid">
          <FeatureItem icon={Building2} title="Unidades" text="Identificação, tipologia, área, valor e status." />
          <FeatureItem icon={Ruler} title="Áreas por bloco" text="Menor e maior área destacados por bloco quando necessário." />
          <FeatureItem icon={CalendarDays} title="Entrega e idade" text="Uma única referência, atualizada mês a mês." />
          <FeatureItem icon={BarChart3} title="Vendas desde jan/2025" text="Histórico organizado a partir de janeiro de 2025." />
        </div>
      </section>
    </div>
  );
}

function CondominiumPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  if (activeCondo === "Latitud") return <LatitudPage activeCondo={activeCondo} setActiveCondo={setActiveCondo} />;
  return <CondominiumPreparingPage activeCondo={activeCondo} setActiveCondo={setActiveCondo} />;
}

function CondominiumPreparingPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  return (
    <div className="content-stack">
      <div className="page-tabs" aria-label="Subabas de empreendimentos">
        {condominiumTabs.map((condo) => <button key={condo} className={activeCondo === condo ? "active" : ""} onClick={() => setActiveCondo(condo)}>{condo}</button>)}
      </div>
      <section className="intro-banner">
        <div className="intro-icon"><Building2 size={25} /></div>
        <div><p className="section-kicker">Empreendimento selecionado</p><h2>{activeCondo}</h2><p>Esta subaba está estruturada e pronta para receber os dados oficiais do empreendimento. Assim que as informações forem disponibilizadas, elas aparecerão aqui de forma organizada, sem mistura com os demais condomínios.</p></div>
      </section>
      {activeCondo === "Orygem" && <AverageAreaValues />}
      <section className="surface-card empty-listings"><div className="empty-icon"><FileText size={25} /></div><p className="section-kicker">Dados em preparação</p><h2>Informações do {activeCondo} serão inseridas aqui</h2><p>Áreas por bloco, entrega e idade, unidades e vendas desde janeiro de 2025 serão cadastradas nesta subaba exclusivamente para este empreendimento.</p></section>
    </div>
  );
}

function LatitudPage({ activeCondo, setActiveCondo }: { activeCondo: Condominium; setActiveCondo: (condo: Condominium) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SaleSortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const filteredSales = latitudSales.filter((sale) => `${sale.unit} ${sale.complement}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const sortedSales = [...filteredSales].sort((first, second) => {
    const firstValue = saleSortValue(first, sortKey ?? "date");
    const secondValue = saleSortValue(second, sortKey ?? "date");
    const direction = sortKey ? sortDirection : "desc";
    return direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
  });
  const toggleSort = (key: SaleSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };
  return (
    <div className="content-stack">
      <div className="page-tabs" aria-label="Subabas de empreendimentos">
        {condominiumTabs.map((condo) => <button key={condo} className={activeCondo === condo ? "active" : ""} onClick={() => setActiveCondo(condo)}>{condo}</button>)}
      </div>
      <section className="property-header">
        <div>
          <p className="section-kicker">Empreendimento selecionado</p>
          <h2>Latitud</h2>
          <div className="property-location"><MapPin size={15} /> Avenida Rosauro Estelita, 155 · Rio de Janeiro/RJ</div>
        </div>
      </section>
      <section className="metrics-grid">
        <Metric icon={Building2} label="Total de unidades" value="204" helper="Bloco 1 – 60 · Bloco 2 – 36 · Bloco 3 – 60 · Bloco 4 – 36" />
        <Metric icon={Ruler} label="Menor área observada" value="120 m²" helper="" />
        <Metric icon={Ruler} label="Maior área observada" value="372 m²" helper="" />
        <Metric icon={CalendarDays} label="Entrega e idade" value="04/2023" helper={elapsedAgeFrom(3, 2023)} />
      </section>
      <AverageAreaValues values={{ "120–125 m²": "R$ 1.700.977,70", "153–156 m²": "R$ 2.083.897,07", "179–187 m²": "R$ 2.613.485,80", "372 m²": "R$ 4.510.318,83" }} />
      <section className="surface-card sales-card">
        <div className="section-heading section-heading-wrap"><div><p className="section-kicker">Histórico de vendas</p><h2>Vendas desde janeiro de 2025</h2><p className="section-description">Histórico do Latitud com unidade, bloco, data, valor, área e posição. A partir de janeiro de 2025, cada transação aparece individualmente.</p></div><div className="table-actions"><label className="search-box"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar unidade ou bloco" /></label><button className="filter-button"><SlidersHorizontal size={16} /> Filtros</button></div></div>
        <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Unidade</th><th><SortButton label="Data da venda" sortKey="date" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Valor" sortKey="value" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Área" sortKey="area" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th><SortButton label="Preço/m²" sortKey="pricePerM2" activeKey={sortKey} direction={sortDirection} onClick={toggleSort} /></th><th>Posição</th></tr></thead><tbody>{sortedSales.map((sale, index) => <tr key={`${sale.unit}-${sale.date}-${sale.value}-${index}`}><td><strong>{sale.unit}</strong><span className="cell-subtext">{sale.complement}</span></td><td>{sale.date}</td><td className="money-cell">{sale.value}</td><td>{sale.area}</td><td>{sale.pricePerM2}</td><td>{sale.position}</td></tr>)}</tbody></table></div>
        {sortedSales.length === 0 && <div className="empty-filter"><Search size={17} /> Nenhuma unidade encontrada para essa busca.</div>}
        <div className="table-footer"><span>Mostrando {sortedSales.length} registros de referência</span><span className="client-note"><ShieldCheck size={14} /> Consulta transparente para moradores, parceiros e administradoras</span></div>
      </section>
    </div>
  );
}

function ActiveListingsPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner listings-intro"><div className="intro-icon"><Home size={25} /></div><div><p className="section-kicker">Links das unidades</p><h2>Anúncios ativos</h2><p>Este espaço será usado para publicar os links das unidades e dos anúncios ativos da Bluedoor. A plataforma de empreendimentos permanece separada desta área.</p></div></section>
      <section className="surface-card empty-listings"><div className="empty-icon"><ExternalLink size={25} /></div><p className="section-kicker">Links das unidades</p><h2>Os anúncios entrarão aqui</h2><p>Quando os links públicos das unidades forem cadastrados, moradores, parceiros e administradoras poderão acessá-los por esta aba sem misturar essas informações com os dados internos dos condomínios.</p><button className="primary-button" onClick={() => window.alert("A área está pronta para receber os links das unidades.")}><ExternalLink size={16} /> Área preparada para os links</button></section>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="content-stack">
      <section className="intro-banner contact-intro"><div className="intro-icon"><MessageCircle size={25} /></div><div><p className="section-kicker">Canal direto</p><h2>Avalie com a gente</h2><p>Um canal direto para moradores, parceiros e administradoras entrarem em contato com a Bluedoor após consultar as informações.</p></div></section>
      <section className="surface-card contact-card"><div className="contact-card-icon"><Phone size={27} /></div><div><p className="section-kicker">Contato Bluedoor</p><h2>Fale diretamente com a nossa equipe</h2><p className="contact-placeholder">Para dúvidas, oportunidades, atualizações ou informações sobre os empreendimentos, use o telefone oficial ou acesse o site da Bluedoor Imóveis.</p><div className="contact-actions"><a className="primary-button" href="tel:+5521974050590"><Phone size={16} /> (21) 97405-0590</a><a className="outline-button" href="https://bluedoorimoveis.com.br/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> bluedoorimoveis.com.br</a></div></div></section>
      <div className="audience-grid"><AudienceCard icon={Users} title="Moradores" text="Tire dúvidas sobre as informações do seu empreendimento." /><AudienceCard icon={Handshake} title="Parceiros" text="Fale com a equipe sobre uma unidade ou oportunidade." /><AudienceCard icon={Landmark} title="Administradoras" text="Solicite alinhamentos ou atualizações de dados." /></div>
    </div>
  );
}

function AudienceCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <article className="surface-card audience-card"><div className="audience-icon"><Icon size={21} /></div><h3>{title}</h3><p>{text}</p></article>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="step"><span className="step-number">{number}</span><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function FeatureItem({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="feature-item"><div className="feature-icon"><Icon size={20} /></div><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function Metric({ icon: Icon, label, value, helper }: { icon: LucideIcon; label: string; value: string; helper: string }) {
  return <article className="surface-card metric-card"><div className="metric-icon"><Icon size={19} /></div><div><p>{label}</p><strong>{value}</strong>{helper && <span>{helper}</span>}</div></article>;
}

function saleSortValue(sale: SaleRow, key: SaleSortKey) {
  if (key === "date") {
    const [day, month, year] = sale.date.split("/").map(Number);
    return new Date(year, month - 1, day).getTime();
  }
  if (key === "area") return Number.parseFloat(sale.area.replace(" m²", "").replace(",", "."));
  return Number.parseFloat(sale[key].replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", "."));
}

function SortButton({ label, sortKey, activeKey, direction, onClick }: { label: string; sortKey: SaleSortKey; activeKey: SaleSortKey | null; direction: SortDirection; onClick: (key: SaleSortKey) => void }) {
  const isActive = activeKey === sortKey;
  const Icon = isActive ? (direction === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return <button className={`sort-button ${isActive ? "active" : ""}`} onClick={() => onClick(sortKey)} aria-label={`Ordenar ${label} em ordem ${isActive && direction === "desc" ? "crescente" : "decrescente"}`}><span>{label}</span><Icon size={13} /></button>;
}

function AverageAreaValues({ values }: { values?: Record<string, string> }) {
  const ranges = ["120–125 m²", "153–156 m²", "179–187 m²", "372 m²"];
  const transactionCounts: Record<string, number> = { "120–125 m²": 32, "153–156 m²": 9, "179–187 m²": 3, "372 m²": 2 };
  return (
    <section className="surface-card average-area-card">
      <div className="section-heading"><div><p className="section-kicker">Referência de valores</p><h2>Valor médio por metragem</h2></div><Ruler size={21} /></div>
      <div className="area-values-grid">
        {ranges.map((range) => <div className="area-value-item" key={range}><span>{range}</span><strong>{values?.[range] ?? "A informar"}</strong><small>{values?.[range] && values[range] !== "A informar" ? `média de ${transactionCounts[range]} transações` : "valor médio da faixa"}</small></div>)}
      </div>
    </section>
  );
}

function DetailRow({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note?: string }) {
  return <div className="detail-row"><Icon size={17} /><div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div></div>;
}

function App() {
  return (
    <Router hook={useHashLocation}>
      <DashboardApp />
    </Router>
  );
}

export default App;
