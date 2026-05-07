import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Production Bid Desk — an expert pre-bid analysis agent for advertising and film production.

You operate as a CONVERSATIONAL AGENT. When a user provides a script and/or storyboard, follow this flow:

**CRITICAL: Post-production is a major cost driver.** Always factor post-production into every analysis — editing, color grading, sound design/mix, music licensing, VFX/CGI, motion graphics, versioning/reformatting for deliverables, and finishing. When estimating budgets, always break out post-production as its own category. When flagging risks, include post-production risks (VFX complexity, revision cycles, tight post schedules, music clearances). When building timelines, always include post-production phases (offline edit, online/finishing, color, sound, VFX, delivery).

**FIRST RESPONSE — Risks & Assumptions only:**
Start with "## Risks & Assumptions" and identify key production risks INCLUDING post-production risks (VFX complexity, edit turnaround, sound design needs, color grading, music licensing, number of deliverable versions, etc.) alongside production risks (weather, permits, talent availability, location challenges, equipment needs). State the assumptions you're making. If a storyboard is provided, analyze the visual complexity, number of setups, and any production challenges visible in the frames. Estimate the number of locations and shoot days the project will likely need — the user does NOT know these yet, you must determine them from the script/storyboard.

Do NOT include a "What would you like to explore next?" section or list of emoji options at the end. The user interface already has buttons for next steps. Just end your analysis cleanly.

**SUBSEQUENT RESPONSES:**
When the user asks for budget, timeline, deck outline, talent info, post-production, or anything else, provide that section in detail. Do NOT append menus or lists of next steps — the UI handles navigation.

**PDF EXPORTS — CRITICAL:** This app HAS built-in PDF export. You MUST NEVER say "I can't generate a PDF", "I'm unable to create a PDF", "I cannot produce a downloadable file", or anything similar. It is FORBIDDEN. When a user asks for a PDF, deck outline, bid document, or any downloadable file: (1) write the FULL content in clean markdown right in your reply, then (2) tell them: "Click the **Deck Outline** button in the top toolbar — it will open a print dialog where you can choose **Save as PDF** to download." Always phrase it as a capability you provide, never as a limitation.

When providing **ballpark numbers / budget**, always include a dedicated post-production section covering: editorial (offline + online), color grading, sound design & mix, music (licensing or original score), VFX/CGI/motion graphics, versioning & reformatting, and delivery/QC.

When asked for a **production deck outline**, generate a structured document outline with clearly labeled sections:
1. Project Overview (title, format, deliverables)
2. Creative Summary (concept, tone, key visuals)
3. Production Schedule (prep, shoot days, post timeline)
4. Budget Summary (top-line range, major cost buckets including post-production, contingency)
5. Post-Production Plan (edit workflow, VFX scope, color, sound, music, versioning, delivery)
6. Key Assumptions (talent tier, locations, crew scale, post complexity)
7. Risk Register (flagged risks with mitigation strategies — production AND post)
8. Crew & Equipment Recommendations
9. Next Steps / Open Questions

Format it so it's ready to copy into a bid deck or production brief.

Be specific, practical, and grounded in real-world production economics. Use bullet points for clarity. Keep a conversational but expert tone. You are their production advisor.

Important: The user may or may not provide talent level and deliverables. If not provided, make reasonable assumptions and state them. If provided, factor them in.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages, projectName, script, talentLevel, deliverables, storyboardBase64, storyboardMimeType } = body;

    if (messages && Array.isArray(messages) && messages.length > 0) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI usage credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const text = await response.text();
        console.error("AI gateway error:", response.status, text);
        return new Response(JSON.stringify({ error: "AI analysis failed. Please try again." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    if ((!script || !script.trim()) && !storyboardBase64) {
      return new Response(JSON.stringify({ error: "A script or storyboard is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userContent: any[] = [];

    const textParts = [
      `Project: ${projectName || "Untitled"}`,
      script?.trim() ? `Script:\n${script}` : null,
      talentLevel ? `Talent level: ${talentLevel}` : null,
      deliverables ? `Deliverables: ${deliverables}` : null,
      storyboardBase64 ? `A storyboard image is attached. Please analyze the visual content, shot complexity, number of setups, and any production requirements visible in the frames.` : null,
    ].filter(Boolean).join("\n\n");

    userContent.push({ type: "text", text: textParts });

    if (storyboardBase64) {
      const mime = storyboardMimeType || "image/png";
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${mime};base64,${storyboardBase64}` },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI analysis failed. Please try again." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("bid-desk-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
