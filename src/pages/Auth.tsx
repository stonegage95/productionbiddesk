import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/bid-desk-app");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (error) {
        const isAlreadyRegistered =
          error.message?.toLowerCase().includes("already registered") ||
          error.message?.toLowerCase().includes("already been registered");

        if (isAlreadyRegistered) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            setIsLogin(true);
            toast({
              title: "Account already exists",
              description: "Please sign in with your password, or reset it below.",
            });
          } else {
            toast({ title: "Welcome back", description: "Signed in successfully." });
            navigate("/bid-desk-app");
          }
        } else {
          toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        }
      } else {
        const existingAccount = !!data.user && (data.user.identities?.length ?? 0) === 0;

        if (existingAccount) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

          if (signInError) {
            toast({
              title: "Account already exists",
              description: "Use Sign in, or click Forgot password if needed.",
              variant: "destructive",
            });
          } else {
            toast({ title: "Welcome back", description: "Signed in successfully." });
            navigate("/bid-desk-app");
          }
        } else if (data.session) {
          navigate("/bid-desk-app");
        } else {
          toast({ title: "Check your email", description: "We sent you a confirmation link." });
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center mb-4">
          <Logo />
        </div>
        <h1 className="text-xl font-semibold text-center text-foreground">
          {isLogin ? "Sign in to Production Bid Desk" : "Create an account"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
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
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Sign up"}
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
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
