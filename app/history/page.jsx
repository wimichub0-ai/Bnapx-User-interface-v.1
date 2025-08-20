"use client";

import TabBar from "@/components/TabBar";

export default function History() {
  return (
    <main className="container">
      <h2 style={{ margin: "0 0 8px" }}>Transaction History</h2>
      <div className="card-lite">
        <div className="small">Your recent payments and trades will show here.</div>
        {/* Later: map real entries from Supabase */}
      </div>

      <TabBar />
    </main>
  );
}
