/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    KeyboardSensor,
    DragEndEvent,
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

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
import { IconDotsVertical, IconGripVertical } from "@tabler/icons-react";
import { Shop } from "@/types/shop";



// 🔹 Drag Handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id });

    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="cursor-grab text-muted-foreground"
        >
            <IconGripVertical size={18} />
        </Button>
    );
}

// 🔹 Draggable Row
function DraggableRow({ row }: { row: any }) {
    const { setNodeRef, transform, transition } = useSortable({
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
            {row.getVisibleCells().map((cell: any) => (
                <TableCell key={cell.id}>
                    {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                    )}
                </TableCell>
            ))}
        </TableRow>
    );
}

// 🟩 Shop Drawer
function ShopDrawer({ shop }: { shop: Shop }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="px-0 text-left text-foreground">
                    {shop.name}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{shop.name}</DrawerTitle>
                    <DrawerDescription>
                        Seller & shop information
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 space-y-2 text-sm">
                    <div><b>Owner:</b> {shop.owner.name}</div>
                    <div><b>Email:</b> {shop.contactEmail}</div>
                    <div><b>Phone:</b> {shop.contactNumber ?? "—"}</div>
                    <div><b>Address:</b> {shop.address}</div>
                    <div><b>Products:</b> {shop.products.length}</div>

                    <div>
                        <b>Status:</b>{" "}
                        <Badge variant={shop.isActive ? "default" : "secondary"}>
                            {shop.isActive ? "Active" : "Inactive"}
                        </Badge>
                    </div>

                    {shop.description && (
                        <>
                            <Separator className="my-4" />
                            <div>
                                <b>Description:</b>
                                <p className="text-muted-foreground">
                                    {shop.description}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <DrawerFooter>
                    <Button>Edit Shop</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

// 🧭 MAIN TABLE
export default function ShopTable() {
    const [rows, setRows] = React.useState<Shop[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchShops() {
            try {
                const res = await fetch("http://localhost:5000/api/shop", {
                    credentials: "include",
                });
                if (!res.ok) throw new Error("Failed to fetch shops");
                const data = await res.json();
                setRows(data.shops || data); // data.shops if it's the wrapped response, or just data if it's the array
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchShops();
    }, []);

    const columns: ColumnDef<Shop>[] = [
        {
            id: "drag",
            header: () => null,
            cell: ({ row }) => <DragHandle id={row.original.id} />,
        },
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) =>
                        row.toggleSelected(!!value)
                    }
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Shop Name",
            cell: ({ row }) => <ShopDrawer shop={row.original} />,
        },
        {
            id: "owner",
            header: "Seller",
            cell: ({ row }) => row.original.owner.name,
        },
        {
            accessorKey: "contactEmail",
            header: "Email",
        },
        {
            id: "products",
            header: "Products",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.products.length}
                </Badge>
            ),
        },
        {
            id: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={row.original.isActive ? "default" : "destructive"}
                >
                    {row.original.isActive ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: () => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <IconDotsVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                        <DropdownMenuItem>Edit Shop</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Deactivate
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableRowSelection: true,
    });

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setRows((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    }

    if (loading) {
        return <div className="text-center mt-4">Loading shops...</div>;
    }

    return (
        <div className="w-full p-4">
            <h2 className="text-xl font-semibold mb-4">Sellers / Shops</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={rows.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((group) => (
                                <TableRow key={group.id}>
                                    {group.headers.map((header) => (
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
                            {table.getRowModel().rows.map((row) => (
                                <DraggableRow key={row.id} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </SortableContext>
            </DndContext>
        </div>
    );
}
