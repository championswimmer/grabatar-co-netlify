import type { Config, Context } from "https://edge.netlify.com";
import { Hash, encode } from "https://deno.land/x/checksum@1.2.0/mod.ts";

export default async (request: Request, context: Context) => {
  const reqURL = new URL(request.url);
  const { pathname } = reqURL;

  if (pathname.startsWith("/github/")) {
    const username = pathname.split("/github/")[1];
    console.log("username", username);

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      const data = await res.json();
      console.log("data.avatar_url", data.avatar_url);

      return new Response(
        `
        <html>
          <head>
            <title>Grabatar</title>
          </head>
          <body>
            <img src="${data.avatar_url}" />
          </body>
        </html>
      `,
        {
          headers: {
            "content-type": "text/html; charset=UTF-8",
          },
        }
      );
    } catch (error) {
      console.error("Error fetching GitHub avatar:", error);
      return new Response("Error fetching GitHub avatar", { status: 500 });
    }
  } else {
    const email = pathname.slice(1); // Remove leading slash
    const emailHash = new Hash("md5").digest(encode(email)).hex();

    return new Response(
      `
      <html>
        <head>
          <title>Grabatar</title>
        </head>
        <body>
          <img src="https://www.libravatar.org/avatar/${emailHash}?s=512" />
        </body>
      </html>
    `,
      {
        headers: {
          "content-type": "text/html; charset=UTF-8",
        },
      }
    );
  }
};

export const config = {
  path: "/*",
};
