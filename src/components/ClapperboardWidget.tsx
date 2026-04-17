import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClapperIllustration } from "@/components/clapperboard/ClapperIllustration";

const messageSchema = z.object({
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

const ClapperboardWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoClapping, setIsAutoClapping] = useState(false);
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  if (location.pathname.startsWith("/bid-desk-app")) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setIsHovered(false);
    setIsAutoClapping(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsHovered(false);
    setIsAutoClapping(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = messageSchema.safeParse({ email, topic, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("support_messages").insert({
        user_id: userData.user?.id ?? null,
        email: parsed.data.email || null,
        topic: parsed.data.topic || null,
        message: parsed.data.message,
      });

      if (error) throw error;

      toast.success("Got it! We'll be in touch shortly.");
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

  const launcherRaised = isHovered || isAutoClapping;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open help"
        className={`fixed bottom-4 right-3 z-50 transition-all duration-200 ease-out md:bottom-5 md:right-5 ${
          isOpen ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <ClapperIllustration raised={launcherRaised} compact />
      </button>

      <div
        className={`fixed bottom-4 right-3 z-50 w-[16rem] max-w-[calc(100vw-1rem)] transition-all duration-200 ease-out md:bottom-5 md:right-5 ${
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        role="dialog"
        aria-label="Help"
      >
        <div className="overflow-hidden rounded-[1.25rem] border border-foreground/15 bg-secondary shadow-[0_26px_60px_hsl(var(--background)/0.6)]">
          <div className="relative border-b border-foreground/10 px-3 pb-2 pt-3">
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full border border-foreground/15 p-1 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <ClapperIllustration raised className="pr-10" />
          </div>

          <div className="bg-background/95 px-3 py-3 text-foreground">
            <p className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-foreground/55">
              Ask a production question
            </p>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((item) => {
                  const selected = topic === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(selected ? "" : item)}
                      className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                        selected
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 bg-transparent text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <Input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                className="h-9 rounded-xl border-foreground/15 bg-card text-sm text-foreground placeholder:text-muted-foreground"
              />

              <Textarea
                placeholder="Your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={4}
                className="min-h-[6rem] rounded-xl border-foreground/15 bg-card text-sm text-foreground placeholder:text-muted-foreground"
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
