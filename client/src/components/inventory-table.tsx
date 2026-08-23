import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import type { Item } from "@shared/schema";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type InventoryItem = Item;

interface InventoryTableProps {
  items: Item[];
  onEdit?: (item: Item) => void;
  onDelete?: (id: number) => void;
  onReorder?: (items: Item[]) => void;
}

interface SortableRowProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (id: number) => void;
  isDraggingDisabled?: boolean;
}

function SortableRow({ item, onEdit, onDelete, isDraggingDisabled }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: isDraggingDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-testid={`row-item-${item.id}`}
    >
      <TableCell>
        {!isDraggingDisabled && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing inline-flex items-center"
            data-testid={`drag-handle-${item.id}`}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </TableCell>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell className="text-right font-mono font-semibold" data-testid={`text-quantity-${item.id}`}>
        {item.quantity}
      </TableCell>
      <TableCell className="text-right font-mono">{item.flow}</TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {item.power ?? "—"}
      </TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {item.weight ?? "—"}
      </TableCell>
      <TableCell className="text-right font-mono text-muted-foreground">
        {item.speed ?? "—"}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(item)}
            data-testid={`button-edit-${item.id}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(item.id)}
            data-testid={`button-delete-${item.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function InventoryTable({ items, onEdit, onDelete, onReorder }: InventoryTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const isDraggingDisabled = !onReorder;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      onReorder?.(reorderedItems);
    }
  };
  return (
    <div className="rounded-md border">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="font-medium">Item Name</TableHead>
              <TableHead className="text-right font-medium">Available Quantity</TableHead>
              <TableHead className="text-right font-medium">Flow (m³/h)</TableHead>
              <TableHead className="text-right font-medium">Power (W)</TableHead>
              <TableHead className="text-right font-medium">Weight (kg)</TableHead>
              <TableHead className="text-right font-medium">Speed (rpm)</TableHead>
              <TableHead className="text-center font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No items in inventory
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((item) => (
                  <SortableRow
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isDraggingDisabled={isDraggingDisabled}
                  />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
