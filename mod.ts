import { serve } from "https://deno.land/std@0.129.0/http/server.ts";

await serve(async (req) => {
  const uri = new URL(req.url);
  if (!/\/status\/\d+$/.test(uri.pathname)) {
    return new Response(null, { status: 404 });
  }
  uri.hostname = "twitter.com";
  uri.port = "";
  uri.protocol = "https:";
  const id = uri.pathname.match(/\d+$/)![0];
  const body = new URLSearchParams({
    url: "https://twitter.com/i/status/" + id,
  });
  const res = await fetch("https://www.getfvid.com/zh/twitter", {
    method: "POST",
    body: body.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = await res.text();
  const arr = data.match(/https:\/\/video\.twimg\.com\/.*?(?=\")/gm);
  if (!arr) {
    console.log(data);
    return new Response(null, { status: 404 });
  }
  return await fetch(arr[0]);
}, { port: parseInt(Deno.env.get("PORT") || "9000") });
