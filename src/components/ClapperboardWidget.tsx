import { useEffect, useState } from "react";
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

const TOPICS = ["Pricing question", "Demo request", "Technical help"] as const;

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [clap, setClap] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Gentle clap animation every 8s when closed
  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => {
      setClap(true);
      setTimeout(() => setClap(false), 600);
    }, 8000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Hide on the in-app route to avoid covering the workspace UI
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

      toast.success("Cut! We got it. We'll be in touch shortly.");
      setName("");
      setEmail("");
      setTopic("");
      setMessage("");
      setIsOpen(false);
    } catch (err) {
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Striped clapper sticks (alternating black + gold)
  const Stripes = ({ clapping }: { clapping: boolean }) => (
    <div
      className="relative h-7 w-full origin-bottom-left overflow-hidden rounded-t-md transition-transform duration-300"
      style={{
        background:
          "repeating-linear-gradient(115deg, #0A0A0A 0 22px, #D4AF37 22px 30px, #0A0A0A 30px 52px, #F5F5F0 52px 60px)",
        transform: clapping ? "rotate(-18deg)" : "rotate(0deg)",
        transformOrigin: "bottom left",
      }}
      aria-hidden
    />
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open help chat"
        className="fixed bottom-5 right-5 z-50 w-[180px] overflow-hidden rounded-md text-left shadow-2xl transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        style={{
          background: "#F5F5F0",
          fontFamily: "Manrope, sans-serif",
          border: "1px solid #D4AF37",
        }}
      >
        <Stripes clapping={clap} />
        <div className="px-3 py-2.5 text-[#0A0A0A]">
          <div className="text-[10px] font-bold tracking-[0.18em]">
            PRODUCTION BID DESK
          </div>
          <div className="mt-1 flex justify-between text-[9px] tracking-[0.15em] text-[#0A0A0A]/70">
            <span>SCENE: HELP</span>
            <span>TAKE: 01</span>
          </div>
          <div className="my-1.5 h-px bg-[#0A0A0A]/15" />
          <div className="text-[11px] font-medium tracking-wide">
            Need help? Tap to chat
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-[360px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-md shadow-2xl"
      style={{
        background: "#F5F5F0",
        fontFamily: "Manrope, sans-serif",
        border: "1px solid #D4AF37",
      }}
      role="dialog"
      aria-label="Help chat"
    >
      <Stripes clapping={false} />
      <div className="p-4 text-[#0A0A0A]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold tracking-[0.18em]">
              PRODUCTION BID DESK
            </div>
            <div className="mt-0.5 text-base font-semibold tracking-tight">
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

        <div className="my-3 h-px bg-[#0A0A0A]/15" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(topic === t ? "" : t)}
                className="rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide transition-colors"
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

          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="h-9 border-[#0A0A0A]/20 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            />
            <Input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              className="h-9 border-[#0A0A0A]/20 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            />
          </div>

          <Textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={4}
            className="border-[#0A0A0A]/20 bg-white text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            required
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full font-bold tracking-[0.2em] hover:opacity-90"
            style={{ background: "#D4AF37", color: "#0A0A0A" }}
          >
            {submitting ? "SENDING..." : "ACTION"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClapperboardWidget;
