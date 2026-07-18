export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default function KataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
