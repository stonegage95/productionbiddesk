import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { isEditorPreview } from "@/lib/is-editor-preview";
import { lovable } from "@/integrations/lovable";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();
  const previewBypass = isEditorPreview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/app");
      }
    } else {
      if (!name.trim()) {
        toast({ title: "Name required", description: "Please enter your name.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!phone.trim()) {
        toast({ title: "Phone required", description: "Please enter your phone number.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!company.trim()) {
        toast({ title: "Company required", description: "Please enter your company.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name.trim(),
            phone: phone.trim(),
            company: company.trim(),
          },
        },
      });

      if (error) {
        const isAlreadyRegistered =
          error.message?.toLowerCase().includes("already registered") ||
          error.message?.toLowerCase().includes("already been registered");

        if (isAlreadyRegistered) {
          setIsLogin(true);
          toast({
            title: "Account already exists",
            description: "Please sign in with your password, or reset it below.",
          });
        } else {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        }
      } else {
        const existingAccount = !!data.user && (data.user.identities?.length ?? 0) === 0;

        if (existingAccount) {
          toast({
            title: "Account already exists",
            description: "Use Sign in, or click Forgot password if needed.",
            variant: "destructive",
          });
          setIsLogin(true);
        } else if (data.user) {
          // Auto-confirm is on, so a session should be present. Save trial info either way.
          await supabase.from("trial_users").upsert(
            {
              user_id: data.user.id,
              email,
              name: name.trim(),
              phone: phone.trim(),
              company: company.trim(),
            },
            { onConflict: "user_id" }
          );

          if (data.session) {
            toast({ title: "Welcome — your 3-day trial just started" });
            navigate("/app");
          } else {
            // Fallback: try to log them in directly (auto-confirm should make this work)
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
            if (signInError) {
              toast({ title: "Almost there", description: "Please sign in with your new credentials." });
              setIsLogin(true);
            } else {
              navigate("/app");
            }
          }
        }
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast({ title: "Enter your email above first", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: `Password reset link sent to ${forgotEmail}.` });
      setShowForgot(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <h1 className="text-xl font-semibold text-center text-foreground">
          {isLogin ? "Sign in to Production Bid Desk" : "Start your free 3-day trial"}
        </h1>
        {!isLogin && (
          <p className="text-center text-sm text-muted-foreground">
            No credit card required · Instant access
          </p>
        )}

        {previewBypass && (
          <div className="rounded-md border border-border bg-muted/30 p-4 space-y-3 text-center">
            <p className="text-sm text-muted-foreground">
              Preview mode is active — you can open the app without logging in while testing here.
            </p>
            <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/app")}>
              Continue to app preview
            </Button>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={async () => {
            const result = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: `${window.location.origin}/app`,
            });
            if (result.error) {
              toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.227c1.886-1.737 2.986-4.296 2.986-7.35z"/>
            <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.227-2.51c-.895.6-2.04.955-3.391.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22z"/>
            <path fill="#FBBC05" d="M6.404 13.9a6.005 6.005 0 0 1 0-3.8V7.51H3.064a10.005 10.005 0 0 0 0 8.98l3.34-2.59z"/>
            <path fill="#EA4335" d="M12 5.977c1.468 0 2.786.505 3.823 1.496l2.864-2.864C16.96 2.99 14.696 2 12 2A9.997 9.997 0 0 0 3.064 7.51l3.34 2.59C7.19 7.736 9.395 5.977 12 5.977z"/>
          </svg>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          <span>or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Producer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  maxLength={30}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Your production company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                  maxLength={100}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Start 3-Day Free Trial · No Credit Card"}
          </Button>
        </form>

        {isLogin && !showForgot && (
          <button
            onClick={() => setShowForgot(true)}
            className="block mx-auto text-xs text-muted-foreground hover:text-foreground underline"
          >
            Forgot password?
          </button>
        )}

        {isLogin && showForgot && (
          <div className="space-y-2 border border-border rounded-md p-4">
            <Label htmlFor="forgot-email">Enter your email to reset password</Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleForgotPassword} className="flex-1" variant="outline" size="sm">
                Send reset link
              </Button>
              <Button onClick={() => setShowForgot(false)} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Start free trial" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
