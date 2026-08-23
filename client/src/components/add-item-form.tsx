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

const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity must be at least 0"),
  flow: z.coerce.number().min(0, "Flow must be a positive number"),
  description: z.string().optional(),
  power: z.coerce.number().min(0).optional().or(z.literal("")),
  weight: z.coerce.number().min(0).optional().or(z.literal("")),
  speed: z.coerce.number().min(0).optional().or(z.literal("")),
});

type AddItemFormValues = z.infer<typeof addItemSchema>;

interface AddItemFormProps {
  onSubmit: (data: AddItemFormValues) => void;
  defaultValues?: Partial<AddItemFormValues>;
}

export function AddItemForm({ onSubmit, defaultValues }: AddItemFormProps) {
  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: defaultValues || {
      name: "",
      quantity: 0,
      flow: 0,
      description: "",
      power: "",
      weight: "",
      speed: "",
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                onClick={() => form.reset()}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit">
                Add Item
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
