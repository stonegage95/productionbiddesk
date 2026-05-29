import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import Logo from "@/components/Logo";
import { isEditorPreview } from "@/lib/is-editor-preview";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Auth gating temporarily disabled for testing — anyone can access protected routes.
  return <>{children}</>;
};

export default ProtectedRoute;
