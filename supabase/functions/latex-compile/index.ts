import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { texSource, engine } = await req.json();

    if (!texSource || typeof texSource !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing texSource' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const form = new FormData();
    // TeXLive.net expects filename[] and filecontents[] pairs
    form.append('filename[]', 'document.tex');
    form.append('filecontents[]', texSource);
    form.append('engine', engine === 'xelatex' ? 'xelatex' : 'pdflatex');
    form.append('return', 'pdf');

    // Primary compile endpoint (TeXLive.net)
    const compileUrl = 'https://texlive.net/cgi-bin/latexcgi';

    const r = await fetch(compileUrl, { method: 'POST', body: form });

    const contentType = r.headers.get('content-type') || '';
    if (!r.ok || !contentType.includes('application/pdf')) {
      const logText = await r.text();
      return new Response(JSON.stringify({ error: 'Compilation failed', log: logText.slice(0, 5000) }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pdfArrayBuffer = await r.arrayBuffer();

    return new Response(pdfArrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('latex-compile error', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
