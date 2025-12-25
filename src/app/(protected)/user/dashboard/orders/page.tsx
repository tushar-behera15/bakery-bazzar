"use client"

import * as React from "react"
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconCircleCheckFilled,
    IconGripVertical,
    IconLoader,
    IconDotsVertical,
    IconPlus,
} from "@tabler/icons-react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

// 🧾 Order Schema
export const orderSchema = z.object({
    id: z.number(),
    buyer: z.string(),
    totalAmount: z.number(),
    status: z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]),
    itemsCount: z.number(),
    createdAt: z.string(),
})

// 🧁 Dummy Orders Data
const orderData: z.infer<typeof orderSchema>[] = [
    { id: 1287, buyer: "Rohit Sharma", totalAmount: 1250, status: "PENDING", itemsCount: 3, createdAt: "2025-10-01" },
    { id: 1288, buyer: "Neha Patel", totalAmount: 500, status: "PAID", itemsCount: 1, createdAt: "2025-10-02" },
    { id: 1289, buyer: "Amit Yadav", totalAmount: 3200, status: "SHIPPED", itemsCount: 5, createdAt: "2025-10-03" },
    { id: 1290, buyer: "Kiran Mehta", totalAmount: 750, status: "DELIVERED", itemsCount: 2, createdAt: "2025-10-04" },
    { id: 1291, buyer: "Priya Nair", totalAmount: 1200, status: "CANCELLED", itemsCount: 4, createdAt: "2025-10-05" },
]

// Drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground hover:bg-transparent">
            <IconGripVertical />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

// Drawer for order details
function OrderDrawer({ order }: { order: z.infer<typeof orderSchema> }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">{`${order.id}`}</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{`${order.id}`}</DrawerTitle>
                    <DrawerDescription>Showing details for this order.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Buyer: {order.buyer}</div>
                    <div className="text-sm mb-2">Items Count: {order.itemsCount}</div>
                    <div className="text-sm mb-2">Total Amount: ₹{order.totalAmount}</div>
                    <div className="text-sm mb-2">Status: {order.status}</div>
                    <div className="text-sm mb-2">Created At: {order.createdAt}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">You can manage this order from this drawer.</div>
                </div>
                <DrawerFooter className="flex gap-2">
                    <Button>Update</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

// Table columns
const columns: ColumnDef<z.infer<typeof orderSchema>>[] = [
    { id: "drag", header: () => null, cell: ({ row }) => <DragHandle id={row.original.id} /> },
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
            </div>
        ),
    },
    { accessorKey: "id", header: "Order ID", cell: ({ row }) => <OrderDrawer order={row.original} /> },
    { accessorKey: "buyer", header: "Buyer", cell: ({ row }) => row.original.buyer },
    { accessorKey: "itemsCount", header: "Items", cell: ({ row }) => row.original.itemsCount },
    { accessorKey: "totalAmount", header: "Total (₹)", cell: ({ row }) => row.original.totalAmount },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1">
                {row.original.status === "PAID" || row.original.status === "DELIVERED" ? (
                    <IconCircleCheckFilled className="fill-green-500" />
                ) : row.original.status === "PENDING" || row.original.status === "SHIPPED" ? (
                    <IconLoader />
                ) : null}
                {row.original.status}
            </Badge>
        )
    },
    { accessorKey: "createdAt", header: "Created At", cell: ({ row }) => row.original.createdAt },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <IconDotsVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Cancel Order</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<z.infer<typeof orderSchema>> }) {
    const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
    return (
        <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    )
}

// Main Orders Table
export function OrdersTable({ data }: { data: z.infer<typeof orderSchema>[] }) {
    const [rows, setRows] = React.useState(data)
    const [sorting, setSorting] = React.useState<SortingState>([])

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    )

    const table = useReactTable({
        data: rows,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            setRows(rows => {
                const oldIndex = rows.findIndex(r => r.id === active.id)
                const newIndex = rows.findIndex(r => r.id === over.id)
                return arrayMove(rows, oldIndex, newIndex)
            })
        }
    }

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Orders</h2>
                <Button variant="outline" size="sm"><IconPlus /> Add Order</Button>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]} sensors={sensors}>
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
                            {table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    )
}

// Default export
export default function OrdersDataTable() {
    return <OrdersTable data={orderData} />
}
