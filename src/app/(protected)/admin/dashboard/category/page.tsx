"use client";

import * as React from "react";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    IconGripVertical,
    IconDotsVertical,
    IconPlus,
} from "@tabler/icons-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    HeaderGroup,
    Header,
} from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// 🧾 Category type
export interface Category {
    id: number;
    name: string;
    productCount: number;
    createdAt: string;
    updatedAt: string;
}

// 🟦 Drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id });
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-transparent"
        >
            <IconGripVertical />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    );
}

// 🟩 Drawer for category details
function CategoryDrawer({ category }: { category: Category }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="text-foreground w-fit px-0 text-left"
                >
                    {category.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{category.name}</DrawerTitle>
                    <DrawerDescription>
                        Showing details for this category.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Category ID: {category.id}</div>
                    <div className="text-sm mb-2">
                        Number of Products: {category.productCount}
                    </div>
                    <div className="text-sm mb-2">Created At: {category.createdAt}</div>
                    <div className="text-sm mb-2">Updated At: {category.updatedAt}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">
                        You can manage products under this category from this drawer.
                    </div>
                </div>
                <DrawerFooter className="flex gap-2">
                    <Button>Edit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

// 🟦 Draggable row
function DraggableRow({ row }: { row: Row<Category> }) {
    const { transform, transition, setNodeRef } = useSortable({
        id: row.original.id,
    });
    return (
        <TableRow
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
}

// 🧭 Main Component
export function CategoriesTable() {
    const queryClient = useQueryClient();
    const [rows, setRows] = React.useState<Category[]>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newCategory, setNewCategory] = React.useState("");

    const { data: categoriesData, isLoading: loading } = useQuery<Category[]>({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            return await api.get<Category[]>("/category", { credentials: "include" });
        },
        staleTime: 1000 * 60 * 5,
    });

    React.useEffect(() => {
        if (categoriesData) {
            setRows(categoriesData);
        }
    }, [categoriesData]);

    const createMutation = useMutation({
        mutationFn: async (name: string) => {
            return await api.post<Category>("/category", { name }, { credentials: "include" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category created successfully!");
            setNewCategory("");
            setOpenDialog(false);
        },
        onError: (err) => {
            console.error(err);
            toast.error("Failed to create category");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`/category/${id}`, { credentials: "include" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            toast.success("Category deleted successfully!");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Something went wrong while deleting category");
        }
    });

    // Sensors for DnD
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    );

    // Create Category
    async function handleCreateCategory() {
        if (!newCategory.trim()) return;
        createMutation.mutate(newCategory);
    }

    // Delete Category
    async function deleteCategory(id: number) {
        deleteMutation.mutate(id);
    }

    // Columns (use row from cell context for delete)
    const columns: ColumnDef<Category>[] = [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Category Name",
            cell: ({ row }) => <CategoryDrawer category={row.original} />,
        },
        {
            accessorKey: "productCount",
            header: "Products",
            cell: ({ row }) => (
                <Badge variant="secondary">{row.original.productCount}</Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                            <IconDotsVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => deleteCategory(row.original.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data: rows,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setRows((rows) => {
                const oldIndex = rows.findIndex((r) => r.id === active.id);
                const newIndex = rows.findIndex((r) => r.id === over.id);
                return arrayMove(rows, oldIndex, newIndex);
            });
        }
    }
    if (loading) return <div className="text-center mt-3">Loading categories...</div>;

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>

                {/* 🟢 Create Category Dialog */}
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconPlus className="mr-1" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Category</DialogTitle>
                            <DialogDescription>
                                Add a new category to organize your products.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                                id="categoryName"
                                placeholder="e.g. Cakes"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleCreateCategory}
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? "Creating..." : "Create"}
                            </Button>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
                sensors={sensors}
            >
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<Category>) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: Header<Category, unknown>) => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <SortableContext
                            items={rows.map((r) => r.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {table
                                .getRowModel()
                                .rows.map((row) => (
                                    <DraggableRow key={row.id} row={row} />
                                ))}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    );
}

export default CategoriesTable;
