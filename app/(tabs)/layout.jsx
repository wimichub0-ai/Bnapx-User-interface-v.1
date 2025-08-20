// Server Component layout (no "use client" here)
import TabBar from "./TabBar";

export default function TabsLayout({ children }) {
  return (
    <div className="container">
      {children}
      <TabBar />
    </div>
  );
}
