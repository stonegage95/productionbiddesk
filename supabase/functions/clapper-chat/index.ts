// Conversational support chatbot for Production Bid Desk
// Uses Lovable AI Gateway, streams SSE back to client.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Production Bid Desk concierge — a warm, sharp, conversational assistant who helps producers, EPs, PMs, and cost consultants figure out if Production Bid Desk fits their needs.

How you talk:
- Friendly, plain-English, never robotic. One question at a time.
- Short replies (1–3 sentences). No bullet walls.
- Sound like a real production person, not a chatbot.

What to do:
1. Greet briefly and ask what brought them here today.
2. Naturally probe their situation — what kind of project, when they need it, how urgent, team size, what's blocking them.
3. Gauge urgency: is this for a bid due this week? Exploring? Just curious?
4. Once you understand the need, recommend the next step:
   - Pricing question → mention Solo $99 / Agency $299 / Enterprise tiers + 3-day free trial.
   - Wants demo → tell them to hit "Get Access" on the homepage so the team reaches out.
   - Tech / how-it-works → answer concisely from what you know about Production Bid Desk (AI-trained on real production data, union rates, NDA-compliant, ~60-second bid outlines from scripts/storyboards).
   - Urgent (bid due soon) → suggest they leave their email so the team can fast-track them.
5. If they need a human, ask for their email and a one-line summary, then confirm you'll pass it along.

Never:
- Dump lists of features unprompted.
- Ask multiple questions at once.
- Make up pricing, features, or timelines beyond what's listed above.

Always reply in the user's language.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(Array.isArray(messages) ? messages : []),
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests, please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact the team via Get Access." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("clapper-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
