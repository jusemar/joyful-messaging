import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCheck,
  ChevronDown,
  Mic,
  MoreHorizontal,
  Paperclip,
  Phone,
  Play,
  Search,
  Send,
  ShoppingBag,
  Smile,
  Video,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jaa — Suas conversas, do seu jeito" },
      {
        name: "description",
        content: "Converse com pessoas e empresas de um jeito simples, próximo e organizado no Jaa.",
      },
      { property: "og:title", content: "Jaa — Suas conversas, do seu jeito" },
      {
        property: "og:description",
        content: "Converse com pessoas e empresas de um jeito simples, próximo e organizado no Jaa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConversationsPage,
});

type Conversation = {
  id: number;
  name: string;
  initials: string;
  message: string;
  time: string;
  tone: "dark" | "jade" | "gold" | "soft";
  online?: boolean;
  unread?: number;
  business?: boolean;
};

const conversations: Conversation[] = [
  { id: 1, name: "Marina Duarte", initials: "MD", message: "Perfeito, te chamo assim que sair.", time: "09:42", tone: "dark", online: true, unread: 2 },
  { id: 2, name: "Pizzaria Isaque", initials: "PI", message: "Seu pedido saiu para entrega", time: "09:18", tone: "gold", online: true, business: true },
  { id: 3, name: "Ricardo Almeida", initials: "RA", message: "Consegui separar o pedido, pode confirmar?", time: "08:15", tone: "jade", online: true },
  { id: 4, name: "Ateliê Flor", initials: "AF", message: "O arranjo saiu lindo. Obrigada!", time: "ontem", tone: "soft", business: true },
  { id: 5, name: "Carla Nunes", initials: "CN", message: "Te mando o arquivo ainda hoje.", time: "ontem", tone: "dark" },
  { id: 6, name: "João Prado", initials: "JP", message: "Bora marcar o café da semana?", time: "seg", tone: "gold" },
];

const fallbackConversation: Conversation = {
  id: 0,
  name: "Conversa",
  initials: "JA",
  message: "",
  time: "",
  tone: "jade",
};

function Avatar({ initials, tone, online = false, small = false }: { initials: string; tone: Conversation["tone"]; online?: boolean; small?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className={`avatar avatar-${tone} ${small ? "avatar-sm" : "avatar-md"}`}>{initials}</div>
      {online ? <span className="presence-dot" aria-label="Online" /> : null}
    </div>
  );
}

function IconAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} className="rounded-full text-muted-foreground">
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function ConversationsPage() {
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [identity, setIdentity] = useState<"Pessoal" | "Pizzaria Isaque">("Pessoal");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  const filtered = conversations.filter((conversation) =>
    `${conversation.name} ${conversation.message}`.toLowerCase().includes(query.toLowerCase()),
  );
  const activeConversation = conversations.find((conversation) => conversation.id === activeId) ?? fallbackConversation;

  const openConversation = (id: number) => {
    setActiveId(id);
    setMobileChatOpen(true);
  };

  const sendMessage = () => {
    const message = draft.trim();
    if (!message) return;
    setSentMessages((current) => [...current, message]);
    setDraft("");
  };

  return (
    <TooltipProvider delayDuration={350}>
      <main className="messenger-shell">
        <aside className={`conversation-sidebar ${mobileChatOpen ? "mobile-hidden" : ""}`} aria-label="Conversas">
          <div className="sidebar-top">
            <div className="brand-row">
              <div className="brand-mark" aria-hidden="true"><span>J</span></div>
              <div className="min-w-0">
                <h1>Jaa</h1>
                <p>Suas conversas</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="identity-trigger" aria-label="Trocar identidade">
                    <span className="identity-dot" />
                    <span className="truncate">{identity}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-xl p-2">
                  <DropdownMenuLabel>Conversar como</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => setIdentity("Pessoal")} className="rounded-lg py-2.5">
                    <Avatar initials="JR" tone="jade" small />
                    <div><p className="font-medium">Junior Rocha</p><p className="text-xs text-muted-foreground">@junior · pessoal</p></div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setIdentity("Pizzaria Isaque")} className="rounded-lg py-2.5">
                    <Avatar initials="PI" tone="gold" small />
                    <div><p className="font-medium">Pizzaria Isaque</p><p className="text-xs text-muted-foreground">@pizzariaisaque · empresa</p></div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <label className="search-field">
              <Search aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pessoas e empresas" aria-label="Buscar pessoas e empresas" />
            </label>

            <div className="list-heading">
              <span>Conversas</span>
              <Button variant="ghost" size="icon" aria-label="Mais opções"><MoreHorizontal /></Button>
            </div>
          </div>

          <div className="conversation-list">
            {filtered.map((conversation) => (
              <button key={conversation.id} type="button" className={`conversation-item ${activeId === conversation.id ? "active" : ""}`} onClick={() => openConversation(conversation.id)}>
                <Avatar initials={conversation.initials} tone={conversation.tone} online={Boolean(conversation.online)} />
                <div className="conversation-copy">
                  <div className="conversation-title">
                    <strong>{conversation.name}</strong>
                    {conversation.business ? <span className="business-label">Empresa</span> : null}
                    <time>{conversation.time}</time>
                  </div>
                  <div className="conversation-preview">
                    <span>{conversation.message}</span>
                    {conversation.unread ? <b>{conversation.unread}</b> : null}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="profile-strip">
            <Avatar initials={identity === "Pessoal" ? "JR" : "PI"} tone={identity === "Pessoal" ? "jade" : "gold"} online />
            <div className="min-w-0 flex-1">
              <strong className="block truncate">{identity === "Pessoal" ? "Junior Rocha" : "Pizzaria Isaque"}</strong>
              <span>{identity === "Pessoal" ? "Identidade pessoal" : "Identidade da empresa"}</span>
            </div>
            <IconAction label="Configurações"><MoreHorizontal /></IconAction>
          </div>
        </aside>

        <section className={`chat-panel ${mobileChatOpen ? "mobile-open" : ""}`} aria-label={`Conversa com ${activeConversation.name}`}>
          <header className="chat-header">
            <Button variant="ghost" size="icon" className="mobile-back" aria-label="Voltar para conversas" onClick={() => setMobileChatOpen(false)}><ArrowLeft /></Button>
            <Avatar initials={activeConversation.initials} tone={activeConversation.tone} online={Boolean(activeConversation.online)} />
            <div className="chat-person">
              <strong>{activeConversation.name}</strong>
              <span>{activeConversation.online ? "online agora" : "visto ontem"}</span>
            </div>
            <div className="chat-actions">
              <IconAction label="Ligação"><Phone /></IconAction>
              <IconAction label="Chamada de vídeo"><Video /></IconAction>
              <IconAction label="Mais opções"><MoreHorizontal /></IconAction>
            </div>
          </header>

          <div className="messages" aria-live="polite">
            <div className="day-divider"><span>Hoje</span></div>
            <div className="message-row incoming">
              <Avatar initials={activeConversation.initials} tone={activeConversation.tone} small />
              <div><div className="message-bubble">Oi, Junior! Vi que você confirmou o encontro de sábado. Podemos ajustar o horário?<span className="message-time">09:40</span></div></div>
            </div>
            <div className="message-row outgoing">
              <div><div className="message-bubble">Claro! Que tal 15h? Fica melhor pra mim.<span className="message-time">09:41 <CheckCheck /></span></div></div>
            </div>
            <div className="message-row incoming">
              <Avatar initials={activeConversation.initials} tone={activeConversation.tone} small />
              <div>
                <div className="message-bubble">
                  <div className="quote"><strong>Você</strong><span>Que tal 15h? Fica melhor pra mim.</span></div>
                  Perfeito, te chamo assim que sair da reunião.
                  <span className="message-time">09:42</span>
                </div>
              </div>
            </div>
            <div className="message-row outgoing">
              <div><div className="message-bubble audio-message"><Button size="icon" aria-label="Reproduzir áudio"><Play /></Button><div className="waveform" aria-hidden="true">{[2,4,6,3,5,7,4,6,3,5,2,4,6,3,5,7,4,2].map((height, index) => <i key={index} style={{ height: `${height * 3}px` }} />)}</div><span>0:12</span><span className="message-time">09:43 <CheckCheck /></span></div></div>
            </div>
            <div className="order-card">
              <div className="order-icon"><ShoppingBag /></div>
              <div><strong>Enviar um presente?</strong><span>Flores e presentes com entrega hoje</span></div>
              <Button variant="secondary" size="sm">Ver opções</Button>
            </div>
            {sentMessages.map((message, index) => (
              <div className="message-row outgoing" key={`${message}-${index}`}>
                <div><div className="message-bubble">{message}<span className="message-time">agora <CheckCheck /></span></div></div>
              </div>
            ))}
          </div>

          <form className="composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
            <div className="composer-inner">
              <IconAction label="Anexar"><Paperclip /></IconAction>
              <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escreva uma mensagem" aria-label="Mensagem" />
              <div className="composer-extras"><IconAction label="Emoji"><Smile /></IconAction></div>
              {draft.trim() ? <Button type="submit" size="icon" className="send-button" aria-label="Enviar mensagem"><Send /></Button> : <Button type="button" size="icon" variant="ghost" className="record-button" aria-label="Gravar áudio"><Mic /></Button>}
            </div>
          </form>
        </section>
      </main>
    </TooltipProvider>
  );
}