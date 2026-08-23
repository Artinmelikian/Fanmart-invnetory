import { StatsCard } from "../stats-card";
import { Package } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <StatsCard title="Total Items" value="24" icon={Package} />
      <StatsCard title="Total Stock" value="156" icon={Package} />
      <StatsCard title="Low Stock" value="3" icon={Package} />
    </div>
  );
}
