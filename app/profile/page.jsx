"use client";

import { useState } from "react";
import TabBar from "@/components/TabBar";

export default function Profile() {
  const [first, setFirst] = useState("");
  const [last, setLast]   = useState("");
  const [phone, setPhone] = useState("");

  return (
    <main className="container">
      <h2 style={{ margin: "0 0 8px" }}>Profile</h2>

      <div className="card-lite">
        <div className="field"><input placeholder="First name" value={first} onChange={e=>setFirst(e.target.value)} /></div>
        <div className="field"><input placeholder="Last name"  value={last}  onChange={e=>setLast(e.target.value)}  /></div>
        <div className="field"><input placeholder="Phone"      value={phone} onChange={e=>setPhone(e.target.value)} /></div>
        <button className="btn" onClick={()=>alert("Saved (prototype)")}>Save</button>
      </div>

      <TabBar />
    </main>
  );
}
