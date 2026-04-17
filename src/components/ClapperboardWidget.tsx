import { useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const messageSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z
    .string()
    .trim()
    .max(255)
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  topic: z.string().max(50).optional(),
  message: z
    .string()
    .trim()
    .nonempty("Message cannot be empty")
    .max(1000, "Message must be under 1000 characters"),
});

const TOPICS = ["Pricing", "Demo", "Tech help"] as const;

/**
 * Real clapperboard "sticks" — the hinged arm at the top with
 * alternating black/white diagonal teeth. Pure B&W, no brand color.
 */
const ClapperSticks = ({
  height = 18,
  rotated = false,
}: {
  height?: number;
  rotated?: boolean;
}) => (
  <div
    className="w-full origin-bottom-left transition-transform duration-300"
    style={{
      height,
      background: "#111111",
      transform: rotated ? "rotate(-12deg)" : "rotate(0deg)",
      transformOrigin: "0% 100%",
    }}
    aria-hidden
  >
    {/* white teeth strip */}
    <div
      className="w-full h-full"
      style={{
        background:
          "repeating-linear-gradient(115deg, #111111 0 16px, #FFFFFF 16px 32px)",
      }}
    />
  </div>
);

/**
 * The slate body — the dark board below the sticks. Has the classic
 * "PROD / SCENE / TAKE" rows you'd write on with chalk.
 */
const SlateRows = () => (
  <div className="flex flex-col gap-[3px] px-2 py-1.5 bg-[#1a1a1a]">
    {[
      { label: "PROD", value: "BID DESK" },
      { label: "SCENE", value: "01" },
      { label: "TAKE", value: "1" },
    ].map((row) => (
      <div
        key={row.label}
        className="flex items-center gap-2 border-b border-white/15 pb-[2px]"
      >
        <span className="text-[7px] font-bold tracking-[0.15em] text-white/70 w-9">
          {row.label}
        </span>
        <span className="text-[8px] font-mono text-white tracking-wider">
          {row.value}
        </span>
      </div>
    ))}
  </div>
);

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (location.pathname.startsWith("/bid-desk-app")) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = messageSchema.safeParse({ name, email, topic, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("support_messages").insert({
        user_id: userData.user?.id ?? null,
        name: parsed.data.name || null,
        email: parsed.data.email || null,
        topic: parsed.data.topic || null,
        message: parsed.data.message,
      });
      if (error) throw error;

      toast.success("Got it! We'll be in touch shortly.");
      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setIsOpen(false);
    } catch {
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Closed launcher: small clapperboard icon, wider than tall ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Open help"
        className="fixed bottom-4 right-4 z-50 group flex flex-col items-end gap-1 focus:outline-none"
      >
        <div
          className="w-[72px] h-[54px] rounded-[3px] overflow-hidden shadow-xl bg-[#1a1a1a] flex flex-col"
          style={{ border: "1px solid #000" }}
        >
          <ClapperSticks height={16} rotated={hover} />
          <SlateRows />
        </div>
        <span className="text-[9px] font-bold tracking-[0.15em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          NEED HELP?
        </span>
      </button>
    );
  }

  // ── Open panel: same clapperboard styling on top, form below ──
  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[4px] shadow-2xl bg-[#F5F5F0]"
      style={{
        fontFamily: "Manrope, sans-serif",
        border: "1px solid #000",
      }}
      role="dialog"
      aria-label="Help"
    >
      {/* Sticks */}
      <ClapperSticks height={20} />

      {/* Slate header strip */}
      <div className="bg-[#1a1a1a] px-3 py-2 flex items-center justify-between">
        <div>
          <div className="text-[8px] font-bold tracking-[0.2em] text-white/60">
            PRODUCTION BID DESK
          </div>
          <div className="text-xs font-bold tracking-tight text-white">
            How can we help?
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close"
          className="rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Form on cream "paper" body */}
      <div className="p-3 text-[#0A0A0A]">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(topic === t ? "" : t)}
                className="rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors"
                style={{
                  borderColor: topic === t ? "#0A0A0A" : "rgba(10,10,10,0.25)",
                  background: topic === t ? "#0A0A0A" : "transparent",
                  color: topic === t ? "#F5F5F0" : "rgba(10,10,10,0.75)",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <Input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={255}
            className="h-8 text-xs border-[#0A0A0A]/25 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
          />

          <Textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={3}
            className="text-xs border-[#0A0A0A]/25 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            required
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-8 text-xs font-bold tracking-[0.2em] bg-[#0A0A0A] text-[#F5F5F0] hover:bg-[#0A0A0A]/90"
          >
            {submitting ? "SENDING..." : "SEND"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClapperboardWidget;
