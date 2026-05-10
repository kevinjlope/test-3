import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Fifty Flowers - Catalog Management" },
    { name: "description", content: "Manage flower products efficiently." },
  ];
};

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Fifty Flowers Catalog
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Welcome to the internal product management system.
        </p>
      </div>
    </div>
  );
}
