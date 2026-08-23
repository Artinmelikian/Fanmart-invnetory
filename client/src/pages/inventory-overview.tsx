import { useState, useMemo } from "react";
import { InventoryTable, InventoryItem } from "@/components/inventory-table";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Package, AlertTriangle, Boxes, Plus, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Item } from "@shared/schema";

export default function InventoryOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "Item deleted",
        description: "The item has been removed from inventory.",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (itemIds: number[]) => {
      await apiRequest("POST", "/api/items/reorder", { itemIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reorder items.",
        variant: "destructive",
      });
    },
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  const isFiltered = searchQuery.trim().length > 0;

  const totalItems = items.length;
  const totalStock = items.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowStockCount = items.filter((item) => Number(item.quantity) < 5).length;

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      deleteMutation.mutate(itemToDelete);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setLocation(`/edit-item/${item.id}`);
  };

  const handleReorder = (reorderedItems: Item[]) => {
    const itemIds = reorderedItems.map((item) => item.id);
    reorderMutation.mutate(itemIds);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your stock and track inventory levels
          </p>
        </div>
        <Link href="/add-item">
          <Button data-testid="button-add-item">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          testId="text-total-items"
        />
        <StatsCard
          title="Total Stock"
          value={totalStock}
          icon={Boxes}
          testId="text-total-stock"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          testId="text-low-stock"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
      </div>

      <InventoryTable
        items={isFiltered ? filteredItems : items}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReorder={isFiltered ? undefined : handleReorder}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
