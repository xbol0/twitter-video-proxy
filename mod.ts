import { serve } from "https://deno.land/std@0.129.0/http/server.ts";

await serve(async (req) => {
  const uri = new URL(req.url);
  if (!/\/\d+$/.test(uri.pathname)) return new Response(null, { status: 404 });
  const id = uri.pathname.match(/\d+$/)![0];
  const body = new URLSearchParams({
    url: `https://twitter.com/i/status/${id}`,
  });
  const res = await fetch("https://www.getfvid.com/zh/twitter", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = await res.text();
  const arr = data.match(/https:\/\/video\.twimg\.com\/.*?(?=\")/gm);
  if (!arr) return new Response(null, { status: 404 });
  return uri.search ? await fetch(arr[0]) : new Response(null, {
    status: 302,
    headers: new Headers({ Location: arr[0] }),
  });
}, { port: parseInt(Deno.env.get("PORT") || "9000") });
