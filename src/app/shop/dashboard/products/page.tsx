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
import { Input } from "@/components/ui/input"
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
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// 🧾 Product Schema
export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    quantity: z.number(),
    sku: z.string().nullable(),
    category: z.string().nullable(),
    isActive: z.boolean(),
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

// Drawer for product details
function ProductDrawer({ product }: { product: z.infer<typeof productSchema> }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">{product.name}</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{product.name}</DrawerTitle>
                    <DrawerDescription>{product.description || "No description available."}</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <div className="text-sm mb-2">Category: {product.category || "N/A"}</div>
                    <div className="text-sm mb-2">SKU: {product.sku || "N/A"}</div>
                    <div className="text-sm mb-2">Quantity: {product.quantity}</div>
                    <div className="text-sm mb-2">Price: ₹{product.price}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">This drawer shows detailed info for the selected product.</div>
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
const columns: ColumnDef<z.infer<typeof productSchema>>[] = [
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
    { accessorKey: "name", header: "Product Name", cell: ({ row }) => <ProductDrawer product={row.original} /> },
    { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="outline">{row.original.category || "N/A"}</Badge> },
    {
        accessorKey: "price",
        header: "Price (₹) per unit",
        cell: ({ row }) => (
            <div className="h-10 w-24 text-center dark:bg-zinc-800 rounded-lg px-2 flex items-center justify-center font-medium dark:text-white dark:hover:bg-zinc-700 transition-colors">
                ₹{row.original.price}
            </div>
        ),
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ row }) => (
            <div className="h-10 w-24 text-center dark:bg-zinc-800 rounded-lg px-2 flex items-center justify-center font-medium dark:text-white dark:hover:bg-zinc-700 transition-colors">
                {row.original.quantity}
            </div>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="outline" className="flex items-center gap-1">
                {row.original.isActive ? <IconCircleCheckFilled className="fill-green-500" /> : <IconLoader />}
                {row.original.isActive ? "Available" : "Unavailable"}
            </Badge>
        ),
    },
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
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

// Draggable row
function DraggableRow({ row }: { row: Row<z.infer<typeof productSchema>> }) {
    const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
    return (
        <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
            {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
        </TableRow>
    )
}

// Main table
export function ProductTable() {
    const [rows, setRows] = React.useState<z.infer<typeof productSchema>[]>([])
    const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [loading, setLoading] = React.useState(true)
    const [openDialog, setOpenDialog] = React.useState(false)
    const [newProduct, setNewProduct] = React.useState({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        sku: "",
        categoryId: 0,
        isActive: true,
    })
    const [createLoading, setCreateLoading] = React.useState(false)

    // Fetch products and categories
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [resShop, resCategories] = await Promise.all([
                    fetch("http://localhost:5000/api/shop/me", { credentials: "include" }),
                    fetch("http://localhost:5000/api/category")
                ])

                const dataShop = await resShop.json()
                const dataCategories = await resCategories.json()

                const dataProducts = dataShop.shop?.products || []

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parsedProducts = dataProducts.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    quantity: p.quantity,
                    sku: p.sku,
                    category: p.category?.name || null,
                    isActive: !!p.isActive,
                }))

                setRows(parsedProducts)
                setCategories(dataCategories)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
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

    const handleCreateProduct = async () => {
        setCreateLoading(true)
        try {
            const res = await fetch("http://localhost:5000/api/product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct),
                credentials: "include",
            })

            if (!res.ok) throw new Error("Failed to create product")
            const data = await res.json()
            const created = data.product

            const newRow = {
                id: created.id,
                name: created.name,
                description: created.description,
                price: created.price,
                quantity: created.quantity,
                sku: created.sku,
                category: categories.find(c => c.id === created.categoryId)?.name || null,
                isActive: created.isActive,
            }

            setRows(prev => [...prev, newRow])
            toast.success("Product created successfully!")
            setOpenDialog(false)
            setNewProduct({
                name: "",
                description: "",
                price: 0,
                quantity: 0,
                sku: "",
                categoryId: 0,
                isActive: true,
            })
        } catch (err) {
            console.error(err)
            toast.error("Failed to create product")
        } finally {
            setCreateLoading(false)
        }
    }

    if (loading) return <div className="text-center mt-3">Loading products...</div>

    return (
        <div className="w-full p-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Products</h2>

                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconPlus className="mr-1" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create Product</DialogTitle>
                            <DialogDescription>
                                Fill the details to add a new product.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 py-2">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Product name"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Product description"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    type="text"
                                    id="price"
                                    value={isNaN(newProduct.price) ? "" : newProduct.price}
                                    onChange={e =>
                                        setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))
                                    }
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    type="text"
                                    id="quantity"
                                    value={isNaN(newProduct.quantity) ? "" : newProduct.quantity}
                                    onChange={e =>
                                        setNewProduct(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))
                                    }
                                />
                            </div>

                            {/* SKU input (read-only) */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="sku">SKU</Label>
                                <Input
                                    id="sku"
                                    placeholder="Stock Keeping Unit"
                                    value={newProduct.sku}
                                    readOnly
                                    className="bg-gray-100 text-center"
                                />
                            </div>

                            {/* Category select */}
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={newProduct.categoryId ? newProduct.categoryId.toString() : ""}
                                    onValueChange={val => {
                                        const categoryId = parseInt(val)
                                        const categoryName = categories.find(c => c.id === categoryId)?.name || ""
                                        // Generate SKU automatically
                                        const randomNumber = Math.floor(1000 + Math.random() * 9000)
                                        const newSku = `${categoryName.slice(0, 3).toUpperCase()}-${randomNumber}`

                                        setNewProduct(prev => ({
                                            ...prev,
                                            categoryId,
                                            sku: newSku
                                        }))
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCreateProduct} disabled={createLoading}>
                                {createLoading && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                                {createLoading ? "Creating..." : "Create"}
                            </Button>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
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

export default ProductTable
