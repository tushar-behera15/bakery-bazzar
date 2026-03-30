/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    HeaderGroup,
    Header,
    Row as TableRowType
} from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { z } from "zod"
import { cn } from "@/lib/utils"

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
import Image from "next/image"

// 🧾 Product Schema
export const productSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    stock_quantity: z.number(),
    low_stock_threshold: z.number(),
    sku: z.string().nullable(),
    category: z.string().nullable(),
    isActive: z.boolean(),
    image: z.string().nullable(),
})

// Drag handle
function DragHandle({ id }: { id: number }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground hover:bg-transparent">
            <IconGripVertical />
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
                    {product.image && (
                        <Image
                            src={product.image}
                            alt={product.name}
                            className="h-32 w-32 object-cover rounded mb-2"
                            width={100}
                            height={100}
                        />
                    )}
                    <div className="text-sm mb-2">Category: {product.category || "N/A"}</div>
                    <div className="text-sm mb-2">SKU: {product.sku || "N/A"}</div>
                    <div className="text-sm mb-2">Stock: {product.stock_quantity}</div>
                    <div className="text-sm mb-2">Low Stock Threshold: {product.low_stock_threshold}</div>
                    <div className="text-sm mb-2">Price: ₹{product.price}</div>
                    <Separator className="my-4" />
                    <div className="text-sm">This drawer shows detailed info for the selected product.</div>
                </div>
                <DrawerFooter>
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
    const queryClient = useQueryClient()
    const [rows, setRows] = React.useState<z.infer<typeof productSchema>[]>([])
    const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([])
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [openDialog, setOpenDialog] = React.useState(false)

    const initialProduct = {
        name: "",
        description: "",
        price: 0,
        stock_quantity: 0,
        low_stock_threshold: 10,
        sku: "",
        categoryId: 0,
        isActive: true,
        image: "",
        fileName: "",
        file: undefined as File | undefined, // Add file property
    }

    const [newProduct, setNewProduct] = React.useState<typeof initialProduct>(initialProduct)

    const { data: productsData, isLoading: loading } = useQuery({
        queryKey: ["shop-products"],
        queryFn: async () => {
            const [dataShop, dataCategories] = await Promise.all([
                api.get<{ shop: any }>("/shop/me", { credentials: "include" }),
                api.get<any[]>("/category")
            ]);

            setCategories(dataCategories);

            const dataProducts = dataShop.shop?.products || [];
            return dataProducts.map((p: any) => {
                const categoryObj = dataCategories.find((c: any) => c.id === p.categoryId)
                const categoryName = categoryObj?.name || "N/A"
                const imageUrl = p.images?.find((img: any) => img.isThumbnail)?.url || p.image || null;

                return {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    stock_quantity: p.stock_quantity,
                    low_stock_threshold: p.low_stock_threshold,
                    sku: p.sku,
                    category: categoryName,
                    isActive: !!p.isActive,
                    image: imageUrl,
                };
            });
        },
        staleTime: 1000 * 60 * 5,
    });

    React.useEffect(() => {
        if (productsData) {
            setRows(productsData);
        }
    }, [productsData]);

    const createMutation = useMutation({
        mutationFn: async (productData: any) => {
            // STEP 1: Create product
            const res = await api.post<{ newProduct: any }>("/product", productData, { credentials: "include" });
            const createdProduct = res.newProduct;

            // STEP 2: Upload image
            const formData = new FormData()
            formData.append("image", newProduct.file!)
            formData.append("productId", String(createdProduct.id))
            formData.append("isThumbnail", "true")

            const uploadRes = await api.post<{ productImage: { url: string } }>("/upload/image", formData, { credentials: "include", headers: {} }); // Let fetch handle multipart headers
            return { ...createdProduct, image: uploadRes.productImage.url };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-products"] });
            toast.success("Product created successfully!");
            setOpenDialog(false);
            setNewProduct(initialProduct);
        },
        onError: (err) => {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Failed to create product");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            return await api.delete(`/product/${id}`, { credentials: "include" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shop-products"] });
            toast.success("Product deleted successfully!");
        },
        onError: (err) => {
            console.error(err);
            toast.error("Something went wrong while deleting product");
        }
    });

    const handleCreateProduct = async () => {
        if (!newProduct.file) {
            toast.error("Please select an image")
            return
        }
        const productData = { ...newProduct, image: "" }
        createMutation.mutate(productData)
    }

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const preview = URL.createObjectURL(file)
        setNewProduct(prev => ({
            ...prev,
            image: preview,
            file,
            fileName: file.name,
        }))
    }

    async function deleteProduct(id: number) {
        deleteMutation.mutate(id)
    }

    React.useEffect(() => {
        if (!openDialog) setNewProduct(initialProduct)
    }, [openDialog])

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
        {
            accessorKey: "image", header: "Image", cell: ({ row }) => (
                row.original.image ? (
                    <Image src={row.original.image} alt={row.original.name} className="h-12 w-12 object-cover rounded" width={100} height={100} />
                ) : (
                    <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded text-gray-500">No Image</div>
                )
            )
        },
        { accessorKey: "name", header: "Product Name", cell: ({ row }) => <ProductDrawer product={row.original} /> },
        { accessorKey: "category", header: "Category", cell: ({ row }) => <Badge variant="outline">{row.original.category || "N/A"}</Badge> },
        { accessorKey: "price", header: "Price (₹)", cell: ({ row }) => <>₹{row.original.price}</> },
        { 
            accessorKey: "stock_quantity", 
            header: "Stock", 
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "font-bold",
                        row.original.stock_quantity <= row.original.low_stock_threshold ? "text-orange-600 animate-pulse" : "text-foreground"
                    )}>
                        {row.original.stock_quantity}
                    </span>
                    {row.original.stock_quantity <= row.original.low_stock_threshold && (
                        <Badge variant="destructive" className="h-5 px-1 bg-orange-500/10 text-orange-600 border-orange-500/20 text-[8px] uppercase tracking-tighter">
                            Low Stock
                        </Badge>
                    )}
                </div>
            ) 
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }: { row: TableRowType<z.infer<typeof productSchema>> }) => (
                <Badge variant="outline" className="flex items-center gap-1">
                    {row.original.isActive ? <IconCircleCheckFilled className="fill-green-500" /> : <IconLoader />}
                    {row.original.isActive ? "Available" : "Unavailable"}
                </Badge>
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
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => deleteProduct(row.original.id)}
                        >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

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

    // --- CREATE PRODUCT ---




    if (loading) return <div className="text-center mt-3 text-muted-foreground animate-pulse">Loading products...</div>

    const lowStockProducts = rows.filter(p => p.stock_quantity <= p.low_stock_threshold);

    return (
        <div className="w-full p-4">
            {lowStockProducts.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between shadow-soft animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-600 flex items-center justify-center shrink-0">
                            <IconLoader className="h-6 w-6 animate-spin-slow" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-orange-600 uppercase tracking-widest">Low Stock Alert</p>
                            <p className="text-xs text-orange-600/80 font-medium">
                                {lowStockProducts.length} {lowStockProducts.length === 1 ? "product requires" : "products require"} immediate restocking.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-orange-500/20 text-orange-600 hover:bg-orange-500/10">
                        View Items
                    </Button>
                </div>
            )}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Products</h2>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <IconPlus className="mr-1" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Product</DialogTitle>
                            <DialogDescription>Fill in the details below.</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Name</Label>
                                <Input placeholder="Product name" value={newProduct.name}
                                    onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />

                                <Label>Description</Label>
                                <Input placeholder="Product description" value={newProduct.description}
                                    onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))} />

                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    value={newProduct.price || ""}
                                    onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value === "" ? 0 : parseFloat(e.target.value) }))}
                                />

                                <Label>Stock Quantity</Label>
                                <Input
                                    type="number"
                                    value={newProduct.stock_quantity || ""}
                                    onChange={e => setNewProduct(prev => ({ ...prev, stock_quantity: e.target.value === "" ? 0 : parseInt(e.target.value) }))}
                                />

                                <Label>Low Stock Threshold</Label>
                                <Input
                                    type="number"
                                    value={newProduct.low_stock_threshold || ""}
                                    onChange={e => setNewProduct(prev => ({ ...prev, low_stock_threshold: e.target.value === "" ? 0 : parseInt(e.target.value) }))}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>SKU</Label>
                                <Input readOnly placeholder="Auto-generated" value={newProduct.sku} />

                                <Label>Category</Label>
                                <Select
                                    value={newProduct.categoryId ? newProduct.categoryId.toString() : ""}
                                    onValueChange={val => {
                                        const categoryId = parseInt(val)
                                        const categoryName = categories.find(c => c.id === categoryId)?.name || ""
                                        const newSku = `${categoryName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
                                        setNewProduct(prev => ({ ...prev, categoryId, sku: newSku }))
                                    }}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                <Label>Product Image</Label>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 relative border rounded-lg px-3 py-2 light:bg-white light:hover:bg-gray-50 transition">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadImage}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <span className="text-gray-600 truncate pointer-events-none">{newProduct.fileName || "Click to select image"}</span>
                                    </div>
                                    {newProduct.image && (
                                        <div className="shrink-0 w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                                            <Image src={newProduct.image} alt="Preview" width={96} height={96} className="object-cover w-full h-full" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleCreateProduct} disabled={createMutation.isPending}>
                                {createMutation.isPending && <IconLoader className="mr-2 h-4 w-4 animate-spin" />}
                                {createMutation.isPending ? "Creating..." : "Create"}
                            </Button>
                            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]} sensors={sensors}>
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup: HeaderGroup<z.infer<typeof productSchema>>) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header: Header<z.infer<typeof productSchema>, any>) => (
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
