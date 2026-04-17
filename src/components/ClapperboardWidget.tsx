import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { ClapperIllustration } from "@/components/clapperboard/ClapperIllustration";

type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clapper-chat`;

const INITIAL_GREETING: ChatMsg = {
  role: "assistant",
  content:
    "Hey! I'm the Production Bid Desk concierge. What brought you here today — are you sizing up a bid, exploring the tool, or something else?",
};

async function streamChat(
  messages: ChatMsg[],
  onDelta: (chunk: string) => void,
  onDone: () => void,
  onError: (msg: string) => void
) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return onError("Too many messages — please wait a moment.");
      if (resp.status === 402) return onError("AI credits exhausted. Use Get Access to reach the team.");
      return onError("Couldn't reach the assistant. Please try again.");
    }
    if (!resp.body) return onError("No response from assistant.");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          /* ignore */
        }
      }
    }

    onDone();
  } catch (e) {
    console.error("chat stream error", e);
    onError("Connection lost. Please try again.");
  }
}

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoClapping, setIsAutoClapping] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-clap pulse when closed
  useEffect(() => {
    if (isOpen) return;
    let releaseTimeout: number | undefined;
    const interval = window.setInterval(() => {
      setIsAutoClapping(true);
      releaseTimeout = window.setTimeout(() => setIsAutoClapping(false), 220);
    }, 4200);
    return () => {
      window.clearInterval(interval);
      if (releaseTimeout) window.clearTimeout(releaseTimeout);
    };
  }, [isOpen]);

  // Autoscroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  if (location.pathname.startsWith("/app") || location.pathname.startsWith("/bid-desk-app")) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setIsHovered(false);
    setIsAutoClapping(true);
    setTimeout(() => inputRef.current?.focus(), 250);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsHovered(false);
    setIsAutoClapping(false);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMsg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === next.length + 1) {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    // Strip the initial greeting from history we send (it's UX-only, not part of model context)
    const apiMessages = next.filter((m, i) => !(i === 0 && m === INITIAL_GREETING));

    await streamChat(
      apiMessages,
      upsertAssistant,
      () => setStreaming(false),
      (msg) => {
        setStreaming(false);
        toast.error(msg);
        // remove the empty assistant placeholder if any
        setMessages((prev) => prev.filter((m) => !(m.role === "assistant" && m.content === "")));
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const launcherRaised = isHovered || isAutoClapping;

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open chat"
        className={`fixed bottom-4 right-3 z-50 transition-all duration-200 ease-out md:bottom-5 md:right-5 ${
          isOpen ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <ClapperIllustration raised={launcherRaised} compact />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed z-50 flex flex-col transition-all duration-200 ease-out
          inset-x-3 bottom-3 top-auto h-[min(78vh,560px)] max-h-[calc(100dvh-1.5rem)]
          md:inset-auto md:bottom-5 md:right-5 md:h-[560px] md:w-[22rem]
          ${isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
        role="dialog"
        aria-label="Production Bid Desk chat"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-secondary shadow-[0_26px_60px_hsl(var(--background)/0.6)]">
          {/* Header */}
          <div className="relative flex items-center gap-3 border-b border-foreground/10 bg-secondary px-3 py-2.5">
            <div className="shrink-0">
              <ClapperIllustration raised compact />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">Bid Desk Concierge</p>
              <p className="truncate text-[0.68rem] text-muted-foreground">
                {streaming ? "Typing…" : "Online · usually replies instantly"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close chat"
              className="shrink-0 rounded-full border border-foreground/15 p-1.5 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-2.5 overflow-y-auto bg-background/95 px-3 py-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-sm bg-foreground text-background"
                      : "rounded-bl-sm bg-card text-foreground border border-foreground/10"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_p]:text-foreground [&_strong]:text-foreground [&_a]:text-[hsl(var(--gold))] [&_ul]:my-1 [&_ul]:pl-4 [&_li]:my-0.5">
                      {m.content ? (
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      ) : (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-foreground/10 bg-card px-3 py-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-foreground/10 bg-secondary px-2.5 py-2.5">
            <div className="flex items-end gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Production Bid Desk…"
                rows={1}
                maxLength={1000}
                className="min-h-[2.5rem] max-h-32 flex-1 resize-none rounded-xl border-foreground/15 bg-card text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={send}
                disabled={streaming || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[0.6rem] text-muted-foreground">
              Need a human? <a href="/#get-access" className="underline hover:text-foreground">Get Access</a> to reach the team.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClapperboardWidget;
