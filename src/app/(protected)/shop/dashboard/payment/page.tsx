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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { format } from "date-fns"

// 🧾 Payment Schema
export const paymentSchema = z.object({
    id: z.number(),
    buyer: z.string(),
    orderId: z.number(),
    method: z.string(),
    status: z.string(),
    amount: z.number(),
    paidAt: z.string().nullable().optional(),
    createdAt: z.string(),
    order: z.any().optional(),
})

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

// Drawer for payment details
function PaymentDrawer({ payment }: { payment: z.infer<typeof paymentSchema> }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">{`${payment.id}`}</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{`${payment.id}`}</DrawerTitle>
                    <DrawerDescription>Showing payment details for {payment.buyer}.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Buyer: {payment.buyer}</div>
                    <div className="text-sm mb-2 font-medium">
                        Products: {payment.order?.items?.map((i: any) => i.product?.name).join(", ") || "Unknown"}
                    </div>
                    <div className="text-sm mb-2 opacity-70 italic text-[10px]">Order ID: {payment.orderId}</div>
                    <div className="text-sm mb-2">Amount: ₹{payment.amount}</div>
                    <div className="text-sm mb-2">Method: {payment.method}</div>
                    <div className="text-sm mb-2">Status: {payment.status}</div>
                    <div className="text-sm mb-2">Paid At: {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy • hh:mm a") : "-"}</div>
                    <div className="text-sm mb-2">Created At: {format(new Date(payment.createdAt), "MMM d, yyyy • hh:mm a")}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">You can manage this payment from this drawer.</div>
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
const columns: ColumnDef<z.infer<typeof paymentSchema>>[] = [
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
    { accessorKey: "id", header: "Payment ID", cell: ({ row }) => <PaymentDrawer payment={row.original} /> },
    { accessorKey: "buyer", header: "Buyer", cell: ({ row }) => row.original.buyer },
    { 
        id: "products", 
        header: "Product(s)", 
        cell: ({ row }) => {
            const items = row.original.order?.items || []
            if (items.length === 0) return <span className="text-muted-foreground italic">No products</span>
            const firstProduct = items[0]?.product?.name || "Unknown Product"
            const extraCount = items.length - 1
            return (
                <span className="font-medium text-foreground text-sm">
                    {firstProduct} {extraCount > 0 && <span className="text-muted-foreground font-normal"> (+{extraCount} more)</span>}
                </span>
            )
        } 
    },
    { accessorKey: "amount", header: "Amount (₹)", cell: ({ row }) => row.original.amount },
    { accessorKey: "method", header: "Method", cell: ({ row }) => row.original.method },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1">
                {row.original.status === "COMPLETED" || row.original.status === "REFUNDED" ? (
                    <IconCircleCheckFilled className="fill-green-500" />
                ) : row.original.status === "PENDING" || row.original.status === "FAILED" ? (
                    <IconLoader />
                ) : null}
                {row.original.status}
            </Badge>
        )
    },
    { accessorKey: "paidAt", header: "Paid At", cell: ({ row }) => row.original.paidAt ? format(new Date(row.original.paidAt), "MMM d, yyyy") : "-" },
    { accessorKey: "createdAt", header: "Created At", cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy") },
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
                    <DropdownMenuItem variant="destructive">Refund</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<z.infer<typeof paymentSchema>> }) {
    const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
    return (
        <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    )
}

// Main Payments Table
export function PaymentsTable({ data }: { data: z.infer<typeof paymentSchema>[] }) {
    const [rows, setRows] = React.useState(data)
    const [sorting, setSorting] = React.useState<SortingState>([])

    // Sync rows when data changes
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
                <h2 className="text-xl font-semibold">Payments</h2>
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
export default function PaymentsDataTable() {
    const { data: payments = [], isLoading, isError } = useQuery({
        queryKey: ["shop-payments"],
        queryFn: async () => {
            const res = await api.get<any[]>("/payments/shop/me", { credentials: "include" })
            return res.map(p => ({
                id: p.id,
                buyer: p.order?.buyer?.name || `User #${p.order?.buyerId}`,
                orderId: p.orderId,
                method: p.method,
                status: p.status,
                amount: p.amount,
                paidAt: p.paidAt,
                createdAt: p.createdAt,
                order: p.order
            })) as z.infer<typeof paymentSchema>[]
        },
    })

    if (isLoading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <IconLoader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px] font-black opacity-40">Syncing Transactions...</p>
        </div>
    )

    if (isError) return (
        <div className="h-[60vh] flex items-center justify-center">
            <p className="text-destructive font-medium border border-destructive/20 bg-destructive/5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">Cloud sync failed</p>
        </div>
    )

    return <PaymentsTable data={payments} />
}