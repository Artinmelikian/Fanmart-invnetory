import { InventoryTable, InventoryItem } from "../inventory-table";

const mockItems: InventoryItem[] = [
  { id: 1, name: "Centrifugal Pump Model A", quantity: 12, flow: 150, power: 2200, weight: 45, speed: 2900 },
  { id: 2, name: "Submersible Pump B", quantity: 8, flow: 200, power: 3000, weight: 60, speed: 1450 },
  { id: 3, name: "Booster Pump C", quantity: 5, flow: 100, description: "High pressure", power: 1500 },
  { id: 4, name: "Water Tank 500L", quantity: 3, flow: 50 },
];

export default function InventoryTableExample() {
  return (
    <div className="p-6">
      <InventoryTable
        items={mockItems}
        onEdit={(item) => console.log("Edit item:", item)}
        onDelete={(id) => console.log("Delete item:", id)}
      />
    </div>
  );
}
