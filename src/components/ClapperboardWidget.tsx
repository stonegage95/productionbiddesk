import { useMemo, useState } from "react";
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
const SLATE_ROWS = [
  { label: "PROD", value: "BID DESK" },
  { label: "SCENE", value: "24A" },
  { label: "TAKE", value: "01" },
] as const;

const clapperStripeStyle = {
  backgroundImage:
    "repeating-linear-gradient(120deg, hsl(var(--background)) 0 20px, hsl(var(--foreground)) 20px 40px)",
};

const ClapperTop = ({
  isRaised,
  compact = false,
}: {
  isRaised: boolean;
  compact?: boolean;
}) => (
  <div
    aria-hidden
    className="relative z-10 origin-[10px_100%] rounded-t-[0.9rem] border-x border-t border-foreground/25 bg-background shadow-[0_10px_24px_hsl(var(--background)/0.35)] transition-transform duration-200 ease-out"
    style={{
      ...clapperStripeStyle,
      height: compact ? "0.9rem" : "1.15rem",
      transform: isRaised ? "rotate(-18deg) translateY(-1px)" : "rotate(0deg)",
    }}
  >
    <div className="absolute inset-x-0 bottom-0 h-px bg-foreground/35" />
  </div>
);

const SlateFace = ({ compact = false }: { compact?: boolean }) => (
  <div className="rounded-[0.95rem] border border-foreground/20 bg-card px-2.5 py-2 shadow-[0_16px_30px_hsl(var(--background)/0.45)]">
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-1">
      {SLATE_ROWS.map((row) => (
        <>
          <span
            key={`${row.label}-label`}
            className="border-b border-foreground/15 pb-1 text-[0.52rem] font-semibold tracking-[0.24em] text-foreground/60"
          >
            {row.label}
          </span>
          <span
            key={`${row.label}-value`}
            className={`border-b border-foreground/15 pb-1 font-mono tracking-[0.18em] text-foreground ${compact ? "text-[0.58rem]" : "text-[0.7rem]"}`}
          >
            {row.value}
          </span>
        </>
      ))}
    </div>
  </div>
);

const ClosedSlate = ({ raised }: { raised: boolean }) => (
  <div className="w-[4.75rem]">
    <ClapperTop isRaised={raised} compact />
    <SlateFace compact />
  </div>
);

const OpenSlateHeader = ({ raised, onClose }: { raised: boolean; onClose: () => void }) => (
  <div className="px-3 pt-3">
    <ClapperTop isRaised={raised} />
    <div className="rounded-b-[1.15rem] rounded-t-[0.35rem] border border-foreground/20 bg-card px-3 py-3 shadow-[0_18px_40px_hsl(var(--background)/0.5)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[0.58rem] font-semibold tracking-[0.32em] text-foreground/55">
            PRODUCTION SLATE
          </p>
          <p className="text-sm font-semibold text-foreground">Need help?</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full border border-foreground/15 p-1 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3">
        <SlateFace />
      </div>
    </div>
  </div>
);

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isRaised, setIsRaised] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (location.pathname.startsWith("/bid-desk-app")) return null;

  const handleLauncherOpen = () => {
    setIsRaised(true);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsRaised(false);
    setIsOpen(false);
  };

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
      handleClose();
    } catch {
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const panelClasses = useMemo(
    () =>
      isOpen
        ? "pointer-events-auto translate-y-0 opacity-100"
        : "pointer-events-none translate-y-4 opacity-0",
    [isOpen],
  );

  return (
    <>
      <button
        onClick={handleLauncherOpen}
        onMouseEnter={() => setIsRaised(true)}
        onMouseLeave={() => !isOpen && setIsRaised(false)}
        aria-label="Open help"
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1 focus:outline-none md:bottom-5 md:right-5"
      >
        <ClosedSlate raised={isRaised} />
        <span className="text-[0.55rem] font-semibold tracking-[0.22em] text-muted-foreground/85">
          NEED HELP
        </span>
      </button>

      <div
        className={`fixed bottom-4 right-4 z-50 w-[18rem] max-w-[calc(100vw-1.5rem)] transition-all duration-200 ease-out md:bottom-5 md:right-5 md:w-[19rem] ${panelClasses}`}
        role="dialog"
        aria-label="Help"
      >
        <div className="overflow-hidden rounded-[1.35rem] border border-foreground/15 bg-[hsl(var(--secondary)/0.98)] shadow-[0_24px_60px_hsl(var(--background)/0.65)] backdrop-blur-sm">
          <OpenSlateHeader raised={true} onClose={handleClose} />

          <div className="px-3 pb-3 pt-2 text-foreground">
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((t) => {
                  const selected = topic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTopic(selected ? "" : t)}
                      className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.18em] transition-colors ${selected ? "border-foreground bg-foreground text-background" : "border-foreground/20 bg-transparent text-foreground/70 hover:border-foreground/40 hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>

              <Input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                className="h-9 rounded-xl border-foreground/15 bg-background/70 text-sm text-foreground placeholder:text-muted-foreground"
              />

              <Input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="h-9 rounded-xl border-foreground/15 bg-background/70 text-sm text-foreground placeholder:text-muted-foreground"
              />

              <Textarea
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                className="min-h-[6.25rem] rounded-xl border-foreground/15 bg-background/70 text-sm text-foreground placeholder:text-muted-foreground"
                required
              />

              <Button
                type="submit"
                disabled={submitting}
                className="h-9 w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
              >
                {submitting ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClapperboardWidget;
