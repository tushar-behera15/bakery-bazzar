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
import { IconGripVertical, IconDotsVertical, IconPlus } from "@tabler/icons-react"
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

// 🧾 Category type
export interface Category {
    id: number
    name: string
    productCount: number
    createdAt: string
    updatedAt: string
}

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

// Drawer for category details
function CategoryDrawer({ category }: { category: Category }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">{category.name}</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{category.name}</DrawerTitle>
                    <DrawerDescription>Showing details for this category.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Category ID: {category.id}</div>
                    <div className="text-sm mb-2">Number of Products: {category.productCount}</div>
                    <div className="text-sm mb-2">Created At: {category.createdAt}</div>
                    <div className="text-sm mb-2">Updated At: {category.updatedAt}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">You can manage products under this category from this drawer.</div>
                </div>
                <DrawerFooter className="flex gap-2">
                    <Button>Edit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

// Table columns
const columns: ColumnDef<Category>[] = [
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
    { accessorKey: "name", header: "Category Name", cell: ({ row }) => <CategoryDrawer category={row.original} /> },
    { accessorKey: "productCount", header: "Products", cell: ({ row }) => <Badge variant="secondary">{row.original.productCount}</Badge> },
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View Products</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<Category> }) {
    const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
    return (
        <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    )
}

// Main Categories Table
export function CategoriesTable() {
    const [rows, setRows] = React.useState<Category[]>([])
    const [loading, setLoading] = React.useState(true)
    const [sorting, setSorting] = React.useState<SortingState>([])

    React.useEffect(() => {
        // Fetch categories from API
        async function fetchCategories() {
            try {
                const res = await fetch("http://localhost:5000/api/category") // your API endpoint
                if (!res.ok) throw new Error("Failed to fetch categories")
                const data: Category[] = await res.json()
                setRows(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

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

    if (loading) return <div>Loading categories...</div>

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Categories</h2>
                <Button variant="outline" size="sm"><IconPlus /> Add Category</Button>
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
export default CategoriesTable
