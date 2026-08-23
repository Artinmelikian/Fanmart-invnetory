import { AddItemForm } from "../add-item-form";

export default function AddItemFormExample() {
  return (
    <div className="p-6">
      <AddItemForm
        onSubmit={(data) => {
          console.log("Form submitted:", data);
          alert(`Item "${data.name}" added successfully!`);
        }}
      />
    </div>
  );
}
