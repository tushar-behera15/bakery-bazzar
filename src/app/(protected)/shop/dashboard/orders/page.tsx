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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// 🧾 Order Schema (Updated to match backend response)
export const orderSchema = z.object({
    id: z.number(),
    buyerId: z.number().optional(),
    buyer: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
    }).optional(), // The backend now populates buyer object
    totalAmount: z.number(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED", "SHIPPED", "DELIVERED", "PAID"]),
    payment: z.object({
        method: z.string(),
        status: z.enum(["PENDING", "SUCCESS", "FAILED", "COMPLETED", "REFUNDED"]),
    }).optional(),
    paymentMethod: z.string().optional(),
    items: z.array(z.any()).optional(),
    itemsCount: z.number().optional(),
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
                <Button variant="link" className="text-foreground w-fit px-0 text-left">{`${order.id}`}</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Order #{order.id}</DrawerTitle>
                    <DrawerDescription>Showing details for this order.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Buyer: {order.buyer?.name || `User #${order.buyerId}`}</div>
                    <div className="text-sm mb-2">Items Count: {order.itemsCount || order.items?.length || 0}</div>
                    <div className="text-sm mb-2">Total Amount: ₹{order.totalAmount}</div>
                    <div className="text-sm mb-2">Status: {order.status}</div>
                    <div className="text-sm mb-2">Created At: {format(new Date(order.createdAt), "PPP")}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">You can manage this order from this drawer.</div>
                </div>
                <DrawerFooter className="flex gap-2">
                    <Button onClick={() => toast.success("Order update functionality coming soon!")}>Update</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
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
        accessorKey: "buyer",
        header: "Buyer",
        cell: ({ row }) => row.original.buyer?.name || `User #${row.original.buyerId}`
    },
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
            <Badge variant="outline" className="flex items-center gap-1">
                {row.original.status === "PAID" || row.original.status === "DELIVERED" || row.original.status === "COMPLETED" ? (
                    <IconCircleCheckFilled className="fill-green-500" />
                ) : row.original.status === "PENDING" || row.original.status === "SHIPPED" ? (
                    <IconLoader />
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
        id: "payment",
        header: "Payment",
        cell: ({ row }) => {
            const method = (row.original.payment?.method || row.original.paymentMethod || "UPI").toUpperCase();
            const isCash = method === "CASH";
            return (
                <Badge variant="outline" className={cn(
                    "font-black tracking-widest text-[10px] uppercase",
                    isCash ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                    {method}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const queryClient = useQueryClient();
            const [isApproving, setIsApproving] = React.useState(false);

            const approvePayment = async () => {
                setIsApproving(true);
                const promise = api.patch(`/orders/${row.original.id}/status`, { status: "PAID" });

                toast.promise(promise, {
                    loading: "Approving payment...",
                    success: () => {
                        queryClient.invalidateQueries({ queryKey: ["shop-orders"] });
                        setIsApproving(false);
                        return "Payment approved! Order marked as PAID.";
                    },
                    error: () => {
                        setIsApproving(false);
                        return "Failed to approve payment";
                    }
                });
            }

            const isCashPending = row.original.status === "PENDING" && 
                                 (row.original.payment?.method?.toUpperCase() === "CASH" || 
                                  row.original.paymentMethod?.toUpperCase() === "CASH");

            return (
                <div className="flex items-center gap-2">
                    {isCashPending && (
                        <Button 
                            size="sm" 
                            variant="default" 
                            disabled={isApproving}
                            className="bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest h-8 px-4 rounded-lg shadow-soft hover:shadow-premium transition-all disabled:opacity-50"
                            onClick={approvePayment}
                        >
                            {isApproving ? <IconLoader className="w-3 h-3 animate-spin mr-1" /> : "Approve"}
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <IconDotsVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => toast.info("Viewing order details...")}>View</DropdownMenuItem>
                            {isCashPending && (
                                <DropdownMenuItem onClick={approvePayment} className="text-green-600 font-bold">
                                    Approve Cash Payment
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                variant="destructive" 
                                onClick={() => toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
                                    loading: "Cancelling order...",
                                    success: "Order cancelled successfully!",
                                    error: "Failed to cancel order",
                                })}
                            >
                                Cancel Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<OrderType> }) {
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
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Orders</h2>

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
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map(row => <DraggableRow key={row.id} row={row} />)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    )
}

// Default export
export default function OrdersDataTable() {
    const { data: orders = [], isLoading: loading, isError, error } = useQuery<OrderType[], Error>({
        queryKey: ["shop-orders"],
        queryFn: async () => {
            // Step 1: Get the current shop info
            const shopRes = await api.get<{ shop: { id: number } }>("/shop/me", {
                credentials: "include"
            })

            if (!shopRes.shop?.id) {
                throw new Error("Shop not found")
            }

            // Step 2: Fetch orders for this shop
            return await api.get<OrderType[]>(`/orders/shop/${shopRes.shop.id}`, {
                credentials: "include"
            })
        },
        staleTime: 1000 * 60 * 5,
    })

    React.useEffect(() => {
        if (isError && error) {
            toast.error(error.message || "Failed to fetch orders. Please try again later.")
        }
    }, [isError, error])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <IconLoader className="animate-spin mr-2" />
                <span>Loading orders...</span>
            </div>
        )
    }

    return <OrdersTable data={orders} />
}
