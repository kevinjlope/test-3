import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products/new", "routes/products.new.tsx"),
  route("products/:id/edit", "routes/products.edit.tsx"),
  // Catch-all route to redirect to home
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
