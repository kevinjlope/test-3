import { redirect, type LoaderFunctionArgs } from "react-router";

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // If it looks like a file (has an extension), don't redirect to home, return 404
  if (url.pathname.includes(".")) {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect("/");
}

export default function CatchAll() {
  return null;
}
