import { AddItemForm } from "@/components/add-item-form";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertItem } from "@shared/schema";

export default function AddItem() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const addItemMutation = useMutation({
    mutationFn: async (data: InsertItem) => {
      return await apiRequest("POST", "/api/items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Success",
        description: "Item added to inventory.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    addItemMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Add New Item</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the details of the item to add to your inventory
        </p>
      </div>

      <AddItemForm onSubmit={handleSubmit} />
    </div>
  );
}
