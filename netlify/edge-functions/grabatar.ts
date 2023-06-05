import type { Config, Context } from "https://edge.netlify.com";
import { Md5Hash } from "https://deno.land/x/checksum@1.2.0/md5.ts";

export default (request: Request, context: Context) => {

  const reqURL = new URL(request.url);
  const { pathname } = reqURL;
  const [, email] = pathname.split("/");
  // Create MD5 hash of email
  const emailHash = new Md5Hash().digest(new TextEncoder().encode(email)).hex()

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