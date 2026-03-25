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
import { api } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"


// 🧾 Order Schema (Updated to match backend response)
export const orderSchema = z.object({
    id: z.number(),
    buyerId: z.number().optional(),
    totalAmount: z.number(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "SHIPPED", "DELIVERED", "PAID"]),
    itemsCount: z.number().optional(),
    items: z.array(z.any()).optional(),
    createdAt: z.string(),
})

type OrderType = z.infer<typeof orderSchema>

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
function OrderDrawer({ order }: { order: OrderType }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all">
                    #{order.id}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Order #{order.id}</DrawerTitle>
                    <DrawerDescription>Detailed summary of your purchase.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-muted/50">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Items Count</p>
                            <p className="text-lg font-bold">{order.itemsCount || order.items?.length || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] uppercase font-bold text-primary mb-1">Total Amount</p>
                            <p className="text-lg font-bold">₹{order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border">
                        <p className="text-sm font-medium">Status</p>
                        <Badge variant="outline" className="font-bold">{order.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border">
                        <p className="text-sm font-medium">Placed On</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), "PPP")}</p>
                    </div>
                    <Separator />
                    <p className="text-xs text-center text-muted-foreground">Order ID: {order.id}</p>
                </div>
                <DrawerFooter className="flex gap-2">
                    <DrawerClose asChild>
                        <Button className="w-full rounded-xl">Close Details</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

// Table columns
const columns: ColumnDef<OrderType>[] = [
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
    {
        accessorKey: "itemsCount",
        header: "Items",
        cell: ({ row }) => row.original.itemsCount || row.original.items?.length || 0
    },
    {
        accessorKey: "totalAmount",
        header: "Total (₹)",
        cell: ({ row }) => `₹${row.original.totalAmount.toFixed(2)}`
    },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1.5 font-medium py-1">
                {row.original.status === "PAID" || row.original.status === "DELIVERED" || row.original.status === "COMPLETED" ? (
                    <IconCircleCheckFilled className="fill-green-500 w-4 h-4" />
                ) : row.original.status === "PENDING" || row.original.status === "SHIPPED" ? (
                    <IconLoader className="animate-spin w-4 h-4" />
                ) : null}
                {row.original.status}
            </Badge>
        )
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy")
    },
    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <IconDotsVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-primary/10">
                    <DropdownMenuItem className="cursor-pointer">Track Order</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="cursor-pointer">Cancel Order</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<OrderType> }) {
    const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
    return (
        <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className="hover:bg-muted/30 transition-colors">
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    )
}

// Main Orders Table
export function OrdersTable({ data }: { data: OrderType[] }) {
    const [rows, setRows] = React.useState(data)
    const [sorting, setSorting] = React.useState<SortingState>([])

    React.useEffect(() => {
        setRows(data)
    }, [data])

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
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
                    <p className="text-muted-foreground">Track and manage your recent bakery purchases.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold border border-primary/20">
                        {rows.length} Total Orders
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-sm shadow-xl overflow-hidden">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]} sensors={sensors}>
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map(headerGroup => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent border-primary/10">
                                    {headerGroup.headers.map(header => (
                                        <TableHead key={header.id} className="text-xs font-bold uppercase tracking-wider py-4">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            <SortableContext items={rows.map(r => r.id)} strategy={verticalListSortingStrategy}>
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 opacity-60">
                                                <div className="p-4 rounded-full bg-muted">
                                                    <IconLoader className="w-8 h-8" />
                                                </div>
                                                <p className="font-medium">No orders found.</p>
                                                <p className="text-sm">You haven&apos;t placed any orders yet.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </SortableContext>
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
        </div>
    )
}

// Default export
export default function OrdersDataTable() {
    const { data: orders = [], isLoading: loading, isError, error } = useQuery<OrderType[], Error>({
        queryKey: ["user-orders"],
        queryFn: async () => {
            // Step 1: Get current user info
            const userRes = await fetch("http://localhost:5000/api/auth/me", {
                credentials: "include"
            })
            
            if (!userRes.ok) throw new Error("Failed to fetch user session")
            const userData = await userRes.json()
            
            if (!userData.user?.id) {
                throw new Error("User session not found")
            }

            // Step 2: Fetch orders for this user using query parameter
            return await api.get<OrderType[]>(`/orders?buyerId=${userData.user.id}`, {
                credentials: "include"
            })
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    React.useEffect(() => {
        if (isError && error) {
            toast.error(error.message || "Failed to load your orders")
        }
    }, [isError, error])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <IconLoader className="animate-spin w-8 h-8 text-primary" />
                <span className="text-muted-foreground font-medium animate-pulse">Fetching your orders...</span>
            </div>
        )
    }

    return <OrdersTable data={orders} />
}
