import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import TrialBanner from "@/components/TrialBanner";
import Paywall from "@/components/Paywall";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  LogOut,
  Upload,
  FileText,
  X,
  Download,
  History,
  Trash2,
  Send,
  Bot,
  User,
  ArrowLeft,
} from "lucide-react";

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bid-desk-analyze`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Report {
  id: string;
  project_name: string;
  risks: string | null;
  budget: string | null;
  timeline: string | null;
  raw_markdown: string | null;
  created_at: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const TARGET_SIZE = 3 * 1024 * 1024;
const MAX_DIMENSION = 2048;

function compressImageFile(file: File): Promise<{ base64: string; mime: string }> {
  if (file.type === "application/pdf") {
    return Promise.reject(new Error("PDF is too large. Please export your storyboard pages as JPG or PNG images, or compress the PDF to under 4 MB."));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.85;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length * 0.75 > TARGET_SIZE && quality > 0.3) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }

      if (dataUrl.length * 0.75 > TARGET_SIZE) {
        const scale = 0.6;
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      }

      resolve({ base64: dataUrl.split(",")[1], mime: "image/jpeg" });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

async function streamResponse(
  body: Record<string, unknown>,
  onDelta: (chunk: string) => void,
  onDone: () => void
) {
  const resp = await fetch(ANALYZE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(err.error || "Analysis failed");
  }
  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newlineIdx: number;
    while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, newlineIdx);
      buffer = buffer.slice(newlineIdx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") break;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        buffer = line + "\n" + buffer;
        break;
      }
    }
  }

  if (buffer.trim()) {
    for (let raw of buffer.split("\n")) {
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
}

const BidDeskApp = () => {
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState("");
  const [script, setScript] = useState("");
  const [storyboardFile, setStoryboardFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [talentLevel, setTalentLevel] = useState("");
  const [deliverables, setDeliverables] = useState("");

  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<Report[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const storyboardDataRef = useRef<{ base64: string; mime: string } | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("bid_desk_reports")
      .select("id, project_name, risks, budget, timeline, raw_markdown, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setHistory(data as Report[]);
    setLoadingHistory(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const saveReport = async (fullMarkdown: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("bid_desk_reports").insert({
      user_id: user.id,
      project_name: projectName || "Untitled",
      script: script || null,
      talent_level: talentLevel || null,
      deliverables: deliverables || null,
      raw_markdown: fullMarkdown || null,
    });
    fetchHistory();
  };

  const deleteReport = async (id: string) => {
    await supabase.from("bid_desk_reports").delete().eq("id", id);
    setHistory((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Report deleted" });
  };

  const MAX_FILE_SIZE = 4 * 1024 * 1024;

  const handleStart = async () => {
    if (!deliverables.trim()) {
      toast({ title: "Required", description: "Please enter deliverables to begin.", variant: "destructive" });
      return;
    }

    setStarted(true);
    setStreaming(true);
    setMessages([]);

    const parts = [
      `Project: ${projectName || "Untitled"}`,
      script?.trim() ? `Script:\n${script}` : null,
      talentLevel ? `Talent level: ${talentLevel}` : null,
      deliverables ? `Deliverables: ${deliverables}` : null,
    ].filter(Boolean).join("\n\n");

    let storyboardBase64: string | undefined;
    let storyboardMimeType: string | undefined;
    if (storyboardFile) {
      if (storyboardFile.size > MAX_FILE_SIZE) {
        try {
          toast({ title: "Compressing storyboard…", description: "File is over 4 MB, auto-compressing." });
          const compressed = await compressImageFile(storyboardFile);
          storyboardBase64 = compressed.base64;
          storyboardMimeType = compressed.mime;
        } catch (e: any) {
          setStarted(false);
          setStreaming(false);
          toast({ title: "Compression failed", description: e.message || "Please use a smaller file.", variant: "destructive" });
          return;
        }
      } else {
        storyboardBase64 = await fileToBase64(storyboardFile);
        storyboardMimeType = storyboardFile.type || "image/png";
      }
      storyboardDataRef.current = null;
    }

    const userMsg: ChatMessage = { role: "user", content: parts };
    setMessages([userMsg]);

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages([userMsg, { role: "assistant", content: assistantText }]);
    };

    try {
      await streamResponse(
        { projectName, script, talentLevel, deliverables, storyboardBase64, storyboardMimeType },
        updateAssistant,
        () => {
          setStreaming(false);
          if (assistantText.trim()) saveReport(assistantText);
        }
      );
    } catch (e: any) {
      setStreaming(false);
      toast({ title: "Error", description: e.message || "Analysis failed", variant: "destructive" });
    }
  };

  const handleFollowUp = async () => {
    if (!followUp.trim() || streaming) return;

    const userMsg: ChatMessage = { role: "user", content: followUp };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setFollowUp("");
    setStreaming(true);

    const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

    let assistantText = "";
    const updateAssistant = (chunk: string) => {
      assistantText += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length === newMessages.length + 1) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantText } : m));
        }
        return [...prev, { role: "assistant", content: assistantText }];
      });
    };

    try {
      await streamResponse(
        { messages: apiMessages },
        updateAssistant,
        () => setStreaming(false)
      );
    } catch (e: any) {
      setStreaming(false);
      toast({ title: "Error", description: e.message || "Failed to get response", variant: "destructive" });
    }
  };

  const handleNewAnalysis = () => {
    setStarted(false);
    setMessages([]);
    setProjectName("");
    setScript("");
    setStoryboardFile(null);
    setTalentLevel("");
    setDeliverables("");
    storyboardDataRef.current = null;
  };

  const handleExportPDF = () => {
    const allAssistant = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("\n\n---\n\n");
    if (!allAssistant) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast({ title: "Pop-up blocked", description: "Please allow pop-ups for PDF export.", variant: "destructive" });
      return;
    }

    const title = projectName || "Production Bid Desk";
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const mdToHtml = (md: string) =>
      md
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
        .replace(/^### (.+)$/gm, "<h3>$1</h3>")
        .replace(/^## (.+)$/gm, "<h2>$1</h2>")
        .replace(/\n{2,}/g, "<br/><br/>")
        .replace(/\n/g, "<br/>");

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${title} — Production Bid Desk Report</title>
  <style>
    @page { margin: 0.75in 1in; size: letter; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.6; padding: 0; }
    .header { border-bottom: 3px solid #c9a227; padding-bottom: 16px; margin-bottom: 28px; }
    .header h1 { font-size: 22px; font-weight: 700; }
    .header .subtitle { font-size: 13px; color: #666; }
    .content { font-size: 13px; color: #333; }
    .content h2 { font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; border-bottom: 1px solid #e5e5e5; padding-bottom: 4px; }
    .content h3 { font-size: 14px; font-weight: 600; margin-top: 12px; }
    .content ul { padding-left: 18px; margin: 6px 0; }
    .content li { margin-bottom: 4px; }
    .content strong { font-weight: 600; }
    .content hr { margin: 20px 0; border: none; border-top: 1px solid #e5e5e5; }
    .footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 11px; color: #999; text-align: center; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>${title}</h1>
    <div class="subtitle">Production Bid Desk Report &bull; ${date}</div>
  </div>
  <div class="content">${mdToHtml(allAssistant)}</div>
  <div class="footer">Production Bid Desk &bull; Confidential</div>
</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
  };

  const handleExportDeckOutline = () => {
    const allAssistant = messages.filter((m) => m.role === "assistant").map((m) => m.content).join("\n\n");
    if (!allAssistant.trim()) {
      toast({ title: "Nothing to export", description: "Run an analysis first, then export the deck outline.", variant: "destructive" });
      return;
    }

    const title = projectName || "Production Bid Desk";
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const extractSection = (text: string, headings: string[]) => {
      for (const heading of headings) {
        const regex = new RegExp(`(?:^|\\n)##?\\s*${heading}[^\\n]*\\n([\\s\\S]*?)(?=\\n##|$)`, "i");
        const match = text.match(regex);
        if (match) return match[1].trim();
      }
      return null;
    };

    const risks = extractSection(allAssistant, ["Risks", "Risk"]) || "Not yet analyzed — ask the AI for a risks assessment.";
    const budget = extractSection(allAssistant, ["Budget", "Ballpark", "Cost"]) || "Not yet analyzed — ask the AI for ballpark numbers.";
    const timeline = extractSection(allAssistant, ["Timeline", "Schedule", "Production Schedule"]) || "Not yet analyzed — ask the AI for a timeline.";
    const postProd = extractSection(allAssistant, ["Post-Production", "Post Production", "Editorial"]) || null;
    const crew = extractSection(allAssistant, ["Crew", "Equipment", "Production Approach"]) || null;
    const assumptions = extractSection(allAssistant, ["Assumptions", "Key Assumptions"]) || null;

    const mdToHtml = (md: string) =>
      md
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/^- (.+)$/gm, "<li>$1</li>")
        .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
        .replace(/^### (.+)$/gm, "<h4>$1</h4>")
        .replace(/^## (.+)$/gm, "<h3>$1</h3>")
        .replace(/\n{2,}/g, "<br/><br/>")
        .replace(/\n/g, "<br/>");

    const section = (num: string, label: string, content: string) =>
      `<div class="section"><div class="section-header"><span class="section-num">${num}</span>${label}</div><div class="section-body">${mdToHtml(content)}</div></div>`;

    const sections = [
      section("01", "Project Overview", `<strong>${title}</strong><br/>Format: Commercial / Branded Content<br/>Date: ${date}${deliverables ? `<br/>Deliverables: ${deliverables}` : ""}${talentLevel ? `<br/>Talent: ${talentLevel}` : ""}`),
      section("02", "Risk Register", risks),
      section("03", "Budget Summary", budget),
      section("04", "Production Schedule", timeline),
      postProd ? section("05", "Post-Production Plan", postProd) : "",
      assumptions ? section(postProd ? "06" : "05", "Key Assumptions", assumptions) : "",
      crew ? section(postProd && assumptions ? "07" : postProd || assumptions ? "06" : "05", "Crew & Equipment", crew) : "",
    ].filter(Boolean).join("");

    const outlineHtml = `<!DOCTYPE html>
<html>
<head>
  <title>${title} — Production Deck Outline</title>
  <style>
    @page { margin: 0.75in 1in; size: letter; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1a1a1a; line-height: 1.55; }
    .cover { text-align: center; padding: 80px 40px 40px; border-bottom: 4px solid #c9a227; margin-bottom: 32px; }
    .cover h1 { font-size: 28px; font-weight: 700; margin-bottom: 6px; }
    .cover .type { font-size: 14px; color: #c9a227; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 12px; }
    .cover .meta { font-size: 12px; color: #888; }
    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-header { font-size: 15px; font-weight: 700; border-bottom: 2px solid #c9a227; padding-bottom: 4px; margin-bottom: 10px; display: flex; align-items: baseline; gap: 8px; }
    .section-num { color: #c9a227; font-size: 13px; font-weight: 600; }
    .section-body { font-size: 12.5px; color: #333; }
    .section-body ul { padding-left: 18px; margin: 6px 0; }
    .section-body li { margin-bottom: 3px; }
    .section-body strong { font-weight: 600; }
    .section-body h3 { font-size: 13px; font-weight: 600; margin-top: 10px; margin-bottom: 4px; }
    .section-body h4 { font-size: 12.5px; font-weight: 600; margin-top: 8px; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 10px; color: #aaa; text-align: center; }
    .open-items { margin-top: 28px; padding: 16px; background: #fafaf8; border: 1px solid #e5e5e5; border-radius: 4px; }
    .open-items h3 { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
    .open-items p { font-size: 12px; color: #666; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="type">Production Deck Outline</div>
    <h1>${title}</h1>
    <div class="meta">${date} &bull; Prepared by Production Bid Desk</div>
  </div>
  ${sections}
  <div class="open-items">
    <h3>Next Steps / Open Questions</h3>
    <p>This deck outline was generated from an AI-assisted pre-bid analysis. Review all estimates, validate assumptions with your production team, and refine numbers based on actual vendor quotes and location scouts.</p>
  </div>
  <div class="footer">Production Bid Desk &bull; Confidential &bull; ${date}</div>
</body>
</html>`;

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production-bid-desk";
    const blob = new Blob([outlineHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${safeTitle}-deck-outline.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast({ title: "Deck outline downloaded", description: "Open the HTML file and use Print → Save as PDF to create a polished PDF." });
  };

  const quickActions = [
    { label: "📊 Ballpark numbers", message: "Give me ballpark budget numbers including production AND post-production cost drivers" },
    { label: "📋 Deck outline", message: "Generate a production deck outline I can use in my bid deck" },
    { label: "🗓️ Timeline", message: "Give me a high-level production timeline from pre-pro through post and delivery" },
    { label: "🎬 Post-production", message: "Break down the post-production workflow, edit schedule, VFX/finishing, and cost estimates" },
    { label: "🎭 Talent recs", message: "What are your talent and casting recommendations?" },
    { label: "🏗️ Production approach", message: "Recommend crew size, equipment, and production methodology" },
  ];

  return (
    <>
    <Paywall />
    <div className="min-h-screen bg-background flex flex-col">
      <TrialBanner />
      

      <div className="max-w-[960px] w-full mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {started && (
            <Button variant="ghost" size="icon" onClick={handleNewAnalysis} className="shrink-0" title="New analysis">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <Logo />
            {!started && (
              <p className="text-muted-foreground text-sm mt-1 max-w-xl">
                Paste your script or storyboard and I'll walk you through risks, budget, timeline, and more — one step at a time.
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {started && messages.some((m) => m.role === "assistant") && (
            <>
              <Button variant="outline" size="sm" onClick={handleExportDeckOutline} className="gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" /> Deck Outline
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }}
            className="gap-1.5 text-muted-foreground"
          >
            <History className="h-4 w-4" /> History
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground gap-1.5">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="max-w-[960px] w-full mx-auto px-6 pb-2">
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Past reports</h3>
            {loadingHistory ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : history.length === 0 ? (
              <p className="text-xs text-muted-foreground">No reports yet.</p>
            ) : (
              <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                {history.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                    <span className="font-medium text-foreground truncate">{r.project_name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <button onClick={() => deleteReport(r.id)} className="text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 max-w-[960px] w-full mx-auto px-6 py-4 flex flex-col">
        {!started ? (
          <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-2xl mx-auto w-full">
            <div className="space-y-1.5">
              <Label>Project name</Label>
              <Input placeholder="e.g. Summer Campaign" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Script or brief</Label>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs">Paste your script below, or upload a text file.</p>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors shrink-0">
                  <Upload className="h-3 w-3" />
                  Upload script
                  <input type="file" accept=".txt,.md,.rtf,.doc,.docx,.pdf" className="sr-only" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const text = await file.text();
                      setScript((prev) => prev ? prev + "\n\n" + text : text);
                      toast({ title: "Script loaded", description: file.name });
                    } catch {
                      toast({ title: "Couldn't read file", description: "Try pasting the text instead.", variant: "destructive" });
                    }
                    e.target.value = "";
                  }} />
                </label>
              </div>
              <Textarea
                placeholder="Paste your script here…"
                className="min-h-[120px]"
                value={script}
                onChange={(e) => setScript(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = ".pdf,.png,.jpg,.jpeg,.webp";
                    input.onchange = () => {
                      const file = input.files?.[0];
                      if (file) {
                        const valid = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
                        if (valid.some((ext) => file.name.toLowerCase().endsWith(ext))) {
                          setStoryboardFile(file);
                          toast({ title: "Storyboard attached", description: file.size > MAX_FILE_SIZE ? `${file.name} (will be auto-compressed)` : file.name });
                        } else {
                          toast({ title: "Unsupported file", description: "Please use PDF, PNG, JPG, or WebP.", variant: "destructive" });
                        }
                      }
                    };
                    input.click();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors w-full ${
                    storyboardFile
                      ? "border-primary/40 bg-secondary/40 text-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  {storyboardFile ? (
                    <span className="flex items-center gap-2 truncate">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      {storyboardFile.name}
                    </span>
                  ) : "Tap to upload storyboard"}
                </button>
                {storyboardFile && (
                  <button type="button" onClick={() => setStoryboardFile(null)} className="text-muted-foreground hover:text-foreground p-2 self-center">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <label
                className={`hidden sm:flex items-center gap-2 cursor-pointer rounded-lg border border-dashed px-4 py-3 text-sm transition-colors ${
                  dragging
                    ? "border-primary bg-primary/10 text-foreground"
                    : storyboardFile
                    ? "border-primary/40 bg-secondary/40 text-foreground"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40"
                }`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation(); setDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    const valid = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
                    if (valid.some((ext) => file.name.toLowerCase().endsWith(ext))) {
                      setStoryboardFile(file);
                      toast({ title: "Storyboard attached", description: file.size > MAX_FILE_SIZE ? `${file.name} (will be auto-compressed)` : file.name });
                    } else {
                      toast({ title: "Unsupported file", description: "Please use PDF, PNG, JPG, or WebP.", variant: "destructive" });
                    }
                  }
                }}
              >
                <Upload className="h-4 w-4 shrink-0" />
                {storyboardFile ? (
                  <span className="flex items-center gap-2 truncate">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    {storyboardFile.name}
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStoryboardFile(null); }} className="ml-auto text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : dragging ? "Drop your file here" : "Or drag & drop a storyboard here"}
                <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" className="sr-only" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setStoryboardFile(file);
                    toast({ title: "Storyboard attached", description: file.size > MAX_FILE_SIZE ? `${file.name} (will be auto-compressed)` : file.name });
                  }
                }} />
              </label>
              <p className="text-muted-foreground text-xs opacity-75">Large images are auto-compressed. PDFs over 4 MB should be compressed externally or exported as JPG/PNG.</p>
              <p className="text-xs mt-1" style={{ color: "hsl(var(--gold))" }}>* Please upload a generic or non-branded script or storyboard for estimation purposes.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Talent level <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Select value={talentLevel} onValueChange={setTalentLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="AI will recommend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="non-union">Non‑union / real people</SelectItem>
                    <SelectItem value="union">Union / SAG</SelectItem>
                    <SelectItem value="celebrity">Celebrity / influencer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Deliverables <span className="text-primary">*</span></Label>
                <Input placeholder="e.g. :30, :15, social cuts" value={deliverables} onChange={(e) => setDeliverables(e.target.value)} />
              </div>
            </div>

            <Button className="w-full mt-2" onClick={handleStart} disabled={streaming || !deliverables.trim()}>
              Start Analysis
            </Button>

            <p className="text-muted-foreground text-xs opacity-75 mt-1">
              <span className="text-primary">*</span> Required field.
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-xl px-4 py-3 max-w-[85%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 border border-border text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none text-sm
                        [&_h1]:!text-lg [&_h1]:font-bold [&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:!text-[#ffd54a]
                        [&_h2]:!text-base [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:!text-[#ffd54a]
                        [&_h3]:!text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:!text-[#ffd54a]
                        [&_h4]:!text-sm [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1 [&_h4]:!text-[#ffd54a]/80
                        [&_p]:mb-2.5 [&_p]:leading-relaxed
                        [&_ul]:mb-3 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1
                        [&_ol]:mb-3 [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1
                        [&_li]:leading-relaxed
                        [&_strong]:text-[hsl(var(--foreground))] [&_strong]:font-semibold
                        [&_hr]:my-4 [&_hr]:border-[hsl(var(--border))]
                        [&_blockquote]:border-l-2 [&_blockquote]:border-[#ffd54a] [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[hsl(var(--muted-foreground))]
                      ">
                        <ReactMarkdown>{msg.content || "_Thinking…_"}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content.length > 200 ? msg.content.slice(0, 200) + "…" : msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {streaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 justify-start">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="rounded-xl px-4 py-3 bg-secondary/50 border border-border">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {!streaming && messages.length >= 2 && messages[messages.length - 1]?.role === "assistant" && (
              <div className="flex flex-wrap gap-2 pb-3">
                {quickActions.map((qa) => (
                  <Button
                    key={qa.label}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setFollowUp(qa.message);
                      setTimeout(() => {
                        setFollowUp("");
                        const userMsg: ChatMessage = { role: "user", content: qa.message };
                        const newMsgs = [...messages, userMsg];
                        setMessages(newMsgs);
                        setStreaming(true);

                        const apiMessages = newMsgs.map((m, idx) => {
                          if (idx === 0 && m.role === "user" && storyboardDataRef.current) {
                            return {
                              role: "user",
                              content: [
                                { type: "text", text: m.content },
                                { type: "image_url", image_url: { url: `data:${storyboardDataRef.current.mime};base64,${storyboardDataRef.current.base64}` } },
                              ],
                            };
                          }
                          return m;
                        });

                        let assistantText = "";
                        streamResponse(
                          { messages: apiMessages },
                          (chunk) => {
                            assistantText += chunk;
                            setMessages((prev) => {
                              const last = prev[prev.length - 1];
                              if (last?.role === "assistant" && prev.length === newMsgs.length + 1) {
                                return prev.map((m, idx2) => (idx2 === prev.length - 1 ? { ...m, content: assistantText } : m));
                              }
                              return [...prev, { role: "assistant", content: assistantText }];
                            });
                          },
                          () => setStreaming(false)
                        ).catch((e) => {
                          setStreaming(false);
                          toast({ title: "Error", description: e.message, variant: "destructive" });
                        });
                      }, 0);
                    }}
                  >
                    {qa.label}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-2 border-t border-border">
              <Input
                placeholder="Ask a follow-up question…"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleFollowUp(); } }}
                disabled={streaming}
                className="flex-1"
              />
              <Button size="icon" onClick={handleFollowUp} disabled={streaming || !followUp.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default BidDeskApp;
