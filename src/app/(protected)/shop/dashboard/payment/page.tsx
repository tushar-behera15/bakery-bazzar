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

// 🧾 Payment Schema
export const paymentSchema = z.object({
    id: z.number(),
    buyer: z.string(),
    orderId: z.number(),
    method: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI", "WALLET", "PAYPAL"]),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
    amount: z.number(),
    paidAt: z.string().nullable(),
    createdAt: z.string(),
})

// 🧁 Dummy Payment Data
const paymentData: z.infer<typeof paymentSchema>[] = [
    { id: 98700, buyer: "Rohit Sharma", orderId: 1, method: "CREDIT_CARD", status: "PENDING", amount: 1250, paidAt: null, createdAt: "2025-10-01" },
    { id: 98701, buyer: "Neha Patel", orderId: 2, method: "UPI", status: "COMPLETED", amount: 500, paidAt: "2025-10-02", createdAt: "2025-10-02" },
    { id: 98702, buyer: "Amit Yadav", orderId: 3, method: "WALLET", status: "FAILED", amount: 3200, paidAt: null, createdAt: "2025-10-03" },
    { id: 98703, buyer: "Kiran Mehta", orderId: 4, method: "PAYPAL", status: "COMPLETED", amount: 750, paidAt: "2025-10-04", createdAt: "2025-10-04" },
    { id: 98704, buyer: "Priya Nair", orderId: 5, method: "DEBIT_CARD", status: "REFUNDED", amount: 1200, paidAt: "2025-10-05", createdAt: "2025-10-05" },
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
                    <div className="text-sm mb-2">Order ID: {payment.orderId}</div>
                    <div className="text-sm mb-2">Amount: ₹{payment.amount}</div>
                    <div className="text-sm mb-2">Method: {payment.method}</div>
                    <div className="text-sm mb-2">Status: {payment.status}</div>
                    <div className="text-sm mb-2">Paid At: {payment.paidAt ?? "-"}</div>
                    <div className="text-sm mb-2">Created At: {payment.createdAt}</div>
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
    { accessorKey: "orderId", header: "Order ID", cell: ({ row }) => row.original.orderId },
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
    { accessorKey: "paidAt", header: "Paid At", cell: ({ row }) => row.original.paidAt ?? "-" },
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
    return <PaymentsTable data={paymentData} />
}
