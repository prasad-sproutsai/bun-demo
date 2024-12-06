import { serve } from "bun";
import { data } from "./data";

let users = [...data]; // Clone initial data

const notFound = new Response("Not Found", { status: 404 });

const router = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);

  if(pathname === "/"){
    if (req.method === "GET") {
        return new Response("Hello World", {
          headers: { "Content-Type": "text/plain" },
        });
      }
  }

  if (pathname === "/users") {
    if (req.method === "GET") {
      return new Response(JSON.stringify(users), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const newUser = { id: users.length + 1, ...body };
      users.push(newUser);
      return new Response(JSON.stringify(newUser), { status: 201 });
    }
  }

  if (pathname.startsWith("/users/")) {
    const id = parseInt(pathname.split("/")[2]);
    const user = users.find((u) => u.id === id);

    if (!user) return notFound;

    if (req.method === "GET") {
      return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      Object.assign(user, body);
      return new Response(JSON.stringify(user), { headers: { "Content-Type": "application/json" } });
    }

    if (req.method === "DELETE") {
      users = users.filter((u) => u.id !== id);
      return new Response(null, { status: 204 });
    }
  }

  return notFound;
};

serve({
  fetch: router,
  port: 3008,
});

console.log("Server is running on http://localhost:3000");
