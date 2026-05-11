import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products/new", "routes/products.new.tsx"),
  route("products/:id/edit", "routes/products.edit.tsx"),
  // Dynamic route to serve uploaded images from persistent storage
  route("uploads/*", "routes/uploads.ts"),
  // Catch-all route to redirect to home
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
