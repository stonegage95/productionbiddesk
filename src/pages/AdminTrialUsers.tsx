import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, Phone, Building2 } from "lucide-react";
import Header from "@/components/Header";

interface TrialUser {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  trial_start: string;
  trial_end: string;
  is_subscribed: boolean;
  created_at: string;
}

const daysLeft = (end: string) => {
  const ms = new Date(end).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const toCsv = (rows: TrialUser[]) => {
  const header = ["Name", "Email", "Phone", "Company", "Signed Up", "Trial Ends", "Days Left", "Status"];
  const escape = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      escape(r.name),
      escape(r.email),
      escape(r.phone),
      escape(r.company),
      escape(new Date(r.created_at).toISOString()),
      escape(new Date(r.trial_end).toISOString()),
      escape(String(daysLeft(r.trial_end))),
      escape(r.is_subscribed ? "Subscribed" : daysLeft(r.trial_end) > 0 ? "Trialing" : "Expired"),
    ].join(",")
  );
  return [header.join(","), ...lines].join("\n");
};

const AdminTrialUsers = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [users, setUsers] = useState<TrialUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "CRM · Trial Signups · Production Bid Desk";
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      const { data } = await supabase
        .from("trial_users")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data ?? []);
      setLoading(false);
    };
    load();
  }, [isAdmin]);

  const handleExport = () => {
    const csv = toCsv(users);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `production-bid-desk-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const subscribedCount = users.filter((u) => u.is_subscribed).length;
  const activeCount = users.filter((u) => !u.is_subscribed && daysLeft(u.trial_end) > 0).length;
  const expiredCount = users.filter((u) => !u.is_subscribed && daysLeft(u.trial_end) <= 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              CRM · Trial Signups
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Every person who started a free trial. Export to load into your CRM.
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={users.length === 0}
            className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] hover:brightness-110 w-full sm:w-auto"
          >
            <Download size={16} className="mr-2" />
            Export CSV ({users.length})
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Active Trials</div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground mt-1">{activeCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Subscribed</div>
            <div className="text-2xl sm:text-3xl font-bold text-[hsl(var(--gold))] mt-1">{subscribedCount}</div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Expired</div>
            <div className="text-2xl sm:text-3xl font-bold text-muted-foreground mt-1">{expiredCount}</div>
          </Card>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading signups...</p>
        ) : users.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No signups yet. Share your link to get the first trial started.
          </Card>
        ) : (
          <div className="space-y-3">
            {users.map((u) => {
              const days = daysLeft(u.trial_end);
              const status = u.is_subscribed
                ? { label: "Subscribed", variant: "default" as const }
                : days > 0
                ? { label: `${days} day${days !== 1 ? "s" : ""} left`, variant: "secondary" as const }
                : { label: "Expired", variant: "outline" as const };

              return (
                <Card key={u.id} className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-semibold text-foreground truncate">{u.name}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground">
                        <a
                          href={`mailto:${u.email}`}
                          className="flex items-center gap-2 hover:text-foreground truncate"
                        >
                          <Mail size={14} className="shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </a>
                        {u.phone && (
                          <a
                            href={`tel:${u.phone}`}
                            className="flex items-center gap-2 hover:text-foreground"
                          >
                            <Phone size={14} className="shrink-0" />
                            {u.phone}
                          </a>
                        )}
                        {u.company && (
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="shrink-0" />
                            <span className="truncate">{u.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground sm:text-right shrink-0">
                      Signed up {new Date(u.created_at).toLocaleString()}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminTrialUsers;
