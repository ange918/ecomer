import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Tableau de bord admin : lecture / mise à jour des commandes avec la clé
// service_role INJECTÉE par Supabase (jamais exposée dans le code client).
// Accès libre (verify_jwt=false) : la protection est le secret de l'URL admin.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STATUSES = ["en_attente", "acceptee", "en_route", "livree", "annulee"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { action, id, status } = await req.json().catch(() => ({}));

    if (action === "list") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json(data ?? []);
    }

    if (action === "setStatus") {
      if (!id || !STATUSES.includes(status)) {
        return json({ error: "Requête invalide." }, 400);
      }
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    return json({ error: "Action inconnue." }, 400);
  } catch (e) {
    return json({ error: (e as Error)?.message ?? "Erreur serveur." }, 500);
  }
});
