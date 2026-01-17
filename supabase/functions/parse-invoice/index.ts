import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for parsing invoice details
const SYSTEM_PROMPT = `You are an invoice parsing assistant. Extract structured data from natural language invoice descriptions.

Always respond with a valid JSON object containing:
- items: Array of objects with { name: string, quantity: number, price: number }
- taxRate: number (percentage, e.g., 18 for 18%)
- discountRate: number (percentage, e.g., 10 for 10%)
- clientName: string (if mentioned)

Rules:
1. Parse quantities and prices carefully. "2 monitors at 12000 each" means quantity=2, price=12000
2. Look for tax mentions like "GST", "VAT", "tax" followed by percentages
3. Look for discount mentions followed by percentages
4. Extract client/company names if mentioned
5. If a value is not mentioned, omit it from the response or set to null
6. Always return valid JSON, nothing else

Examples:
Input: "2 monitors at 12000 each with 18% GST and 10% discount"
Output: {"items":[{"name":"Monitor","quantity":2,"price":12000}],"taxRate":18,"discountRate":10}

Input: "Web development 50 hours at 1500/hr for Acme Corp"
Output: {"items":[{"name":"Web Development","quantity":50,"price":1500}],"clientName":"Acme Corp"}`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Parsing invoice prompt:", prompt);

    // Call Lovable AI Gateway
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
          { role: "user", content: prompt },
        ],
        temperature: 0.1, // Low temperature for consistent parsing
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const errorText = await response.text();
      console.error("AI gateway error:", status, errorText);

      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to process with AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response content:", content);

    // Parse the JSON response
    try {
      // Clean the response - remove markdown code blocks if present
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();

      const parsed = JSON.parse(jsonStr);

      // Validate the response structure
      if (!parsed.items || !Array.isArray(parsed.items)) {
        throw new Error("Invalid response: missing items array");
      }

      // Ensure items have required fields
      const validatedItems = parsed.items.map((item: { name?: string; quantity?: number; price?: number }) => ({
        name: item.name || "Item",
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      }));

      const result = {
        items: validatedItems,
        taxRate: parsed.taxRate !== undefined ? Number(parsed.taxRate) : undefined,
        discountRate: parsed.discountRate !== undefined ? Number(parsed.discountRate) : undefined,
        clientName: parsed.clientName || undefined,
      };

      console.log("Parsed result:", result);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({ error: "Failed to parse invoice details" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
