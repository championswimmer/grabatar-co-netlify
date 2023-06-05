import type { Config, Context } from "https://edge.netlify.com";
import { Hash, encode } from "https://deno.land/x/checksum@1.2.0/mod.ts";

export default (request: Request, context: Context) => {

  const reqURL = new URL(request.url);
  const { pathname } = reqURL;
  const [, email] = pathname.split("/");
  // Create MD5 hash of email
  const emailHash = new Hash("md5").digest(encode(email)).hex()

  return new Response(`
    <html>
      <head>
        <title>Grabatar</title>
      </head>
      <body>
        <img src="https://www.libravatar.org/avatar/${emailHash}?s=512" />
      </body>
    </html>
  `, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
    }
  })

};

export const config = {
  path: "/*"
}