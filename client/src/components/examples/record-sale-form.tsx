import { RecordSaleForm } from "../record-sale-form";
import { InventoryItem } from "../inventory-table";

const mockItems: InventoryItem[] = [
  { id: 1, name: "Centrifugal Pump Model A", quantity: 12, flow: 150, power: 2200, weight: 45, speed: 2900 },
  { id: 2, name: "Submersible Pump B", quantity: 8, flow: 200, power: 3000, weight: 60, speed: 1450 },
  { id: 3, name: "Booster Pump C", quantity: 5, flow: 100, power: 1500 },
];

export default function RecordSaleFormExample() {
  return (
    <div className="p-6">
      <RecordSaleForm
        items={mockItems}
        onSubmit={(data) => {
          console.log("Sale recorded:", data);
          alert(`Sale recorded successfully!`);
        }}
      />
    </div>
  );
}
