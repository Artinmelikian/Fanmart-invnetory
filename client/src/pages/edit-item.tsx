import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Item, UpdateItem } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const editItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity must be at least 0"),
  flow: z.coerce.number().min(0, "Flow must be a positive number"),
  description: z.string().optional(),
  power: z.coerce.number().min(0).optional().or(z.literal("")),
  weight: z.coerce.number().min(0).optional().or(z.literal("")),
  speed: z.coerce.number().min(0).optional().or(z.literal("")),
});

type EditItemFormValues = z.infer<typeof editItemSchema>;

export default function EditItem() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const itemId = parseInt(params.id || "0");

  const { data: item, isLoading } = useQuery<Item>({
    queryKey: ["/api/items", itemId],
    queryFn: async () => {
      const response = await fetch(`/api/items/${itemId}`);
      if (!response.ok) throw new Error("Failed to fetch item");
      return response.json();
    },
    enabled: !isNaN(itemId) && itemId > 0,
  });

  const updateItemMutation = useMutation({
    mutationFn: async (data: UpdateItem) => {
      return await apiRequest("PATCH", `/api/items/${itemId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/items", itemId] });
      toast({
        title: "Success",
        description: "Item updated successfully.",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemSchema),
    values: item ? {
      name: item.name,
      quantity: item.quantity,
      flow: item.flow,
      description: item.description || "",
      power: item.power ?? "",
      weight: item.weight ?? "",
      speed: item.speed ?? "",
    } : undefined,
  });

  const handleSubmit = (data: EditItemFormValues) => {
    const submitData: UpdateItem = {
      name: data.name,
      quantity: data.quantity,
      flow: data.flow,
      description: data.description || undefined,
      power: data.power === "" ? undefined : data.power,
      weight: data.weight === "" ? undefined : data.weight,
      speed: data.speed === "" ? undefined : data.speed,
    };
    updateItemMutation.mutate(submitData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading item...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Item not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Edit Item</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update the details of the item in your inventory
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Required Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Item Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Centrifugal Pump Model A"
                            {...field}
                            data-testid="input-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            data-testid="input-quantity"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flow *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            {...field}
                            data-testid="input-flow"
                          />
                        </FormControl>
                        <FormDescription>in m³/h</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Optional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional details about the item..."
                            {...field}
                            data-testid="input-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Optional"
                            {...field}
                            data-testid="input-power"
                          />
                        </FormControl>
                        <FormDescription>in W</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Optional"
                            {...field}
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormDescription>in kg</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="speed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Optional"
                            {...field}
                            data-testid="input-speed"
                          />
                        </FormControl>
                        <FormDescription>in rpm</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-submit">
                  Update Item
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
