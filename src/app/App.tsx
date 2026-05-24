import React, { useState, useEffect, useRef } from "react";
import { BookOpen, Hammer, Scale, Lock, CheckCircle2, Building2 } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import rizalLineArt from "@/imports/2000-1.png";
import rizalFlat from "@/imports/2000__1_.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type Screen =
  | "loading" | "sdg-info" | "chapter-select"
  | "ch1" | "ch1-complete"
  | "ch2" | "ch2-complete"
  | "ch3" | "final-score" | "analysis";

interface Scores { awareness: number; sustainability: number; justice: number; }

interface QuizChoice { id: string; text: string; correct: boolean; }

interface ScenarioData {
  storyPortrait: "lineArt" | "flat";
  storySpeech: string;
  storyNarrative: string;
  storyContext: string;
  type: "word-fill" | "multiple-choice";
  // word-fill
  quote?: string;
  blankCorrect?: string;
  wordOptions?: string[];
  // multiple-choice
  question?: string;
  choices?: QuizChoice[];
  // shared
  correctFeedback: string;
  sdgConnection: string;
  citation: string;
  points: Partial<Scores>;
}

// ─── Scenario Data ────────────────────────────────────────────────────────────

const CH1_SCENARIOS: ScenarioData[] = [
  {
    storyPortrait: "lineArt",
    storySpeech: "My pen shall be mightier than any sword.",
    storyNarrative: "You are José Rizal, a young ilustrado studying medicine and philosophy in Madrid. From across the sea you have witnessed the suffering of your people under colonial rule. The pen trembles in your hand.",
    storyContext: "Madrid, Spain — 1884 · Writing Desk",
    type: "word-fill",
    quote: "Ang kabataan ang ___ ng bayan.",
    blankCorrect: "pag-asa",
    wordOptions: ["pag-asa", "hadlang", "suliranin"],
    correctFeedback: "Rizal believed that educating the youth was the foundation of a sustainable, free nation — a direct reflection of SDG 11's vision for inclusive communities built on knowledge.",
    sdgConnection: "SDG 11.3 — Inclusive and participatory urbanization begins with an educated citizenry.",
    citation: "Rizal, J. P. (1889). Writings of José Rizal. National Historical Commission of the Philippines.",
    points: { awareness: 10 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "Let these pages carry what my voice cannot reach.",
    storyNarrative: "In 1887, you publish Noli Me Tangere under your own name — a dangerous act. The colonial government reacts with fury. Copies are burned and banned, yet they spread across the archipelago like wildfire.",
    storyContext: "Berlin, Germany — 1887 · Noli Me Tangere",
    type: "multiple-choice",
    question: "Noli Me Tangere (1887) addresses SDG 11 principles most directly by...",
    choices: [
      { id:"a", text:"Describing the architectural beauty of colonial Manila's churches and plazas", correct:false },
      { id:"b", text:"Exposing how unjust social systems degrade community life, dignity, and human potential", correct:true },
      { id:"c", text:"Celebrating the cultural achievements of Spanish governance in the Philippines", correct:false },
    ],
    correctFeedback: "Rizal's novel revealed that sustainable communities cannot exist without social justice. His critique of colonial structures mirrors SDG 11's insistence that cities must be inclusive and equitable.",
    sdgConnection: "SDG 11 — Sustainable cities require social equity and human dignity, not just physical infrastructure.",
    citation: "Guerrero, L. M. (1963). The first Filipino: A biography of José Rizal. National Heroes Commission.",
    points: { awareness: 10 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "Reform without justice is nothing but decoration.",
    storyNarrative: "On July 3, 1892, you establish La Liga Filipina — a peaceful civic organization for mutual aid and community self-sufficiency. Three days later, you are arrested. The organization is disbanded. But the idea survives.",
    storyContext: "Manila — July 3, 1892 · La Liga Filipina",
    type: "multiple-choice",
    question: "La Liga Filipina's program of civic self-help aligns most with SDG 11 because it...",
    choices: [
      { id:"a", text:"Called for immediate armed revolution against the colonial administration", correct:false },
      { id:"b", text:"Promoted mutual self-help, civic participation, and community-governed development", correct:true },
      { id:"c", text:"Sought to grant ilustrados exclusive rights while excluding the poor", correct:false },
    ],
    correctFeedback: "SDG 11.3 calls for participatory and inclusive urbanization. La Liga Filipina's vision of community self-governance embodied this principle over a century before the SDGs were written.",
    sdgConnection: "SDG 11.3 — Participatory, inclusive, and sustainable human settlement planning.",
    citation: "Zaide, G. F. (1984). José Rizal: Life, works and writings. National Book Store.",
    points: { awareness: 10, justice: 5 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "A nation that forgets its past has no future to build.",
    storyNarrative: "In 1890, you annotate Antonio de Morga's Sucesos de las Islas Filipinas — proving that Filipinos possessed a rich, sophisticated civilization long before Spanish arrival. History, Rizal knew, is community identity.",
    storyContext: "Paris — 1890 · Annotation of Morga",
    type: "multiple-choice",
    question: "Rizal's annotation of Morga's Sucesos most directly demonstrates SDG...",
    choices: [
      { id:"a", text:"SDG 11.2 — Sustainable transport systems for accessible cities", correct:false },
      { id:"b", text:"SDG 11.4 — Strengthen protection of cultural and natural heritage", correct:true },
      { id:"c", text:"SDG 11.5 — Disaster risk reduction and community resilience", correct:false },
    ],
    correctFeedback: "By documenting pre-colonial Filipino civilization, Rizal demonstrated that cultural heritage is a living resource for community identity. SDG 11.4 recognizes this: a community that knows its history can build its future.",
    sdgConnection: "SDG 11.4 — Cultural heritage is the foundation of sustainable community identity.",
    citation: "Craig, A. (1913). Lineage, life and labors of José Rizal. Philippine Education Company.",
    points: { awareness: 10 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "El Filibusterismo is my warning to the world. Heed it.",
    storyNarrative: "In 1891, you complete El Filibusterismo — darker and more urgent than Noli. This second novel depicts what happens when reform is denied and an entire people are left without hope, recourse, or dignity.",
    storyContext: "Ghent, Belgium — 1891 · El Filibusterismo",
    type: "multiple-choice",
    question: "El Filibusterismo warns that communities denied justice will...",
    choices: [
      { id:"a", text:"Remain stable and accept colonial authority as a permanent condition", correct:false },
      { id:"b", text:"Eventually fracture into conflict, destroying any foundation for sustainable development", correct:true },
      { id:"c", text:"Naturally evolve toward prosperous cooperation with colonial powers", correct:false },
    ],
    correctFeedback: "Rizal foresaw that without justice, no community can remain stable or sustainable. SDG 11 recognizes this link — only inclusive, just settlements have the resilience to endure and flourish.",
    sdgConnection: "SDG 11 — Justice and inclusion are prerequisites for truly sustainable cities.",
    citation: "Rizal, J. P. (1891). El filibusterismo (C. Derbyshire, Trans.). Philippine Education Company.",
    points: { awareness: 10, justice: 5 },
  },
];

const CH2_SCENARIOS: ScenarioData[] = [
  {
    storyPortrait: "flat",
    storySpeech: "Let us build what others only dare to dream.",
    storyNarrative: "Exiled to Dapitan in 1892, you find not punishment — but possibility. The town water system is broken. Families walk hours for clean water. You have limited materials and one chance to get this right.",
    storyContext: "Dapitan, Mindanao — 1892 · The Waterworks",
    type: "multiple-choice",
    question: "Dapitan's water system has failed. What do you build to restore clean water for the town?",
    choices: [
      { id:"pipes",  text:"Install bamboo and clay water pipes routing clean water to every home", correct:true },
      { id:"statue", text:"Erect a decorative stone monument in the town plaza", correct:false },
      { id:"fence",  text:"Build a perimeter fence around the contaminated water source", correct:false },
    ],
    correctFeedback: "Rizal personally designed and built Dapitan's water system using bamboo pipes — a practical, community-centered solution. This is SDG 11.6 in practice: reducing environmental impact and ensuring clean water access for all.",
    sdgConnection: "SDG 11.6 — Reduce environmental impact and ensure access to clean water in human settlements.",
    citation: "Ocampo, A. R. (2000). Rizal without the overcoat. Anvil Publishing.",
    points: { sustainability: 15 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "An educated people cannot long be oppressed.",
    storyNarrative: "You establish a school in Dapitan, teaching reading, mathematics, natural science, and Spanish — free of charge. Children from the poorest families learn and flourish. You teach them not just facts, but how to think.",
    storyContext: "Dapitan — 1893 · The School",
    type: "multiple-choice",
    question: "Rizal's free school in Dapitan demonstrates SDG 11 principles by...",
    choices: [
      { id:"a", text:"Reserving quality education for the ilustrado and merchant classes only", correct:false },
      { id:"b", text:"Building community capacity through free, inclusive education accessible to all", correct:true },
      { id:"c", text:"Implementing the standard Spanish colonial curriculum without any modification", correct:false },
    ],
    correctFeedback: "Inclusive education builds the human foundation of sustainable communities. Rizal's school modeled SDG 11.3 — communities where every resident, regardless of class, can participate fully in civic life.",
    sdgConnection: "SDG 11.3 — Inclusive settlement planning includes universal access to knowledge and education.",
    citation: "Zaide, G. F. (1984). José Rizal: Life, works and writings. National Book Store.",
    points: { sustainability: 10, awareness: 5 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "The earth feeds us if we learn to listen to it.",
    storyNarrative: "You introduce scientific farming to Dapitan — crop rotation, organic techniques, and diverse planting to ensure year-round food security. You document local flora and fauna, cataloguing species unknown to Western science.",
    storyContext: "Dapitan Farmlands — 1893–1896 · Agricultural Reform",
    type: "multiple-choice",
    question: "Rizal's approach to agriculture in Dapitan BEST reflects which SDG 11 principle?",
    choices: [
      { id:"a", text:"Large-scale industrial monoculture to maximize export revenue for Spain", correct:false },
      { id:"b", text:"Environmental sustainability and local food security within the community itself", correct:true },
      { id:"c", text:"Replacing traditional Filipino crops with European imports as a sign of progress", correct:false },
    ],
    correctFeedback: "Rizal's integrated farming — local plants, sustainable techniques, community food security — directly mirrors SDG 11.6 and 11.7: environmental sustainability and productive, inclusive spaces within human settlements.",
    sdgConnection: "SDG 11.6 / 11.7 — Environmental sustainability and accessible green productive spaces.",
    citation: "Bantug, J. P. (1946). A short history of medicine in the Philippines. Colegio Médico Farmacéutico.",
    points: { sustainability: 15 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "A town well-planned is a town well-lived.",
    storyNarrative: "You survey and map Dapitan systematically — planning streets, public spaces, and buildings with careful attention to sanitation, access, and community needs. Your maps are precise. Your intentions are clear.",
    storyContext: "Dapitan — 1894 · Town Planning",
    type: "multiple-choice",
    question: "Rizal's systematic town planning and mapping in Dapitan is best described as...",
    choices: [
      { id:"a", text:"Colonial urban segregation — placing elite families in fortified central zones", correct:false },
      { id:"b", text:"Participatory, evidence-based community development — a core pillar of SDG 11", correct:true },
      { id:"c", text:"Rapid unplanned expansion with no regard for environmental consequences", correct:false },
    ],
    correctFeedback: "Rizal's planning of Dapitan — sanitation, street layout, public access — anticipated SDG 11.3 by over a century. His town became a living model of self-governed, intentional community design.",
    sdgConnection: "SDG 11.3 — Inclusive, integrated, and participatory human settlement planning.",
    citation: "Guerrero, L. M. (1963). The first Filipino: A biography of José Rizal. National Heroes Commission.",
    points: { sustainability: 15 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "Healing one person strengthens the whole community.",
    storyNarrative: "You treat patients from across Mindanao — many traveling days to reach your Dapitan clinic. You perform surgery, distribute medicine, and charge nothing to those who cannot pay. The sick become the healed; the healed become the community.",
    storyContext: "Dapitan Clinic — 1892–1896 · Free Medical Care",
    type: "multiple-choice",
    question: "Rizal's free medical care in Dapitan connects to SDG 11 because...",
    choices: [
      { id:"a", text:"It allowed Rizal to accumulate wealth and influence in Mindanao society", correct:false },
      { id:"b", text:"Inclusive healthcare ensures all community members can participate in civic and economic life", correct:true },
      { id:"c", text:"It proved that Spanish-trained physicians were superior to indigenous healers", correct:false },
    ],
    correctFeedback: "Accessible healthcare ensures all community members can fully participate in civic life. Rizal's clinic embodied SDG 11.1 — adequate, inclusive services for all members of a settlement, not just those who can afford them.",
    sdgConnection: "SDG 11.1 — Adequate and inclusive social services accessible to all members of the community.",
    citation: "Ocampo, A. R. (2000). Rizal without the overcoat. Anvil Publishing.",
    points: { sustainability: 10, justice: 5 },
  },
];

const CH3_SCENARIOS: ScenarioData[] = [
  {
    storyPortrait: "lineArt",
    storySpeech: "Truth must be spoken even when silence is far safer.",
    storyNarrative: "Colonial abuse has been documented and exposed. Evidence of exploitation is in your hands. The entire nation watches what Rizal will do. The path of silence protects you — but betrays every community you claim to serve.",
    storyContext: "The Philippines — 1896 · The Reform Decision",
    type: "multiple-choice",
    question: "Evidence of colonial abuse is in your hands. The people are watching. You...",
    choices: [
      { id:"publish", text:"Publish the truth — write and distribute a documented exposé of colonial abuse", correct:true },
      { id:"silent",  text:"Stay silent — protect yourself and your family from certain backlash", correct:false },
      { id:"panic",   text:"Spread panic — inflame the populace without a plan or verified evidence", correct:false },
    ],
    correctFeedback: "Rizal consistently chose truth over safety. His willingness to expose injustice reflects SDG 11.3's principle that civic participation and transparent, accountable governance are the pillars of sustainable communities.",
    sdgConnection: "SDG 11.3 — Participatory governance and civic accountability within human settlements.",
    citation: "Guerrero, L. M. (1963). The first Filipino: A biography of José Rizal. National Heroes Commission.",
    points: { justice: 15 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "History is not theirs to rewrite — it belongs to the people.",
    storyNarrative: "The colonial government is quietly replacing Filipino history in school textbooks — rewriting the narrative to justify and normalize their rule. You discover this deliberate erasure of a people's entire past.",
    storyContext: "Manila — 1895 · Cultural Erasure",
    type: "multiple-choice",
    question: "Filipino history is being systematically erased from colonial textbooks. You respond by...",
    choices: [
      { id:"correct", text:"Correcting the historical records — documenting and preserving the true history of Filipino civilization", correct:true },
      { id:"ignore",  text:"Ignoring it — the risk to your life and family from speaking out is simply too great", correct:false },
      { id:"destroy", text:"Destroying the colonial archives entirely before they can spread further misinformation", correct:false },
    ],
    correctFeedback: "Preservation of cultural heritage — history, language, art, identity — is the foundation of community self-understanding. Rizal's annotation of Morga was precisely this act of cultural rescue and SDG 11.4 stewardship.",
    sdgConnection: "SDG 11.4 — Strengthen efforts to protect the world's cultural and natural heritage for future generations.",
    citation: "Craig, A. (1913). Lineage, life and labors of José Rizal. Philippine Education Company.",
    points: { awareness: 10, justice: 10 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "I die without seeing the dawn — but I know it will come.",
    storyNarrative: "December 29, 1896. On the night before your execution, you write your final poem — Mi Último Adiós (My Last Farewell). You fold it and hide it inside your alcohol lamp. Tomorrow, you face the firing squad at Bagumbayan.",
    storyContext: "Fort Santiago, Manila — December 29, 1896 · Mi Último Adiós",
    type: "multiple-choice",
    question: "Mi Último Adiós connects to SDG 11 specifically because it...",
    choices: [
      { id:"a", text:"Provides technical specifications for national infrastructure development projects", correct:false },
      { id:"b", text:"Calls future generations to love and actively preserve their nation's cultural identity and heritage", correct:true },
      { id:"c", text:"Accepts colonial rule as a permanent and unavoidable condition of Filipino communities", correct:false },
    ],
    correctFeedback: "In his final poem, Rizal entrusted the nation's future to those who would come after him. This is SDG 11.4 at its most profound: cultural heritage preserved as a living, generational gift — not just monuments, but identity itself.",
    sdgConnection: "SDG 11.4 — Cultural heritage must be safeguarded as the foundation future communities build upon.",
    citation: "Rizal, J. P. (1896). Mi último adiós. National Historical Commission of the Philippines.",
    points: { justice: 10, awareness: 5 },
  },
  {
    storyPortrait: "flat",
    storySpeech: "A just community is built by its people, not imposed by its rulers.",
    storyNarrative: "Rizal's La Liga Filipina proposed a radically democratic vision: that Filipinos could organize, govern, sustain, and improve themselves — without colonial dependence of any kind. This idea outlives every attempt to silence it.",
    storyContext: "Manila — July 1892 · La Liga Filipina's Vision",
    type: "multiple-choice",
    question: "Rizal's concept of community self-governance through La Liga Filipina BEST reflects...",
    choices: [
      { id:"a", text:"SDG 11.1 — Adequate housing and basic services for all residents", correct:false },
      { id:"b", text:"SDG 11.3 — Participatory, inclusive, and sustainable human settlement planning and governance", correct:true },
      { id:"c", text:"SDG 11.5 — Disaster risk reduction strategies and resilience infrastructure", correct:false },
    ],
    correctFeedback: "La Liga Filipina's framework for community mutual aid and democratic self-governance anticipates SDG 11.3 by over a century. Rizal understood that communities must govern themselves — with full participation — to truly flourish.",
    sdgConnection: "SDG 11.3 — By 2030, enhance inclusive and participatory human settlement planning and management.",
    citation: "Zaide, G. F. (1984). José Rizal: Life, works and writings. National Book Store.",
    points: { justice: 15 },
  },
  {
    storyPortrait: "lineArt",
    storySpeech: "I have planted seeds I will not live to harvest.",
    storyNarrative: "December 30, 1896. José Rizal faces the firing squad at Bagumbayan at 7:03 in the morning. Before the shots are fired, he twists to fall face-up — refusing to be shot in the back. His entire life has been an argument for one idea.",
    storyContext: "Bagumbayan Field, Manila — December 30, 1896 · The Legacy",
    type: "multiple-choice",
    question: "Which statement BEST summarizes how Rizal's complete life embodies SDG 11?",
    choices: [
      { id:"a", text:"He contributed primarily through physical construction of buildings that still stand in the Philippines", correct:false },
      { id:"b", text:"He demonstrated that educated, just, and self-sufficient communities are the only real foundation for sustainable nationhood", correct:true },
      { id:"c", text:"He ultimately showed that colonial development was necessary for Philippine modernization", correct:false },
    ],
    correctFeedback: "From Noli Me Tangere to the Dapitan waterworks to Mi Último Adiós — Rizal's entire life was one sustained argument for SDG 11: that sustainable communities require education, justice, cultural identity, and full civic participation.",
    sdgConnection: "SDG 11 — Sustainable cities and communities require education, justice, cultural heritage, and inclusive governance.",
    citation: "United Nations. (2015). Transforming our world: The 2030 agenda for sustainable development (A/RES/70/1). https://sdgs.un.org/goals/goal11",
    points: { justice: 10, awareness: 5 },
  },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E")`;

function ParchmentPage({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden"
      style={{ background: dark ? "#160B05" : "#F8F1E5" }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: NOISE, backgroundRepeat: "repeat" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(43,30,24,0.25) 100%)" }} />
      <div className="relative flex-1">{children}</div>
    </div>
  );
}

function OrnateFrame({ children, className = "", dark = false }: {
  children: React.ReactNode; className?: string; dark?: boolean;
}) {
  const borderColor = dark ? "rgba(200,162,77,0.45)" : "rgba(43,30,24,0.45)";
  const innerColor  = dark ? "rgba(200,162,77,0.16)" : "rgba(43,30,24,0.16)";
  const ornColor    = dark ? "rgba(200,162,77,0.5)"  : "rgba(43,30,24,0.5)";
  return (
    <div className={`relative p-[5px] ${className}`}
      style={{ border: `2px solid ${borderColor}` }}>
      <div className="absolute inset-[8px] pointer-events-none"
        style={{ border: `1px solid ${innerColor}` }} />
      {["top-[3px] left-[3px]","top-[3px] right-[3px]","bottom-[3px] left-[3px]","bottom-[3px] right-[3px]"].map((p,i) => (
        <span key={i} className={`absolute ${p} select-none`}
          style={{ fontSize:9, color: ornColor, lineHeight:1 }}>◆</span>
      ))}
      <div className="relative p-5 md:p-7">{children}</div>
    </div>
  );
}

function Divider({ label = "✦", dark = false }: { label?: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1" style={{ borderTop:`1px solid ${dark ? "rgba(200,162,77,0.2)" : "rgba(43,30,24,0.2)"}` }} />
      <span className="font-cinzel tracking-[0.3em] uppercase"
        style={{ fontSize:10, color: dark ? "rgba(200,162,77,0.38)" : "rgba(43,30,24,0.35)" }}>
        {label}
      </span>
      <div className="flex-1" style={{ borderTop:`1px solid ${dark ? "rgba(200,162,77,0.2)" : "rgba(43,30,24,0.2)"}` }} />
    </div>
  );
}

function InkButton({ onClick, children, variant = "ink", disabled = false }: {
  onClick: () => void; children: React.ReactNode;
  variant?: "ink" | "green" | "gold"; disabled?: boolean;
}) {
  const styles: Record<string,string> = {
    ink:   "border-foreground/55 text-foreground hover:bg-foreground hover:text-background",
    green: "border-primary bg-primary text-primary-foreground hover:brightness-110",
    gold:  "text-[#C8A24D] hover:bg-[#C8A24D] hover:text-[#160B05]",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`font-inter font-semibold text-xs tracking-[0.18em] uppercase px-8 py-3 border-2 transition-all duration-300 disabled:opacity-40 ${styles[variant]}`}
      style={variant === "gold" ? { borderColor:"#C8A24D" } : undefined}>
      {children}
    </button>
  );
}

function Portrait({ type, silhouette = false, className = "" }: {
  type: "lineArt" | "flat"; silhouette?: boolean; className?: string;
}) {
  return (
    <ImageWithFallback
      src={type === "lineArt" ? rizalLineArt : rizalFlat}
      alt="José Rizal illustration"
      className={`${silhouette ? "brightness-0" : ""} ${className}`}
    />
  );
}

function ScoreBarAnimated({ label, value, max, color }: {
  label: string; value: number; max: number; color: string;
}) {
  const pct = Math.round((value / max) * 100);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--meter-target", `${pct}%`);
    ref.current.style.animation = "none";
    void ref.current.offsetWidth;
    ref.current.style.animation = "meterGrow 1.1s ease-out forwards";
  }, [pct]);
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="font-cinzel tracking-wider text-foreground/65" style={{ fontSize:11 }}>{label}</span>
        <span className="font-inter font-semibold" style={{ fontSize:11, color }}>{value}/{max}</span>
      </div>
      <div className="h-2.5 bg-foreground/12 overflow-hidden" style={{ borderRadius:1 }}>
        <div ref={ref} className="h-full" style={{ backgroundColor: color, width:0 }} />
      </div>
    </div>
  );
}

// ─── Story + Quiz Screen ──────────────────────────────────────────────────────

function StoryPanel({ scenario, dark }: { scenario: ScenarioData; dark: boolean }) {
  const tc = dark ? "rgba(240,230,200,0.78)" : "rgba(43,30,24,0.78)";
  const bc = dark ? "rgba(200,162,77,0.22)"  : "rgba(43,30,24,0.18)";
  const ac = dark ? "rgba(200,162,77,0.5)"   : "rgba(43,30,24,0.35)";
  return (
    <div className="flex flex-col items-center">
      <div className="w-full" style={{ border:`1px solid ${bc}` }}>
        <Portrait type={scenario.storyPortrait} className="w-full h-48 object-cover object-left" />
      </div>
      <div className="relative w-full mt-4 p-4"
        style={{ background: dark ? "rgba(240,230,200,0.05)" : "rgba(237,229,208,0.7)", border:`1px solid ${bc}` }}>
        <div className="absolute -top-[7px] left-5 w-3 h-3 rotate-45"
          style={{ background: dark ? "#160B05" : "#EDE5D0", borderLeft:`1px solid ${bc}`, borderTop:`1px solid ${bc}` }} />
        <p className="font-im-fell italic leading-relaxed" style={{ fontSize:11.5, color: tc, lineHeight: "1.7" }}>
          &ldquo;{scenario.storySpeech}&rdquo;
        </p>
        <p className="font-cinzel tracking-[0.18em] uppercase mt-2" style={{ fontSize:8, color: ac }}>
          — Rizal
        </p>
      </div>
    </div>
  );
}

function WordFillQuiz({ scenario, dark, wrong, snapped, onCorrect, onWrong }: {
  scenario: ScenarioData; dark: boolean;
  wrong: string | null; snapped: string | null;
  onCorrect: () => void; onWrong: (w: string) => void;
}) {
  return (
    <div>
      <div className={`p-7 ${snapped ? "animate-book-glow" : ""}`}
        style={{
          background: "#F5EDD8",
          border: "2px solid rgba(43,30,24,0.32)",
          boxShadow: snapped
            ? "0 0 35px rgba(200,162,77,0.55), 0 4px 16px rgba(0,0,0,0.3)"
            : "0 3px 12px rgba(0,0,0,0.25)",
        }}>
        <div className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none"
          style={{ background:"rgba(43,30,24,0.1)", position:"relative", height:0 }} />
        <p className="font-cinzel text-center text-foreground/35 tracking-widest uppercase mb-4" style={{ fontSize:9 }}>
          Complete the Quote
        </p>
        <div className="font-im-fell text-foreground text-center leading-loose"
          style={{ fontSize:"clamp(0.95rem,2.5vw,1.1rem)", lineHeight: "1.9" }}>
          <span>&ldquo;{scenario.quote?.split("___")[0]}</span>
          <span className="inline-flex items-end mx-2" style={{ minWidth:88, verticalAlign:"bottom" }}>
            {snapped ? (
              <span className="font-cinzel font-bold animate-snap-in px-2"
                style={{ color:"#5E8B4A", borderBottom:"2px solid #5E8B4A" }}>
                {snapped}
              </span>
            ) : (
              <span style={{ display:"inline-block", minWidth:88, borderBottom:"2px solid rgba(43,30,24,0.45)", marginBottom:2 }} />
            )}
          </span>
          <span>{scenario.quote?.split("___")[1]}&rdquo;</span>
        </div>
        <p className="font-cinzel text-center text-foreground/28 tracking-widest mt-4" style={{ fontSize:9 }}>
          — José Rizal
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-5">
        {scenario.wordOptions?.map((word) => {
          const isWrong   = wrong === word;
          const isSnapped = snapped === word;
          return (
            <button key={word}
              onClick={() => !snapped && (word === scenario.blankCorrect ? onCorrect() : onWrong(word))}
              disabled={!!snapped}
              className={`font-cinzel font-bold px-5 py-3 transition-all duration-200 select-none
                ${isWrong ? "animate-shake" : ""}
                ${!snapped && !isWrong ? "hover:-translate-y-1 hover:shadow-lg" : ""}
                ${isSnapped ? "opacity-0 scale-75" : ""}
              `}
              style={{
                fontSize:13,
                background: isWrong ? "rgba(156,61,61,0.18)" : "rgba(248,241,229,0.95)",
                color: isWrong ? "#9C3D3D" : "#2B1E18",
                border: isWrong ? "2px solid #9C3D3D" : "2px solid rgba(43,30,24,0.4)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.22)",
                transition: isSnapped ? "opacity 0.3s,transform 0.3s" : undefined,
              }}>
              {word}
            </button>
          );
        })}
      </div>
      {wrong && (
        <p className="text-center font-inter font-semibold mt-4 animate-slide-up" style={{ fontSize:12, color:"#9C3D3D" }}>
          ✕ &nbsp;Wrong answer — try again.
        </p>
      )}
    </div>
  );
}

function MultiChoiceQuiz({ scenario, dark, wrong, onCorrect, onWrong }: {
  scenario: ScenarioData; dark: boolean;
  wrong: string | null;
  onCorrect: () => void; onWrong: (id: string) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  useEffect(() => { setChosen(null); }, [scenario]);

  const handleClick = (c: QuizChoice) => {
    if (chosen) return;
    setChosen(c.id);
    if (c.correct) { onCorrect(); }
    else { onWrong(c.id); setTimeout(() => setChosen(null), 750); }
  };

  const bc = dark ? "rgba(200,162,77,0.22)" : "rgba(43,30,24,0.22)";
  return (
    <div className="space-y-3">
      <p className="font-cinzel font-bold leading-snug mb-4"
        style={{ fontSize:13, color: dark ? "#F0E6C8" : "#2B1E18" }}>
        {scenario.question}
      </p>
      {scenario.choices?.map((c) => {
        const isChosen  = chosen === c.id;
        const isCorrect = isChosen && c.correct;
        const isWrong   = isChosen && !c.correct;
        return (
          <button key={c.id}
            onClick={() => handleClick(c)}
            disabled={!!chosen && !isChosen}
            className={`w-full text-left p-4 transition-all duration-250
              ${isWrong ? "animate-shake" : ""}
              ${!chosen ? "hover:-translate-y-0.5 hover:shadow-sm" : ""}
            `}
            style={{
              border: isCorrect ? "2px solid #5E8B4A"
                    : isWrong   ? "2px solid #9C3D3D"
                    : `2px solid ${bc}`,
              background: isCorrect ? "rgba(94,139,74,0.1)"
                        : isWrong   ? "rgba(156,61,61,0.1)"
                        : dark ? "rgba(240,230,200,0.04)" : "rgba(248,241,229,0.5)",
            }}>
            <p className="font-merriweather leading-snug" style={{ fontSize:12.5, color: dark ? "rgba(240,230,200,0.82)" : "rgba(43,30,24,0.82)", lineHeight: "1.6" }}>
              {c.text}
            </p>
            {isCorrect && (
              <p className="font-inter font-semibold mt-1.5 animate-snap-in" style={{ fontSize:11, color:"#5E8B4A" }}>
                ✓ Correct
              </p>
            )}
            {isWrong && (
              <p className="font-inter font-semibold mt-1.5" style={{ fontSize:11, color:"#9C3D3D" }}>
                ✕ Incorrect — try again.
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FeedbackPanel({ scenario, dark, onNext, isLast }: {
  scenario: ScenarioData; dark: boolean; onNext: () => void; isLast: boolean;
}) {
  const greenBg  = dark ? "rgba(94,139,74,0.12)"  : "rgba(94,139,74,0.08)";
  const greenBdr = dark ? "rgba(94,139,74,0.4)"   : "rgba(94,139,74,0.45)";
  const citeBg   = dark ? "rgba(240,230,200,0.04)" : "rgba(248,241,229,0.6)";
  const citeBdr  = dark ? "rgba(200,162,77,0.2)"  : "rgba(43,30,24,0.18)";
  const pts = scenario.points;
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Correct feedback */}
      <div className="p-5" style={{ background: greenBg, border:`2px solid ${greenBdr}` }}>
        <p className="font-inter font-semibold mb-2" style={{ fontSize:12, color:"#5E8B4A" }}>✓ Correct!</p>
        <p className="font-merriweather leading-relaxed" style={{ fontSize:12, color: dark ? "rgba(240,230,200,0.78)" : "rgba(43,30,24,0.78)", lineHeight: "1.7" }}>
          {scenario.correctFeedback}
        </p>
      </div>
      {/* Points + SDG */}
      <div className="flex flex-wrap gap-3 items-start">
        <div className="flex gap-3 flex-wrap">
          {(pts.awareness    ?? 0) > 0 && <span className="font-inter font-bold px-3 py-1.5 text-xs" style={{ background:"rgba(94,139,74,0.12)", color:"#5E8B4A", border:"1px solid #5E8B4A55" }}>+{pts.awareness} Awareness</span>}
          {(pts.sustainability ?? 0) > 0 && <span className="font-inter font-bold px-3 py-1.5 text-xs" style={{ background:"rgba(200,162,77,0.12)", color:"#C8A24D", border:"1px solid #C8A24D55" }}>+{pts.sustainability} Sustainability</span>}
          {(pts.justice      ?? 0) > 0 && <span className="font-inter font-bold px-3 py-1.5 text-xs" style={{ background:"rgba(156,61,61,0.12)", color:"#9C3D3D", border:"1px solid #9C3D3D55" }}>+{pts.justice} Justice</span>}
        </div>
      </div>
      {/* SDG connection */}
      <div className="border-l-2 border-primary pl-4 py-1">
        <p className="font-cinzel uppercase tracking-widest mb-1" style={{ fontSize:8, color: dark ? "rgba(200,162,77,0.5)" : "rgba(43,30,24,0.35)" }}>SDG Connection</p>
        <p className="font-merriweather italic" style={{ fontSize:11.5, color:"#5E8B4A", lineHeight: "1.6" }}>{scenario.sdgConnection}</p>
      </div>
      {/* APA citation */}
      <div className="p-4" style={{ background: citeBg, border:`1px solid ${citeBdr}` }}>
        <p className="font-cinzel uppercase tracking-widest mb-2" style={{ fontSize:8, color: dark ? "rgba(200,162,77,0.45)" : "rgba(43,30,24,0.32)" }}>Source (APA 7th Edition)</p>
        <p className="font-merriweather italic leading-relaxed" style={{ fontSize:10.5, color: dark ? "rgba(240,230,200,0.55)" : "rgba(43,30,24,0.55)", lineHeight: "1.65" }}>
          {scenario.citation}
        </p>
      </div>
      <div className="flex justify-end pt-2">
        {dark
          ? <InkButton onClick={onNext} variant="gold">{isLast ? "Complete Chapter →" : "Next →"}</InkButton>
          : <InkButton onClick={onNext} variant="green">{isLast ? "Complete Chapter →" : "Next →"}</InkButton>
        }
      </div>
    </div>
  );
}

// ─── Chapter Game Screen (reusable) ──────────────────────────────────────────

function ChapterGameScreen({
  chapterNum, chapterTitle, location, accentColor, scenarios, dark, scores, onComplete,
}: {
  chapterNum: string; chapterTitle: string; location: string; accentColor: string;
  scenarios: ScenarioData[]; dark: boolean; scores: Scores;
  onComplete: (earned: Scores) => void;
}) {
  const [idx,      setIdx]      = useState(0);
  const [phase,    setPhase]    = useState<"quiz"|"feedback">("quiz");
  const [wrong,    setWrong]    = useState<string|null>(null);
  const [snapped,  setSnapped]  = useState<string|null>(null);
  const [earned,   setEarned]   = useState<Scores>({ awareness:0, sustainability:0, justice:0 });

  const scenario = scenarios[idx];

  const handleCorrect = () => {
    const next: Scores = {
      awareness:      earned.awareness      + (scenario.points.awareness      ?? 0),
      sustainability: earned.sustainability + (scenario.points.sustainability ?? 0),
      justice:        earned.justice        + (scenario.points.justice        ?? 0),
    };
    setEarned(next);
    setPhase("feedback");
  };

  const handleNext = () => {
    if (idx + 1 < scenarios.length) {
      setIdx(idx + 1);
      setPhase("quiz");
      setWrong(null);
      setSnapped(null);
    } else {
      onComplete(earned);
    }
  };

  // Running totals for display
  const runningScores: Scores = {
    awareness:      scores.awareness      + earned.awareness,
    sustainability: scores.sustainability + earned.sustainability,
    justice:        scores.justice        + earned.justice,
  };

  const tc = dark ? "#F0E6C8" : "#2B1E18";

  return (
    <ParchmentPage dark={dark}>
      <div className="min-h-screen px-4 py-10">
        <div className="max-w-3xl mx-auto animate-screen-in">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-6 text-xs font-inter font-semibold">
                <span style={{ color:"#5E8B4A" }}>AWR {runningScores.awareness}</span>
                <span style={{ color:"#C8A24D" }}>SUS {runningScores.sustainability}</span>
                <span style={{ color:"#9C3D3D" }}>JUS {runningScores.justice}</span>
              </div>
              <span className="font-inter text-xs font-semibold"
                style={{ color: dark ? "rgba(200,162,77,0.5)" : "rgba(43,30,24,0.4)" }}>
                Scenario {idx + 1} / {scenarios.length}
              </span>
            </div>
            {/* Scenario progress dots */}
            <div className="flex gap-1.5">
              {scenarios.map((_, i) => (
                <div key={i} className="h-1 flex-1 transition-all duration-500"
                  style={{ background: i < idx ? accentColor : i === idx ? `${accentColor}70` : (dark ? "rgba(240,230,200,0.1)" : "rgba(43,30,24,0.1)") }} />
              ))}
            </div>
            <div className="text-center mt-5">
              <p className="font-cinzel tracking-[0.38em] uppercase" style={{ fontSize:10, color: dark ? `${accentColor}90` : "rgba(43,30,24,0.38)" }}>
                Chapter {chapterNum}
              </p>
              <h2 className="font-cinzel font-black mt-1" style={{ fontSize:"clamp(1.3rem,4vw,1.9rem)", color: tc }}>
                {chapterTitle}
              </h2>
              <p className="font-merriweather italic mt-1" style={{ fontSize:11, color: dark ? "rgba(240,230,200,0.4)" : "rgba(43,30,24,0.42)" }}>
                {location}
              </p>
            </div>
          </div>

          {/* Main grid: portrait | story+quiz */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-8">
            {/* Left: portrait + speech */}
            <div className="md:col-span-1">
              <StoryPanel scenario={scenario} dark={dark} />
            </div>

            {/* Right: narrative + quiz/feedback */}
            <div className="md:col-span-2 space-y-5">
              {/* Story narrative */}
              <div className="p-5" style={{
                background: dark ? "rgba(240,230,200,0.04)" : "rgba(248,241,229,0.5)",
                border:`1px solid ${dark ? "rgba(200,162,77,0.18)" : "rgba(43,30,24,0.14)"}`,
              }}>
                <p className="font-cinzel uppercase tracking-wider mb-2"
                  style={{ fontSize:9, color: dark ? `${accentColor}80` : "rgba(43,30,24,0.38)" }}>
                  {scenario.storyContext}
                </p>
                <p className="font-merriweather text-sm leading-relaxed"
                  style={{ fontSize: 12.5, color: dark ? "rgba(240,230,200,0.78)" : "rgba(43,30,24,0.78)", lineHeight: "1.7" }}>
                  {scenario.storyNarrative}
                </p>
              </div>

              {/* Quiz area */}
              {phase === "quiz" && (
                <div className="animate-screen-in pt-1">
                  {scenario.type === "word-fill" ? (
                    <WordFillQuiz
                      scenario={scenario} dark={dark}
                      wrong={wrong} snapped={snapped}
                      onCorrect={() => { setSnapped(scenario.blankCorrect!); setTimeout(handleCorrect, 700); }}
                      onWrong={(w) => { setWrong(w); setTimeout(() => setWrong(null), 720); }}
                    />
                  ) : (
                    <MultiChoiceQuiz
                      scenario={scenario} dark={dark}
                      wrong={wrong}
                      onCorrect={handleCorrect}
                      onWrong={(id) => { setWrong(id); setTimeout(() => setWrong(null), 720); }}
                    />
                  )}
                </div>
              )}

              {/* Feedback area */}
              {phase === "feedback" && (
                <FeedbackPanel
                  scenario={scenario} dark={dark}
                  onNext={handleNext} isLast={idx + 1 >= scenarios.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ParchmentPage>
  );
}

// ─── Chapter Complete Screens ─────────────────────────────────────────────────

function ChapterCompleteScreen({
  chapterNum, title, portrait, summaryText, sdgLink, earned, color, onContinue, continueLabel,
}: {
  chapterNum: string; title: string; portrait: "lineArt"|"flat";
  summaryText: string; sdgLink: string; earned: Scores; color: string;
  onContinue: () => void; continueLabel: string;
}) {
  const totalEarned = earned.awareness + earned.sustainability + earned.justice;
  return (
    <ParchmentPage>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-14 sm:py-18">
        <div className="w-full max-w-sm animate-screen-in">
          <OrnateFrame>
            <div className="text-center space-y-5">
              <div className="flex justify-center">
                <div className="w-40">
                  <Portrait type={portrait} className="w-full h-48 object-cover object-left" />
                </div>
              </div>
              <div>
                <p className="font-cinzel text-foreground/38 tracking-widest uppercase" style={{ fontSize:10 }}>
                  Chapter {chapterNum} Complete
                </p>
                <h3 className="font-cinzel font-black text-foreground mt-2"
                  style={{ fontSize:"clamp(1.2rem,3.5vw,1.65rem)" }}>
                  {title}
                </h3>
              </div>
              <div className="py-4 px-5" style={{ background:`${color}14`, border:`2px solid ${color}55` }}>
                <p className="font-inter font-bold" style={{ fontSize:28, color }}>{totalEarned}</p>
                <p className="font-cinzel tracking-wider text-foreground/50 uppercase mt-1" style={{ fontSize:9 }}>
                  Points Earned this Chapter
                </p>
              </div>
              <p className="font-merriweather italic text-foreground/62 leading-relaxed" style={{ fontSize:12, lineHeight:"1.7" }}>
                {summaryText}
              </p>
              <Divider />
              <p className="font-merriweather italic text-primary/75 pt-1" style={{ fontSize:11 }}>{sdgLink}</p>
              <div className="pt-2">
                <InkButton onClick={onContinue} variant="green">{continueLabel}</InkButton>
              </div>
            </div>
          </OrnateFrame>
        </div>
      </div>
    </ParchmentPage>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onStart, onShowSDGInfo }: { onStart: () => void; onShowSDGInfo: () => void }) {
  const homeContent = (
    <div className="w-full max-w-md animate-screen-in text-center space-y-7 sm:space-y-8">
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2.5"
          style={{ border:"2px solid #5E8B4A" }}>
          <Building2 size={13} style={{ color:"#5E8B4A" }} />
          <span className="font-inter font-semibold tracking-widest text-primary uppercase" style={{ fontSize:9 }}>
            SDG 11 · Sustainable Cities &amp; Communities
          </span>
        </div>
      </div>
      <div className="flex justify-center pt-2">
        <div className="relative w-48">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 50% 65%, rgba(200,162,77,0.28) 0%, transparent 70%)" }} />
          <Portrait type="flat" silhouette className="w-full h-60 object-cover object-left relative z-10" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-cinzel font-black text-foreground leading-none"
          style={{ fontSize:"clamp(2.2rem,7vw,3.5rem)", letterSpacing:"-0.01em" }}>RIZAL</h1>
        <p className="font-im-fell italic text-foreground/65"
          style={{ fontSize:"clamp(0.9rem,2.5vw,1.1rem)" }}>
          Architect of a Sustainable Nation
        </p>
      </div>
      <Divider />
      <p className="font-merriweather italic text-foreground/58 leading-relaxed max-w-xs mx-auto"
        style={{ fontSize:13, lineHeight:"1.7" }}>
        "Shape communities through knowledge, action, and reform."
      </p>
      <div className="flex flex-col gap-4 pt-2">
        <InkButton onClick={onStart} variant="green">START GAME</InkButton>
        <InkButton onClick={onShowSDGInfo} variant="ink">Learn About SDG 11</InkButton>
      </div>
      <p className="font-cinzel text-foreground/25 tracking-[0.3em] uppercase pt-3" style={{ fontSize:9 }}>
        1861 — 1896 · LAGUNA, PHILIPPINES
      </p>
    </div>
  );

  return (
    <ParchmentPage>
      <div className="w-full h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        {homeContent}
      </div>
    </ParchmentPage>
  );
}

function SDGInfoScreen({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <ParchmentPage>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20">
        <div className="w-full max-w-3xl animate-screen-in space-y-8">
          <div className="text-center">
            <p className="font-cinzel text-foreground/38 tracking-[0.38em] uppercase" style={{ fontSize:10 }}>
              Understanding the Framework
            </p>
            <h2 className="font-cinzel font-black text-foreground mt-3 mb-2"
              style={{ fontSize:"clamp(1.3rem,4vw,1.9rem)" }}>
              SDG 11: Sustainable Cities &amp; Communities
            </h2>
          </div>

          <OrnateFrame>
            <div className="space-y-6 md:space-y-7">
              <div>
                <p className="font-cinzel font-bold text-foreground mb-3" style={{ fontSize:13, color:"#5E8B4A" }}>
                  What is SDG 11?
                </p>
                <p className="font-merriweather text-foreground/78 leading-relaxed" style={{ fontSize:12, lineHeight:"1.7" }}>
                  Sustainable Development Goal 11 calls for making cities and human settlements inclusive, safe, resilient, and sustainable by 2030. It addresses how communities should be built — not just with infrastructure, but with equity, participation, cultural heritage, and environmental responsibility.
                </p>
              </div>

              <Divider />

              <div className="space-y-4">
                <p className="font-cinzel font-bold text-foreground" style={{ fontSize:13, color:"#5E8B4A" }}>
                  Key Targets of SDG 11:
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span style={{ color:"#5E8B4A", fontSize:11, fontWeight:"bold" }}>11.1</span>
                    <p className="font-merriweather text-foreground/75" style={{ fontSize:12 }}>
                      <strong>Adequate Housing &amp; Services</strong> — Safe, adequate, and affordable housing and basic services accessible to all.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color:"#5E8B4A", fontSize:11, fontWeight:"bold" }}>11.3</span>
                    <p className="font-merriweather text-foreground/75" style={{ fontSize:12 }}>
                      <strong>Inclusive Participation</strong> — Participatory, integrated human settlement planning with full civic engagement.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color:"#5E8B4A", fontSize:11, fontWeight:"bold" }}>11.4</span>
                    <p className="font-merriweather text-foreground/75" style={{ fontSize:12 }}>
                      <strong>Cultural Heritage</strong> — Protect and safeguard cultural and natural heritage for future generations.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <span style={{ color:"#5E8B4A", fontSize:11, fontWeight:"bold" }}>11.6</span>
                    <p className="font-merriweather text-foreground/75" style={{ fontSize:12 }}>
                      <strong>Environmental Impact</strong> — Reduce environmental impact and ensure clean water, waste management, and green spaces.
                    </p>
                  </li>
                </ul>
              </div>

              <Divider />

              <div>
                <p className="font-cinzel font-bold text-foreground mb-3" style={{ fontSize:13, color:"#5E8B4A" }}>
                  Why José Rizal?
                </p>
                <p className="font-merriweather text-foreground/78 leading-relaxed" style={{ fontSize:12, lineHeight:"1.7" }}>
                  More than a century before the UN adopted SDG 11, José Rizal was already building, writing, and organizing for these principles. Through his novels, his civic organizations, his infrastructure projects in Dapitan, and his unwavering commitment to Filipino self-governance and cultural identity, Rizal demonstrated that truly sustainable communities are built on education, justice, participation, and heritage — the exact pillars of SDG 11.
                </p>
              </div>
            </div>
          </OrnateFrame>

          <div className="text-center flex flex-col sm:flex-row gap-4 justify-center mt-2 pt-2">
            <InkButton onClick={onBack} variant="ink">← Back to Home</InkButton>
            <InkButton onClick={onStart} variant="green">Begin Game →</InkButton>
          </div>
        </div>
      </div>
    </ParchmentPage>
  );
}

// ─── Chapter Select ───────────────────────────────────────────────────────────

function ChapterSelectScreen({ unlocked, completed, scores, onSelect }: {
  unlocked: number; completed: number[]; scores: Scores;
  onSelect: (ch: number) => void;
}) {
  const chapters = [
    { n:1, title:"The Awakening",   sub:"Education & Awareness",      Icon:BookOpen, color:"#C8A24D" },
    { n:2, title:"Dapitan Builder", sub:"Sustainable Infrastructure", Icon:Hammer,   color:"#5E8B4A" },
    { n:3, title:"The Reformer",    sub:"Civic Leadership & Justice", Icon:Scale,    color:"#9C3D3D" },
  ];
  return (
    <ParchmentPage>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-14 sm:py-16">
        <div className="w-full max-w-2xl animate-screen-in">
          <OrnateFrame>
            <div className="text-center mb-6">
              <p className="font-cinzel text-foreground/38 tracking-[0.38em] uppercase" style={{ fontSize:10 }}>
                Choose Your Chapter
              </p>
              <h2 className="font-cinzel font-black text-foreground mt-2 mb-4"
                style={{ fontSize:"clamp(1.3rem,4vw,1.9rem)" }}>The Path of Rizal</h2>
              <div className="flex justify-center gap-6 mt-3 font-inter font-semibold text-xs">
                <span style={{ color:"#5E8B4A" }}>AWR {scores.awareness}</span>
                <span style={{ color:"#C8A24D" }}>SUS {scores.sustainability}</span>
                <span style={{ color:"#9C3D3D" }}>JUS {scores.justice}</span>
              </div>
            </div>
            <Divider />
            <div className="space-y-4 my-6">
              {chapters.map(({ n, title, sub, Icon, color }) => {
                const isUnlocked = n <= unlocked;
                const isDone     = completed.includes(n);
                return (
                  <button key={n}
                    onClick={() => isUnlocked && !isDone && onSelect(n)}
                    disabled={!isUnlocked || isDone}
                    className="w-full text-left p-5 transition-all duration-300 group"
                    style={{
                      border:`2px solid ${isUnlocked && !isDone ? color : "rgba(43,30,24,0.18)"}`,
                      background: isDone ? `${color}08` : isUnlocked ? "rgba(248,241,229,0.5)" : "rgba(43,30,24,0.03)",
                      opacity: isUnlocked ? 1 : 0.42,
                    }}>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center"
                        style={{ border:`2px solid ${color}33`, background:`${color}12` }}>
                        {isDone
                          ? <CheckCircle2 size={20} style={{ color }} />
                          : isUnlocked
                            ? <Icon size={20} style={{ color }} />
                            : <Lock size={16} style={{ color:"rgba(43,30,24,0.3)" }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-cinzel font-bold text-foreground" style={{ fontSize:13 }}>
                            Chapter {n} — {title}
                          </span>
                          {isDone && <span className="font-inter font-semibold px-2 py-0.5 text-[9px]"
                            style={{ background:"#5E8B4A22", color:"#5E8B4A", border:"1px solid #5E8B4A55" }}>COMPLETE</span>}
                          {!isUnlocked && <span className="font-inter font-semibold px-2 py-0.5 text-[9px]"
                            style={{ background:"rgba(43,30,24,0.08)", color:"rgba(43,30,24,0.38)", border:"1px solid rgba(43,30,24,0.15)" }}>LOCKED</span>}
                        </div>
                        <p className="font-merriweather text-foreground/50 mt-1" style={{ fontSize:11 }}>{sub} · 5 Scenarios</p>
                      </div>
                      {isUnlocked && !isDone && (
                        <span className="font-inter text-foreground/30 group-hover:text-foreground/65 transition-colors text-xl">→</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <Divider />
            <p className="text-center font-merriweather italic text-foreground/38 mt-6" style={{ fontSize:11 }}>
              Complete each chapter to unlock the next stage of Rizal's legacy.
            </p>
          </OrnateFrame>
        </div>
      </div>
    </ParchmentPage>
  );
}

// ─── Final Score ──────────────────────────────────────────────────────────────

function FinalScoreScreen({ scores, onViewAnalysis }: { scores: Scores; onViewAnalysis?: () => void }) {
  const maxA = 50, maxS = 50, maxJ = 55; // approximate maxes across all scenarios
  const total = scores.awareness + scores.sustainability + scores.justice;
  const maxTotal = maxA + maxS + maxJ;
  const pct = Math.min(100, Math.round((total / maxTotal) * 100));
  const perfect = pct >= 80;
  return (
    <ParchmentPage>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-14 sm:py-18">
        <div className="w-full max-w-md animate-screen-in">
          <OrnateFrame>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-40">
                  <Portrait type="flat" className="w-full h-48 object-cover object-left" />
                </div>
              </div>
              <div>
                <p className="font-cinzel text-foreground/35 tracking-[0.38em] uppercase" style={{ fontSize:10 }}>Final Score</p>
                <h1 className="font-cinzel font-black text-foreground mt-2"
                  style={{ fontSize:"clamp(1.4rem,4.5vw,2rem)" }}>
                  {perfect ? "Rizal's Sustainable Legacy Achieved" : "Your Legacy Endures"}
                </h1>
              </div>
              <div className="space-y-4 text-left">
                <ScoreBarAnimated label="Awareness"      value={scores.awareness}      max={maxA} color="#5E8B4A" />
                <ScoreBarAnimated label="Sustainability"  value={scores.sustainability}  max={maxS} color="#C8A24D" />
                <ScoreBarAnimated label="Justice"         value={scores.justice}         max={maxJ} color="#9C3D3D" />
              </div>
              <div className="py-5" style={{ border:"2px solid rgba(43,30,24,0.22)", background:"rgba(43,30,24,0.03)" }}>
                <p className="font-inter font-black text-foreground" style={{ fontSize:48, lineHeight:1 }}>{pct}%</p>
                <p className="font-cinzel text-foreground/35 tracking-widest uppercase mt-2" style={{ fontSize:9 }}>
                  Legacy Score · {total} pts
                </p>
              </div>
              {perfect && (
                <div className="flex items-center justify-center gap-3 py-3 animate-snap-in"
                  style={{ background:"rgba(94,139,74,0.1)", border:"2px solid #5E8B4A" }}>
                  <CheckCircle2 size={20} style={{ color:"#5E8B4A" }} />
                  <div className="text-left">
                    <p className="font-inter font-bold" style={{ fontSize:13, color:"#5E8B4A" }}>SDG 11 COMPLETE</p>
                    <p className="font-cinzel tracking-wider uppercase" style={{ fontSize:9, color:"#5E8B4A88" }}>
                      Sustainable Cities &amp; Communities
                    </p>
                  </div>
                </div>
              )}
              <Divider />
              <div className="flex flex-col gap-3 pt-2">
                {onViewAnalysis && (
                  <InkButton onClick={onViewAnalysis} variant="green">View Analysis &amp; References →</InkButton>
                )}
                <InkButton onClick={() => window.location.reload()} variant="ink">← Return to Start</InkButton>
              </div>
              <div className="text-center space-y-2 mt-4">
                <p className="font-im-fell italic text-foreground/40" style={{ fontSize:12 }}>
                  "He who does not know how to look back at where he came from will never reach his destination."
                </p>
                <p className="font-cinzel text-foreground/26 tracking-widest uppercase" style={{ fontSize:9 }}>— José Rizal</p>
              </div>
            </div>
          </OrnateFrame>
        </div>
      </div>
    </ParchmentPage>
  );
}

// ─── Analysis & References Screen ─────────────────────────────────────────────

function AnalysisScreen({ scores, onReturn }: { scores: Scores; onReturn: () => void }) {
  return (
    <ParchmentPage>
      <div className="min-h-screen px-4 py-16 sm:py-20">
        <div className="max-w-3xl mx-auto animate-screen-in space-y-8">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-cinzel text-foreground/35 tracking-[0.38em] uppercase" style={{ fontSize:10 }}>
              Final Analysis
            </p>
            <h1 className="font-cinzel font-black text-foreground mt-3"
              style={{ fontSize:"clamp(1.4rem,4vw,2rem)" }}>
              José Rizal &amp; SDG 11: A Century of Foresight
            </h1>
          </div>

          {/* Main Analysis */}
          <OrnateFrame>
            <div className="space-y-7">
              <div className="pt-1">
                <h2 className="font-cinzel font-bold text-foreground mb-4" style={{ fontSize:14, color:"#5E8B4A" }}>
                  Written Analysis: The Connection Between Rizal &amp; SDG 11
                </h2>
                
                <div className="space-y-5 font-merriweather text-foreground/78" style={{ fontSize:12, lineHeight:"1.75" }}>
                  <p>
                    José Rizal's life and work embody the fundamental principles of Sustainable Development Goal 11 over a century before the United Nations articulated them. Though Rizal died in 1896, decades before the term "sustainable development" entered global discourse, his actions, writings, and organizational efforts anticipated every major pillar of SDG 11.
                  </p>

                  <p>
                    <strong style={{ color:"#2B1E18" }}>Education as the Foundation (SDG 11.1, 11.3):</strong> Rizal understood that inclusive, sustainable communities cannot exist without universal education. His free school in Dapitan served children regardless of class, directly embodying SDG 11.3's call for inclusive participation in civic life. His novels, written in Spanish and Tagalog, were tools of popular education — reaching audiences across the archipelago and awakening them to social injustice. Rizal's belief that "the youth are the hope of the nation" reflects the precise conviction underlying SDG 11: that knowledgeable, engaged citizens are the foundation of sustainable settlements.
                  </p>

                  <p>
                    <strong style={{ color:"#2B1E18" }}>Infrastructure &amp; Environmental Sustainability (SDG 11.6, 11.7):</strong> During his exile in Dapitan, Rizal didn't theorize — he built. He designed and constructed a water system using bamboo and clay pipes, bringing clean water to every family in the town. He introduced scientific farming techniques and crop rotation to ensure food security. He mapped the town systematically to optimize public access and sanitation. These concrete projects directly address SDG 11.6 and 11.7: reducing environmental impact and ensuring inclusive access to green, productive spaces.
                  </p>

                  <p>
                    <strong style={{ color:"#2B1E18" }}>Participatory Governance &amp; Civic Participation (SDG 11.3):</strong> La Liga Filipina, Rizal's civic organization, proposed exactly what SDG 11.3 demands: "participatory and inclusive human settlement planning and management." The Liga called for mutual aid, community self-governance, and collective decision-making — revolutionary concepts in a colonial context. Rizal believed that sustainable communities must be governed by their own people, with full participation of all residents, not imposed from above by distant authorities.
                  </p>

                  <p>
                    <strong style={{ color:"#2B1E18" }}>Cultural Heritage &amp; Identity (SDG 11.4):</strong> Rizal's annotation of Antonio de Morga's Sucesos was a deliberate act of cultural preservation. By documenting pre-colonial Filipino civilization, Rizal demonstrated that communities must know and honor their heritage to build their future. This is SDG 11.4 in practice: "Strengthen efforts to protect and safeguard the world's cultural and natural heritage." Rizal believed that a people without historical consciousness cannot be truly free, and cannot build communities grounded in authentic identity.
                  </p>

                  <p>
                    <strong style={{ color:"#2B1E18" }}>Justice as the Prerequisite (SDG 11 Overall):</strong> Perhaps most importantly, Rizal understood that sustainability cannot be achieved without justice. His novels exposed how colonial systems degraded community life, human dignity, and possibility. El Filibusterismo warned that communities denied hope and recourse will fracture into conflict — making sustainable development impossible. Rizal's willingness to risk his life for truth and transparency speaks to SDG 11.3's requirement for "accountable and inclusive institutions" — not just infrastructure, but systems built on justice.
                  </p>

                  <p>
                    Rizal's entire life was a lived argument for SDG 11: that truly sustainable cities and communities are built through education, environmental responsibility, participatory governance, cultural preservation, and justice — the very principles the UN codified 115 years after his death. He teaches us that sustainable development is not a technical problem solved by engineers and planners alone, but a moral and political challenge requiring the full participation of educated, justice-seeking citizens committed to their collective flourishing.
                  </p>
                </div>
              </div>

              <Divider />

              {/* References */}
              <div className="pt-2">
                <h2 className="font-cinzel font-bold text-foreground mb-4" style={{ fontSize:14, color:"#5E8B4A" }}>
                  References (APA 7th Edition)
                </h2>
                
                <div className="space-y-3 font-merriweather text-foreground/70" style={{ fontSize:11, lineHeight:"1.75" }}>
                  <p>
                    Bantug, J. P. (1946). <em>A short history of medicine in the Philippines.</em> Colegio Médico Farmacéutico.
                  </p>

                  <p>
                    Craig, A. (1913). <em>Lineage, life and labors of José Rizal.</em> Philippine Education Company.
                  </p>

                  <p>
                    Guerrero, L. M. (1963). <em>The first Filipino: A biography of José Rizal.</em> National Heroes Commission.
                  </p>

                  <p>
                    Ocampo, A. R. (2000). <em>Rizal without the overcoat.</em> Anvil Publishing.
                  </p>

                  <p>
                    Rizal, J. P. (1887). <em>Noli me tangere</em> (C. Derbyshire, Trans.). Philippine Education Company. (Original work published 1887)
                  </p>

                  <p>
                    Rizal, J. P. (1891). <em>El filibusterismo</em> (C. Derbyshire, Trans.). Philippine Education Company. (Original work published 1891)
                  </p>

                  <p>
                    Rizal, J. P. (1896). <em>Mi último adiós.</em> National Historical Commission of the Philippines.
                  </p>

                  <p>
                    Rizal, J. P. (1889). <em>Writings of José Rizal.</em> National Historical Commission of the Philippines.
                  </p>

                  <p>
                    United Nations. (2015). <em>Transforming our world: The 2030 agenda for sustainable development</em> (A/RES/70/1). https://sdgs.un.org/goals/goal11
                  </p>

                  <p>
                    Zaide, G. F. (1984). <em>José Rizal: Life, works and writings.</em> National Book Store.
                  </p>
                </div>
              </div>

              <Divider />

              {/* Summary Stats */}
              <div className="bg-gradient-to-r from-[#5E8B4A]/10 to-[#C8A24D]/10 p-6 rounded mt-3"
                style={{ border:"1px solid rgba(94,139,74,0.25)" }}>
                <p className="font-cinzel text-foreground/40 tracking-widest uppercase mb-4" style={{ fontSize:9 }}>
                  Your Legacy Score
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="font-inter font-black" style={{ fontSize:24, color:"#5E8B4A" }}>
                      {scores.awareness}
                    </p>
                    <p className="font-cinzel text-foreground/50 uppercase mt-1" style={{ fontSize:8 }}>Awareness</p>
                  </div>
                  <div className="text-center">
                    <p className="font-inter font-black" style={{ fontSize:24, color:"#C8A24D" }}>
                      {scores.sustainability}
                    </p>
                    <p className="font-cinzel text-foreground/50 uppercase mt-1" style={{ fontSize:8 }}>Sustainability</p>
                  </div>
                  <div className="text-center">
                    <p className="font-inter font-black" style={{ fontSize:24, color:"#9C3D3D" }}>
                      {scores.justice}
                    </p>
                    <p className="font-cinzel text-foreground/50 uppercase mt-1" style={{ fontSize:8 }}>Justice</p>
                  </div>
                </div>
              </div>
            </div>
          </OrnateFrame>

          {/* Footer */}
          <div className="text-center flex justify-center mt-3">
            <InkButton onClick={onReturn} variant="green">← Return to Menu</InkButton>
          </div>

          <div className="text-center space-y-3 mt-8 pt-4">
            <p className="text-center font-im-fell italic text-foreground/40" style={{ fontSize:12 }}>
              "The man who does not love his own language is worse than an animal and smells of fish."
            </p>
            <p className="text-center font-cinzel text-foreground/26 tracking-widest uppercase" style={{ fontSize:9 }}>
              — José Rizal, Letter to the Filipinas
            </p>
          </div>
        </div>
      </div>
    </ParchmentPage>
  );
}

interface Ch1Puzzle {
  city: string;
  location: string;
  storyText: string;
  speech: string;
  sentence: string;
  correct: string;
  options: string[];
  wrongMsg: string;
  successMsg: string;
  sdgNote: string;
  citation: string;
  awarenessPoints: number;
}

const CH1_PUZZLES: Ch1Puzzle[] = [
  {
    city: "Madrid",
    location: "Madrid, Spain — 1884 · The Writing Desk",
    storyText: "You are José Rizal, a young Filipino scholar studying medicine and philosophy in Madrid. From across the sea you have witnessed the suffering of your people under colonial rule. You lift your pen. One sentence can carry the weight of a generation.",
    speech: "My pen shall be the sword of my people.",
    sentence: "Ang kabataan ang ___ ng bayan.",
    correct: "pag-asa",
    options: ["pag-asa", "suliranin", "hadlang"],
    wrongMsg: "Rizal's vision was hope, not despair. Look again.",
    successMsg: "Rizal's most enduring declaration — the youth carry every nation's future. Education is the first foundation of SDG 11.",
    sdgNote: "SDG 11.3 — Inclusive communities begin with an educated, hopeful citizenry.",
    citation: "Rizal, J. P. (1896). Mi último adiós. National Historical Commission of the Philippines.",
    awarenessPoints: 20,
  },
  {
    city: "Berlin",
    location: "Berlin, Germany — 1887 · Noli Me Tangere",
    storyText: "You publish Noli Me Tangere under your own name — a dangerous act. The colonial government orders copies burned. Yet the novel spreads across the archipelago like seeds in the wind, igniting a fire of awareness that cannot be extinguished.",
    speech: "Let these pages carry what my voice cannot reach.",
    sentence: "He who does not know how to look back...will never reach his ___.",
    correct: "destination",
    options: ["destination", "failure", "ruin"],
    wrongMsg: "The path forward requires knowing where you came from. Think again.",
    successMsg: "Cultural memory is the compass of sustainable communities — Rizal understood that heritage grounds every vision of the future.",
    sdgNote: "SDG 11.4 — Protect cultural heritage as the foundation of community identity.",
    citation: "Guerrero, L. M. (1963). The first Filipino: A biography of José Rizal. National Heroes Commission.",
    awarenessPoints: 20,
  },
  {
    city: "Paris",
    location: "Paris, France — 1890 · Annotating History",
    storyText: "You annotate Antonio de Morga's Sucesos de las Islas Filipinas — proving that Filipinos had a rich, sophisticated civilization long before colonization. History, you believe, is the community's compass. A people who know their past can build their future.",
    speech: "They erased our past so we would accept their future.",
    sentence: "He who does not love his own ___ can never truly love his nation.",
    correct: "language",
    options: ["language", "wealth", "comfort"],
    wrongMsg: "Rizal believed identity begins with the tongue. Think of what he fought to preserve.",
    successMsg: "Language is living heritage — the very thread of cultural continuity Rizal fought to protect, and what SDG 11.4 demands we safeguard.",
    sdgNote: "SDG 11.4 — Linguistic and cultural heritage must be preserved for future generations.",
    citation: "Craig, A. (1913). Lineage, life and labors of José Rizal. Philippine Education Company.",
    awarenessPoints: 20,
  },
  {
    city: "Ghent",
    location: "Ghent, Belgium — 1891 · El Filibusterismo",
    storyText: "El Filibusterismo is complete — darker and more urgent than Noli. This second novel depicts what happens when an entire people are denied hope, reform, and dignity. It is your warning to the world: a community denied education becomes a powder keg.",
    speech: "A people kept ignorant is a people kept in chains.",
    sentence: "Every child who receives a good ___ is one less slave tomorrow.",
    correct: "education",
    options: ["education", "punishment", "burden"],
    wrongMsg: "Rizal believed knowledge unlocks every cage. Think of what he later built in Dapitan.",
    successMsg: "Rizal's free school in Dapitan embodied this principle — SDG 11.3 begins with ensuring every member of a community can learn and participate.",
    sdgNote: "SDG 11.3 — Inclusive, participatory communities are built through universal access to education.",
    citation: "Zaide, G. F. (1984). José Rizal: Life, works and writings. National Book Store.",
    awarenessPoints: 20,
  },
  {
    city: "Manila",
    location: "Manila — July 3, 1892 · La Liga Filipina",
    storyText: "You establish La Liga Filipina — a civic organization for mutual aid and community self-sufficiency. Three days later, you are arrested. The organization is disbanded. But the idea it planted cannot be imprisoned. Ideas, once written, outlive every attempt to silence them.",
    speech: "I have planted seeds I will not live to harvest.",
    sentence: "A life not devoted to a great ___ is a useless life.",
    correct: "ideal",
    options: ["ideal", "pleasure", "silence"],
    wrongMsg: "Rizal gave everything to a vision larger than himself. What drives such sacrifice?",
    successMsg: "Rizal's entire life was consecrated to a single ideal: a free, educated, self-governing Filipino people — the very foundation of SDG 11.",
    sdgNote: "SDG 11 — Sustainable communities require citizens who commit to justice, education, and collective flourishing.",
    citation: "United Nations. (2015). Transforming our world: The 2030 agenda for sustainable development (A/RES/70/1). https://sdgs.un.org/goals/goal11",
    awarenessPoints: 20,
  },
];

function Chapter1Screen({ scores, onComplete }: {
  scores: Scores;
  onComplete: (earned: Scores) => void;
}) {
  type C1Frame = "intro" | "puzzle" | "success" | "complete";
  const [frame,       setFrame]       = useState<C1Frame>("intro");
  const [puzzleIdx,   setPuzzleIdx]   = useState(0);
  const [wrongWord,   setWrongWord]   = useState<string | null>(null);
  const [snappedWord, setSnappedWord] = useState<string | null>(null);
  const [awarePts,    setAwarePts]    = useState(0);
  const meterRef = useRef<HTMLDivElement>(null);

  const puzzle = CH1_PUZZLES[puzzleIdx];
  const [before, after] = puzzle.sentence.split("___");

  const handleWordClick = (word: string) => {
    if (snappedWord) return;
    if (word === puzzle.correct) {
      setSnappedWord(word);
      setWrongWord(null);
      setTimeout(() => {
        setAwarePts(p => p + puzzle.awarenessPoints);
        setFrame("success");
      }, 750);
    } else {
      setWrongWord(word);
      setTimeout(() => setWrongWord(null), 750);
    }
  };

  const handleContinue = () => {
    const next = puzzleIdx + 1;
    if (next < CH1_PUZZLES.length) {
      setPuzzleIdx(next);
      setSnappedWord(null);
      setWrongWord(null);
      setFrame("puzzle");
    } else {
      setFrame("complete");
    }
  };

  useEffect(() => {
    if (frame !== "complete" || !meterRef.current) return;
    meterRef.current.style.setProperty("--meter-target", "100%");
    meterRef.current.style.animation = "none";
    void meterRef.current.offsetWidth;
    meterRef.current.style.animation = "meterGrow 1.6s ease-out 0.5s forwards";
  }, [frame]);

  const bookBase: React.CSSProperties = {
    background: "linear-gradient(105deg, #E5D4AF 0%, #F2E8CE 35%, #F7EEDF 50%, #F2E8CE 65%, #E5D4AF 100%)",
    border: "2px solid rgba(90,62,25,0.65)",
    borderBottom: "5px solid rgba(70,45,18,0.75)",
    position: "relative",
    padding: "28px 32px 36px",
  };

  const ruledLines = Array.from({ length: 9 }, (_, i) => (
    <div key={i} className="absolute left-8 right-8 pointer-events-none"
      style={{ top: 52 + i * 26, height: 1, background: "rgba(140,95,35,0.15)" }} />
  ));

  const spineBar = (
    <div className="absolute inset-y-0 left-1/2 pointer-events-none"
      style={{ width: 2, transform: "translateX(-50%)",
        background: "linear-gradient(to bottom, transparent 5%, rgba(50,30,10,0.3) 20%, rgba(50,30,10,0.4) 50%, rgba(50,30,10,0.3) 80%, transparent 95%)" }} />
  );

  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col"
      style={{ background: frame === "complete" ? "#1A1108" : "#0c0700" }}>

      {/* ── Background atmosphere ── */}
      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: NOISE, backgroundRepeat: "repeat", opacity: 0.05 }} />
      {/* Candle glow — origin matches candle at top-right ~92% 5% */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 92% 5%, rgba(218,130,26,0.62) 0%, rgba(165,76,10,0.26) 25%, transparent 55%)" }} />
      {/* Warm light pooling on the desk below the candle */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 85% 68%, rgba(100,50,8,0.22) 0%, transparent 36%)" }} />
      {/* Desk surface warmth — lower portion of screen warmer */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "35%", background: "linear-gradient(to top, rgba(48,22,5,0.28) 0%, transparent 100%)" }} />
      {/* Edge vignette — corners dark, center clear */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 46%, transparent 32%, rgba(0,0,0,0.72) 100%)" }} />

      {/* ── Desk scene elements ── */}

      {/* Paper stack — back layer, most rotated */}
      <div className="absolute pointer-events-none"
        style={{ bottom: "22%", left: "1%", width: 108, height: 148,
          background: "linear-gradient(158deg, #E5D5A5 0%, #D8C490 100%)",
          border: "1px solid rgba(138,98,38,0.4)",
          transform: "rotate(-15deg)",
          boxShadow: "5px 7px 24px rgba(0,0,0,0.58)", opacity: 0.52 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ position:"absolute", left:10, right:10, top:18+i*15, height:1, background:"rgba(125,82,22,0.22)" }} />
        ))}
      </div>
      {/* Paper — middle layer */}
      <div className="absolute pointer-events-none"
        style={{ bottom: "20%", left: "4%", width: 104, height: 144,
          background: "linear-gradient(158deg, #EAE0B5 0%, #E0D09E 100%)",
          border: "1px solid rgba(138,98,38,0.35)",
          transform: "rotate(-8deg)",
          boxShadow: "3px 6px 18px rgba(0,0,0,0.5)", opacity: 0.65 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ position:"absolute", left:10, right:10, top:20+i*16, height:1, background:"rgba(125,82,22,0.2)" }} />
        ))}
      </div>
      {/* Paper — front layer, active page */}
      <div className="absolute pointer-events-none"
        style={{ bottom: "18%", left: "8%", width: 100, height: 140,
          background: "linear-gradient(158deg, #F0E8C5 0%, #E8D8A8 100%)",
          border: "1px solid rgba(138,98,38,0.45)",
          transform: "rotate(-2deg)",
          boxShadow: "2px 4px 14px rgba(0,0,0,0.45)", opacity: 0.78 }}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ position:"absolute", left:10, right:10, top:20+i*16, height:1, background:"rgba(125,82,22,0.22)" }} />
        ))}
      </div>

      {/* Quill — resting diagonally, nib toward the ink bottle */}
      <div className="absolute pointer-events-none" style={{ bottom: "34%", left: "-2%", width: 165, transform: "rotate(-28deg)", transformOrigin: "right center" }}>
        {/* Feather — upper barbs */}
        <div style={{ position:"absolute", right:25, top:-20, width:85, height:26,
          background: "linear-gradient(to bottom right, transparent 10%, rgba(222,198,138,0.75) 35%, rgba(215,190,125,0.5) 65%, transparent 90%)",
          borderRadius: "55% 45% 0 0" }} />
        {/* Feather — lower barbs */}
        <div style={{ position:"absolute", right:18, top:-14, width:72, height:20,
          background: "linear-gradient(to bottom left, transparent 10%, rgba(205,178,115,0.6) 38%, rgba(198,168,105,0.35) 68%, transparent 92%)",
          borderRadius: "55% 45% 0 0" }} />
        {/* Shaft */}
        <div style={{ position:"absolute", left:0, right:0, top:1, bottom:1,
          background: "linear-gradient(to right, transparent, rgba(212,186,120,0.78) 18%, rgba(196,168,105,0.58) 88%, transparent)",
          borderRadius: 4 }} />
        {/* Nib tip */}
        <div style={{ position:"absolute", left:1, top:-3,
          width:0, height:0,
          borderTop: "5px solid transparent", borderBottom: "5px solid transparent",
          borderRight: "15px solid rgba(175,138,62,0.7)" }} />
      </div>

      {/* Ink bottle — at same desk level as papers, right of quill nib */}
      <div className="absolute pointer-events-none flex flex-col items-center" style={{ bottom: "18%", left: "19%" }}>
        {/* Cork */}
        <div style={{ width:10, height:8, background:"#3C2410", borderRadius:"2px 2px 0 0", boxShadow:"0 1px 4px rgba(0,0,0,0.5)" }} />
        {/* Neck */}
        <div style={{ width:14, height:11, background:"rgba(6,3,1,0.94)", border:"1px solid rgba(62,40,10,0.55)" }} />
        {/* Body */}
        <div style={{ position:"relative", width:30, height:36,
          background:"linear-gradient(to right, rgba(4,2,1,0.97), rgba(14,8,3,0.94), rgba(4,2,1,0.97))",
          border:"1px solid rgba(68,44,10,0.68)", borderRadius:"0 0 5px 5px",
          boxShadow:"inset 0 0 10px rgba(0,0,0,0.9), 2px 4px 14px rgba(0,0,0,0.65)" }}>
          {/* Ink level */}
          <div style={{ position:"absolute", bottom:6, left:5, right:5, height:10, background:"rgba(60,28,5,0.82)", borderRadius:2 }} />
          {/* Label */}
          <div style={{ position:"absolute", top:8, left:4, right:4, height:14, border:"1px solid rgba(105,72,22,0.38)", background:"rgba(148,108,40,0.07)" }} />
          {/* Glass highlight */}
          <div style={{ position:"absolute", top:3, left:5, width:3, height:16, background:"rgba(255,255,255,0.045)", borderRadius:2 }} />
        </div>
      </div>

      {/* Candle — top right, the room's only light source */}
      <div className="absolute pointer-events-none" style={{ top: "3%", right: "5.5%" }}>
        <div className="flex flex-col items-center" style={{ position:"relative" }}>
          {/* Ambient halo behind flame */}
          <div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
            width:48, height:48,
            background:"radial-gradient(circle, rgba(255,200,50,0.42) 0%, transparent 70%)",
            borderRadius:"50%", zIndex:0 }} />
          {/* Flame */}
          <div className="animate-candle-flicker" style={{ position:"relative", zIndex:1,
            width:12, height:22,
            background:"radial-gradient(ellipse at 50% 80%, #fffbe0 0%, #FFD200 28%, #FF8500 64%, rgba(255,55,0,0.22) 100%)",
            borderRadius:"50% 50% 35% 35% / 65% 65% 35% 35%",
            boxShadow:"0 0 16px rgba(255,182,42,0.96), 0 0 46px rgba(255,112,0,0.52), 0 0 90px rgba(200,88,0,0.22)" }} />
          {/* Wick */}
          <div style={{ width:2, height:7, background:"#2c1706", marginTop:-1 }} />
          {/* Wax — with a drip for realism */}
          <div style={{ position:"relative", width:20, height:84,
            background:"linear-gradient(to right, #C6A66A, #E8D28A, #C6A66A)",
            border:"1px solid rgba(138,98,38,0.5)",
            boxShadow:"inset 2px 0 8px rgba(0,0,0,0.2), 1px 2px 8px rgba(0,0,0,0.4)" }}>
            {/* Wax drip */}
            <div style={{ position:"absolute", top:10, right:-3, width:6, height:20,
              background:"rgba(205,172,90,0.72)", borderRadius:"0 0 5px 5px" }} />
          </div>
          {/* Holder cup */}
          <div style={{ width:30, height:10,
            background:"linear-gradient(to right, #563D1E, #96683A, #563D1E)",
            borderRadius:"0 0 4px 4px", boxShadow:"0 2px 6px rgba(0,0,0,0.55)" }} />
          {/* Holder dish */}
          <div style={{ width:38, height:6,
            background:"linear-gradient(to right, #483015, #845830, #483015)",
            borderRadius:3, boxShadow:"0 2px 8px rgba(0,0,0,0.6)" }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-10 overflow-y-auto">

        {/* INTRO */}
        {frame === "intro" && (
          <div className="w-full max-w-md text-center space-y-5 animate-screen-in">
            <p className="font-cinzel tracking-[0.55em] uppercase"
              style={{ fontSize: 10, color: "rgba(200,162,77,0.5)" }}>Chapter I</p>

            <div className="relative p-9"
              style={{ background: "rgba(16,9,3,0.87)", border: "2px solid rgba(200,162,77,0.42)" }}>
              {["top-[4px] left-[4px]","top-[4px] right-[4px]","bottom-[4px] left-[4px]","bottom-[4px] right-[4px]"].map((pos,i) => (
                <span key={i} className={`absolute ${pos}`}
                  style={{ fontSize: 9, color: "rgba(200,162,77,0.5)", lineHeight: 1 }}>◆</span>
              ))}
              <div className="absolute inset-[10px] pointer-events-none"
                style={{ border: "1px solid rgba(200,162,77,0.13)" }} />
              <h1 className="font-cinzel font-black"
                style={{ fontSize: "clamp(1.9rem,6vw,3rem)", color: "#F0E6C8", letterSpacing: "0.07em", lineHeight: 1.1 }}>
                THE<br />AWAKENING
              </h1>
              <div className="flex items-center gap-3 my-4">
                <div style={{ flex: 1, borderTop: "1px solid rgba(200,162,77,0.2)" }} />
                <span className="font-cinzel tracking-[0.3em]" style={{ fontSize: 9, color: "rgba(200,162,77,0.35)" }}>✦</span>
                <div style={{ flex: 1, borderTop: "1px solid rgba(200,162,77,0.2)" }} />
              </div>
              <p className="font-im-fell italic"
                style={{ fontSize: "clamp(0.88rem,2.2vw,1rem)", color: "rgba(240,230,200,0.6)", lineHeight: 1.8 }}>
                &ldquo;Words can build nations<br />before stones ever do.&rdquo;
              </p>
            </div>

            <p className="font-merriweather leading-relaxed"
              style={{ fontSize: 12, color: "rgba(240,230,200,0.35)", maxWidth: 340, margin: "0 auto" }}>
              Madrid, 1884. A young Filipino scholar sits at his desk. The candle burns low. History waits on the next word.
            </p>
            <div className="pt-1">
              <InkButton onClick={() => setFrame("puzzle")} variant="gold">Begin Writing</InkButton>
            </div>
          </div>
        )}

        {/* PUZZLE */}
        {frame === "puzzle" && (
          <div className="w-full max-w-xl animate-screen-in">

            {/* ── Journey progress timeline ── */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <p className="font-cinzel tracking-[0.35em] uppercase"
                  style={{ fontSize: 9, color: "rgba(200,162,77,0.5)" }}>Chapter I — The Awakening</p>
                <span className="font-inter font-bold" style={{ fontSize: 10, color: "rgba(200,162,77,0.68)" }}>
                  AWR {awarePts + scores.awareness}
                </span>
              </div>
              {/* Node row */}
              <div className="flex items-center">
                {CH1_PUZZLES.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="flex-1 h-px" style={{
                        background: i <= puzzleIdx ? "#C8A24D" : "rgba(240,230,200,0.12)",
                        transition: "background 0.5s",
                      }} />
                    )}
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        background: i < puzzleIdx ? "#C8A24D" : i === puzzleIdx ? "rgba(200,162,77,0.15)" : "transparent",
                        border: i <= puzzleIdx ? "2px solid #C8A24D" : "2px solid rgba(240,230,200,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.5s",
                      }}>
                        {i < puzzleIdx
                          ? <span style={{ fontSize: 10, color: "#0d0800", fontWeight: 700 }}>✓</span>
                          : <span style={{ fontSize: 9, color: i === puzzleIdx ? "#C8A24D" : "rgba(240,230,200,0.25)", fontWeight: 600 }}>{i + 1}</span>
                        }
                      </div>
                      <span className="font-cinzel uppercase tracking-wider" style={{
                        fontSize: 7, lineHeight: 1,
                        color: i === puzzleIdx ? "#C8A24D" : i < puzzleIdx ? "rgba(200,162,77,0.45)" : "rgba(240,230,200,0.18)",
                        transition: "color 0.5s",
                      }}>{p.city}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── Story context panel ── */}
            <div className="mb-4 p-4" style={{
              background: "rgba(14,8,3,0.75)",
              border: "1px solid rgba(200,162,77,0.2)",
            }}>
              <p className="font-cinzel uppercase tracking-widest mb-2"
                style={{ fontSize: 8, color: "rgba(200,162,77,0.58)" }}>{puzzle.location}</p>
              <p className="font-merriweather leading-relaxed mb-3"
                style={{ fontSize: 11, color: "rgba(240,230,200,0.55)" }}>{puzzle.storyText}</p>
              <div className="flex items-start gap-2.5">
                <div style={{ width: 2, flexShrink: 0, alignSelf: "stretch",
                  background: "rgba(200,162,77,0.38)", borderRadius: 1 }} />
                <p className="font-im-fell italic"
                  style={{ fontSize: 12, color: "rgba(240,230,200,0.72)" }}>
                  &ldquo;{puzzle.speech}&rdquo;
                </p>
              </div>
            </div>

            {/* ── Book ── */}
            <div className={snappedWord ? "animate-book-glow" : ""}
              style={{ ...bookBase, boxShadow: snappedWord
                ? "0 0 40px rgba(200,162,77,0.52), 0 8px 32px rgba(0,0,0,0.6)"
                : "0 8px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(160,120,60,0.05)" }}>
              {ruledLines}
              {spineBar}
              <div className="relative z-10">
                <p className="font-cinzel uppercase tracking-widest text-center mb-6"
                  style={{ fontSize: 8, color: "rgba(43,30,24,0.4)" }}>Complete the Passage</p>
                <div className="font-im-fell text-center leading-loose"
                  style={{ fontSize: "clamp(1.05rem,2.8vw,1.22rem)", color: "#2B1E18" }}>
                  <span>&ldquo;{before}</span>
                  <span className="inline-flex items-end" style={{ verticalAlign: "bottom", minWidth: 92 }}>
                    {snappedWord ? (
                      <span className="font-cinzel font-bold animate-snap-in px-2 mx-0.5"
                        style={{ color: "#5E8B4A", borderBottom: "2px solid #5E8B4A" }}>
                        {snappedWord}
                      </span>
                    ) : (
                      <span style={{ display: "inline-block", minWidth: 92,
                        borderBottom: "2px dashed rgba(43,30,24,0.4)", marginBottom: 2 }} />
                    )}
                  </span>
                  <span>{after}&rdquo;</span>
                </div>
                <p className="font-cinzel text-center mt-4" style={{ fontSize: 8, color: "rgba(43,30,24,0.28)" }}>— José Rizal</p>
              </div>
            </div>

            {/* ── Word chips ── */}
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              {puzzle.options.map((word) => {
                const isWrong   = wrongWord === word;
                const isSnapped = snappedWord === word;
                return (
                  <button key={word}
                    onClick={() => handleWordClick(word)}
                    disabled={!!snappedWord}
                    className={`font-cinzel font-bold px-6 py-3 select-none transition-all duration-200
                      ${isWrong ? "animate-shake" : ""}
                      ${!snappedWord && !isWrong ? "hover:-translate-y-1 hover:shadow-xl" : ""}
                      ${isSnapped ? "opacity-0 scale-75" : ""}
                    `}
                    style={{
                      fontSize: 14,
                      background: isWrong ? "rgba(156,61,61,0.18)" : "rgba(245,237,218,0.95)",
                      color: isWrong ? "#9C3D3D" : "#2B1E18",
                      border: isWrong ? "2px solid #9C3D3D" : "2px solid rgba(43,30,24,0.42)",
                      borderRadius: 5,
                      boxShadow: "0 4px 14px rgba(0,0,0,0.32)",
                      transition: isSnapped ? "opacity 0.3s,transform 0.3s" : undefined,
                    }}>
                    {word}
                  </button>
                );
              })}
            </div>

            {/* ── Wrong feedback ── */}
            {wrongWord && (
              <div className="mt-4 text-center space-y-2 animate-slide-up">
                <p className="font-inter font-semibold" style={{ fontSize: 12, color: "#9C3D3D" }}>
                  ✕ &nbsp;{puzzle.wrongMsg}
                </p>
                <button onClick={() => setWrongWord(null)}
                  className="font-inter font-semibold text-xs tracking-[0.18em] uppercase px-5 py-2 border-2 transition-all duration-200"
                  style={{ borderColor: "#9C3D3D", color: "#9C3D3D" }}>
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUCCESS */}
        {frame === "success" && (
          <div className="w-full max-w-xl animate-screen-in">

            {/* ── Journey progress timeline ── */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <p className="font-cinzel tracking-[0.35em] uppercase"
                  style={{ fontSize: 9, color: "rgba(200,162,77,0.5)" }}>Chapter I — The Awakening</p>
                <span className="font-inter font-bold" style={{ fontSize: 10, color: "rgba(200,162,77,0.68)" }}>
                  AWR {awarePts + scores.awareness}
                </span>
              </div>
              <div className="flex items-center">
                {CH1_PUZZLES.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div className="flex-1 h-px" style={{
                        background: i <= puzzleIdx ? "#C8A24D" : "rgba(240,230,200,0.12)",
                        transition: "background 0.5s",
                      }} />
                    )}
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        background: i <= puzzleIdx ? "#C8A24D" : "transparent",
                        border: i <= puzzleIdx ? "2px solid #C8A24D" : "2px solid rgba(240,230,200,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.5s",
                      }}>
                        <span style={{ fontSize: 10, color: i <= puzzleIdx ? "#0d0800" : "rgba(240,230,200,0.25)", fontWeight: 700 }}>✓</span>
                      </div>
                      <span className="font-cinzel uppercase tracking-wider" style={{
                        fontSize: 7, lineHeight: 1,
                        color: i === puzzleIdx ? "#C8A24D" : i < puzzleIdx ? "rgba(200,162,77,0.45)" : "rgba(240,230,200,0.18)",
                      }}>{p.city}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* ── Location badge ── */}
            <div className="mb-3 px-1">
              <p className="font-cinzel uppercase tracking-widest"
                style={{ fontSize: 8, color: "rgba(200,162,77,0.45)" }}>{puzzle.location}</p>
            </div>

            {/* Glowing book */}
            <div className="animate-book-glow"
              style={{ ...bookBase, boxShadow: "0 0 40px rgba(200,162,77,0.52), 0 8px 32px rgba(0,0,0,0.6)" }}>
              {ruledLines}
              {spineBar}
              <div className="relative z-10">
                <p className="font-cinzel uppercase tracking-widest text-center mb-6"
                  style={{ fontSize: 8, color: "rgba(43,30,24,0.4)" }}>Passage Written</p>

                {/* Filled quote */}
                <div className="font-im-fell text-center leading-loose mb-5"
                  style={{ fontSize: "clamp(1.05rem,2.8vw,1.22rem)", color: "#2B1E18" }}>
                  <span>&ldquo;{before}</span>
                  <span className="font-cinzel font-bold px-2 mx-0.5"
                    style={{ color: "#5E8B4A", borderBottom: "2px solid #5E8B4A", background: "rgba(94,139,74,0.1)" }}>
                    {puzzle.correct}
                  </span>
                  <span>{after}&rdquo;</span>
                </div>
                <p className="font-cinzel text-center mb-5" style={{ fontSize: 8, color: "rgba(43,30,24,0.28)" }}>— José Rizal</p>

                <div style={{ borderTop: "1px solid rgba(43,30,24,0.15)", margin: "0 36px 18px" }} />

                {/* Score badge */}
                <div className="flex items-center gap-3 p-3 mb-4 animate-snap-in"
                  style={{ background: "rgba(94,139,74,0.1)", border: "2px solid rgba(94,139,74,0.4)" }}>
                  <div style={{ width: 34, height: 34, background: "#5E8B4A", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 17, fontWeight: "bold" }}>✓</span>
                  </div>
                  <div>
                    <p className="font-inter font-bold" style={{ fontSize: 11, color: "#5E8B4A" }}>Correct!</p>
                    <p className="font-inter font-black" style={{ fontSize: 20, color: "#C8A24D", lineHeight: 1.1 }}>
                      +{puzzle.awarenessPoints} Awareness
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <p className="font-merriweather italic leading-relaxed mb-3"
                  style={{ fontSize: 11, color: "rgba(43,30,24,0.65)" }}>
                  {puzzle.successMsg}
                </p>

                {/* SDG note */}
                <div className="border-l-2 border-primary pl-3 mb-3 py-0.5">
                  <p className="font-cinzel uppercase tracking-widest mb-0.5" style={{ fontSize: 7, color: "rgba(43,30,24,0.32)" }}>SDG Connection</p>
                  <p className="font-merriweather italic" style={{ fontSize: 10, color: "#5E8B4A" }}>{puzzle.sdgNote}</p>
                </div>

                {/* Citation */}
                <div className="p-2.5" style={{ background: "rgba(248,241,229,0.55)", border: "1px solid rgba(43,30,24,0.18)" }}>
                  <p className="font-cinzel uppercase tracking-widest mb-1" style={{ fontSize: 7, color: "rgba(43,30,24,0.3)" }}>
                    Source (APA 7th Edition)
                  </p>
                  <p className="font-merriweather italic" style={{ fontSize: 9, color: "rgba(43,30,24,0.45)" }}>
                    {puzzle.citation}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <InkButton onClick={handleContinue} variant="gold">
                {puzzleIdx + 1 < CH1_PUZZLES.length ? "Continue →" : "Complete Chapter →"}
              </InkButton>
            </div>
          </div>
        )}

        {/* COMPLETE */}
        {frame === "complete" && (
          <div className="w-full max-w-sm animate-screen-in">
            <OrnateFrame dark>
              <div className="text-center space-y-4">
                <div>
                  <p className="font-cinzel tracking-[0.45em] uppercase"
                    style={{ fontSize: 9, color: "rgba(200,162,77,0.5)" }}>Chapter I Complete</p>
                  <h2 className="font-cinzel font-black mt-2"
                    style={{ fontSize: "clamp(1.5rem,4vw,2.1rem)", color: "#F0E6C8", letterSpacing: "0.06em" }}>
                    THE NATION<br />AWAKENS
                  </h2>
                </div>

                {/* All-complete journey timeline */}
                <div className="flex items-center px-1">
                  {CH1_PUZZLES.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <div className="flex-1 h-px" style={{ background: "#C8A24D" }} />}
                      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%",
                          background: "#C8A24D", border: "2px solid #C8A24D",
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, color: "#0d0800", fontWeight: 700 }}>✓</span>
                        </div>
                        <span className="font-cinzel uppercase tracking-wider"
                          style={{ fontSize: 6, lineHeight: 1, color: "rgba(200,162,77,0.55)" }}>{p.city}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                <Divider dark />
                <p className="font-im-fell italic"
                  style={{ fontSize: "clamp(0.85rem,2vw,0.98rem)", color: "rgba(240,230,200,0.5)", lineHeight: 1.8 }}>
                  &ldquo;Knowledge is the first foundation<br />of sustainable communities.&rdquo;
                </p>
                <div className="py-3 px-4"
                  style={{ background: "rgba(200,162,77,0.08)", border: "2px solid rgba(200,162,77,0.28)" }}>
                  <p className="font-inter font-black" style={{ fontSize: 36, color: "#C8A24D", lineHeight: 1 }}>{awarePts}</p>
                  <p className="font-cinzel uppercase tracking-widest mt-1" style={{ fontSize: 8, color: "rgba(200,162,77,0.48)" }}>
                    Awareness Points Earned
                  </p>
                </div>
                {/* Awareness meter */}
                <div className="text-left space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-cinzel tracking-wider uppercase" style={{ fontSize: 9, color: "rgba(200,162,77,0.6)" }}>Awareness</span>
                    <span className="font-cinzel font-bold" style={{ fontSize: 9, color: "#C8A24D" }}>████████ 100%</span>
                  </div>
                  <div className="h-3 overflow-hidden"
                    style={{ background: "rgba(240,230,200,0.08)", border: "1px solid rgba(200,162,77,0.2)" }}>
                    <div ref={meterRef} className="h-full"
                      style={{ background: "linear-gradient(to right, #8B6914, #C8A24D, #E8C060)", width: 0 }} />
                  </div>
                </div>
                <Divider dark />
                <div className="space-y-3">
                  <InkButton
                    onClick={() => onComplete({ awareness: awarePts, sustainability: 0, justice: 0 })}
                    variant="gold">
                    Return to Chapters →
                  </InkButton>
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 cursor-not-allowed"
                    style={{ border: "2px solid rgba(240,230,200,0.1)", opacity: 0.36 }}>
                    <Lock size={11} style={{ color: "rgba(240,230,200,0.4)" }} />
                    <span className="font-cinzel tracking-widest uppercase"
                      style={{ fontSize: 9, color: "rgba(240,230,200,0.4)" }}>
                      Proceed to Dapitan — Locked
                    </span>
                  </div>
                </div>
              </div>
            </OrnateFrame>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen,    setScreen]    = useState<Screen>("loading");
  const [scores,    setScores]    = useState<Scores>({ awareness:0, sustainability:0, justice:0 });
  const [unlocked,  setUnlocked]  = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [ch1Earned, setCh1Earned] = useState<Scores>({ awareness:0, sustainability:0, justice:0 });

  const addScores = (earned: Scores) =>
    setScores(p => ({
      awareness:      p.awareness      + earned.awareness,
      sustainability: p.sustainability + earned.sustainability,
      justice:        p.justice        + earned.justice,
    }));

  const finishChapter = (n: number, earned: Scores) => {
    addScores(earned);
    setCompleted(p => [...p, n]);
    setUnlocked(u => Math.max(u, n + 1));
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {screen === "loading" && (
        <LoadingScreen 
          onStart={() => setScreen("chapter-select")}
          onShowSDGInfo={() => setScreen("sdg-info")}
        />
      )}
      {screen === "sdg-info" && (
        <SDGInfoScreen 
          onBack={() => setScreen("loading")}
          onStart={() => setScreen("chapter-select")}
        />
      )}
      {screen === "chapter-select" && (
        <ChapterSelectScreen
          unlocked={unlocked} completed={completed} scores={scores}
          onSelect={(n) => setScreen(n === 1 ? "ch1" : n === 2 ? "ch2" : "ch3")}
        />
      )}
      {screen === "ch1" && (
        <Chapter1Screen
          scores={scores}
          onComplete={(earned) => { setCh1Earned(earned); finishChapter(1, earned); setScreen("ch1-complete"); }}
        />
      )}
      {screen === "ch1-complete" && (
        <ChapterCompleteScreen
          chapterNum="I" title="Ideas Awaken Nations." portrait="lineArt"
          summaryText="Rizal's novels, civic organizations, and historical research lit a fire of awareness across the Filipino people — demonstrating that education and cultural identity are the bedrock of every sustainable community."
          sdgLink="SDG 11.3 & 11.4 — Participatory governance and cultural heritage as pillars of sustainable cities."
          earned={ch1Earned}
          color="#C8A24D"
          onContinue={() => setScreen("chapter-select")}
          continueLabel="Continue → Unlock Chapter 2"
        />
      )}
      {screen === "ch2" && (
        <ChapterGameScreen
          chapterNum="II" chapterTitle="Dapitan Builder" location="Dapitan, Mindanao — 1892–1896"
          accentColor="#5E8B4A" scenarios={CH2_SCENARIOS} dark={false} scores={scores}
          onComplete={(earned) => { finishChapter(2, earned); setScreen("ch2-complete"); }}
        />
      )}
      {screen === "ch2-complete" && (
        <ChapterCompleteScreen
          chapterNum="II" title="Communities Flourish Through Action." portrait="flat"
          summaryText="Dapitan became a model of what Rizal believed in: a self-sufficient, educated, healthy, and well-planned community — built not by colonial authority, but by the people themselves."
          sdgLink="SDG 11.1, 11.3 & 11.6 — Inclusive services, participatory planning, and environmental sustainability."
          earned={{ awareness:0, sustainability: scores.sustainability, justice:0 }}
          color="#5E8B4A"
          onContinue={() => setScreen("chapter-select")}
          continueLabel="Continue → Unlock Chapter 3"
        />
      )}
      {screen === "ch3" && (
        <ChapterGameScreen
          chapterNum="III" chapterTitle="The Reformer" location="The Philippines — 1892–1896"
          accentColor="#C8A24D" scenarios={CH3_SCENARIOS} dark scores={scores}
          onComplete={(earned) => { finishChapter(3, earned); setScreen("final-score"); }}
        />
      )}
      {screen === "final-score" && (
        <FinalScoreScreen scores={scores} onViewAnalysis={() => setScreen("analysis")} />
      )}
      {screen === "analysis" && (
        <AnalysisScreen scores={scores} onReturn={() => setScreen("chapter-select")} />
      )}
    </div>
  );
}
