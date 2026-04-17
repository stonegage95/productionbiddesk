import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

interface SupportMessage {
  id: string;
  name: string | null;
  email: string | null;
  topic: string | null;
  message: string;
  created_at: string;
  user_id: string | null;
}

const AdminMessages = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Admin Inbox · Production Bid Desk";
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setMessages(data ?? []);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Support Inbox
          </h1>
          <p className="text-muted-foreground mt-1">
            Messages submitted through the clapperboard widget
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading messages...</p>
        ) : messages.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No messages yet.
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <Card key={m.id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="font-semibold text-foreground">
                      {m.name || "Anonymous"}
                    </div>
                    {m.email && (
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {m.email}
                      </a>
                    )}
                  </div>
                  <div className="text-right">
                    {m.topic && (
                      <Badge variant="secondary" className="mb-1">
                        {m.topic}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <p className="text-foreground whitespace-pre-wrap">
                  {m.message}
                </p>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMessages;
