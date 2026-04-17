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
  name: z.string().trim().max(100, "Name must be under 100 characters").optional(),
  email: z
    .string()
    .trim()
    .max(255, "Email must be under 255 characters")
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

// Proper clapperboard top: alternating black + white diagonal teeth
const ClapperTop = ({ height = 14 }: { height?: number }) => (
  <div
    className="w-full"
    style={{
      height,
      background:
        "repeating-linear-gradient(115deg, #0A0A0A 0 14px, #F5F5F0 14px 28px)",
      borderBottom: "2px solid #D4AF37",
    }}
    aria-hidden
  />
);

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open help chat"
        className="fixed bottom-4 right-4 z-50 w-14 h-14 overflow-hidden rounded-md shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        style={{
          background: "#F5F5F0",
          border: "1px solid #D4AF37",
        }}
      >
        <ClapperTop height={12} />
        <div
          className="flex items-center justify-center text-[#0A0A0A]"
          style={{ height: "calc(100% - 12px)", fontFamily: "Manrope, sans-serif" }}
        >
          <span className="text-[9px] font-bold tracking-[0.1em] leading-tight text-center px-1">
            NEED<br />HELP?
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md shadow-2xl"
      style={{
        background: "#F5F5F0",
        fontFamily: "Manrope, sans-serif",
        border: "1px solid #D4AF37",
      }}
      role="dialog"
      aria-label="Help chat"
    >
      <ClapperTop />
      <div className="p-3 text-[#0A0A0A]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.18em] text-[#0A0A0A]/70">
              PRODUCTION BID DESK
            </div>
            <div className="mt-0.5 text-sm font-semibold tracking-tight">
              How can we help?
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="rounded p-1 text-[#0A0A0A]/60 hover:bg-[#0A0A0A]/5 hover:text-[#0A0A0A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-2 h-px bg-[#0A0A0A]/15" />

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(topic === t ? "" : t)}
                className="rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide transition-colors"
                style={{
                  borderColor: topic === t ? "#D4AF37" : "rgba(10,10,10,0.2)",
                  background: topic === t ? "#D4AF37" : "transparent",
                  color: topic === t ? "#0A0A0A" : "rgba(10,10,10,0.7)",
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
            className="h-8 text-xs border-[#0A0A0A]/20 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
          />

          <Textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={3}
            className="text-xs border-[#0A0A0A]/20 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            required
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-8 text-xs font-bold tracking-[0.2em] hover:opacity-90"
            style={{ background: "#D4AF37", color: "#0A0A0A" }}
          >
            {submitting ? "SENDING..." : "SEND"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClapperboardWidget;
