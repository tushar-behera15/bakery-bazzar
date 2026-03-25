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
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"



// 🧾 Payment Schema
export const paymentSchema = z.object({
    id: z.number(),
    orderId: z.number(),
    method: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI", "WALLET"]),
    status: z.enum(["PENDING", "SUCCESS", "COMPLETED", "FAILED", "REFUNDED"]),
    amount: z.number(),
    paidAt: z.string().nullable(),
    createdAt: z.string(),
    order: z.object({
        id: z.number(),
        status: z.string(),
        items: z.array(z.object({
            id: z.number(),
            product: z.object({
                name: z.string(),
            }),
        })),
    }).optional(),
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
                    <DrawerDescription>Showing payment details for your order.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2 font-semibold">Products:</div>
                    <ul className="text-sm mb-4 list-disc list-inside space-y-1">
                        {payment.order?.items.map((item) => (
                            <li key={item.id}>{item.product.name}</li>
                        )) || <li>No products found</li>}
                    </ul>
                    <div className="text-sm mb-2">Order ID: {payment.orderId}</div>

                    <div className="text-sm mb-2">Amount: ₹{payment.amount}</div>
                    <div className="text-sm mb-2">Method: {payment.method}</div>
                    <div className="text-sm mb-2">Status: {payment.status}</div>
                    <div className="text-sm mb-2">Paid At: {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy HH:mm") : "-"}</div>
                    <div className="text-sm mb-2">Created At: {format(new Date(payment.createdAt), "MMM d, yyyy HH:mm")}</div>
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
    {
        id: "products",
        header: "Product(s)",
        cell: ({ row }) => {
            const items = row.original.order?.items || []
            if (items.length === 0) return "No products"
            const firstName = items[0].product.name
            return items.length > 1 ? `${firstName} + ${items.length - 1} more` : firstName
        }
    },


    { accessorKey: "amount", header: "Amount (₹)", cell: ({ row }) => row.original.amount },
    { accessorKey: "method", header: "Method", cell: ({ row }) => row.original.method },
    {
        accessorKey: "status", header: "Status", cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1">
                {row.original.status === "COMPLETED" || row.original.status === "SUCCESS" || row.original.status === "REFUNDED" ? (
                    <IconCircleCheckFilled className="fill-green-500" />
                ) : row.original.status === "PENDING" || row.original.status === "FAILED" ? (
                    <IconLoader className={row.original.status === "PENDING" ? "animate-spin" : ""} />
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
    const { data: payments = [], isLoading: loading, isError, error } = useQuery<(z.infer<typeof paymentSchema>)[], Error>({
        queryKey: ["user-payments"],
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

            // Step 2: Fetch payments for this user
            // Endpoint added to backend: GET /api/payments?buyerId=...
            return await api.get<(z.infer<typeof paymentSchema>)[]>(`/payments?buyerId=${userData.user.id}`, {
                credentials: "include"
            })

        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    React.useEffect(() => {
        if (isError && error) {
            toast.error(error.message || "Failed to load your payments")
        }
    }, [isError, error])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <IconLoader className="animate-spin w-8 h-8 text-primary" />
                <span className="text-muted-foreground font-medium animate-pulse">Fetching your payments...</span>
            </div>
        )
    }

    return <PaymentsTable data={payments} />
}
