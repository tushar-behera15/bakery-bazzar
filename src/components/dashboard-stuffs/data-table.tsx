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
  type UniqueIdentifier,
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
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconGripVertical,
  IconLoader,

} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  status: z.string(),
  price: z.number(),
  stock: z.number(),
  chef: z.string(),
})


// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    accessorKey: "name",
    header: () => <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Product Name</div>,
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Category</div>,
    cell: ({ row }) => (
      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Status</div>,
    cell: ({ row }) => (
      <Badge 
        variant="outline" 
        className={cn(
            "gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-sm border-none",
            row.original.status === "Available" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
        )}
      >
        {row.original.status === "Available" ? (
          <IconCircleCheckFilled className="h-3 w-3 fill-current" />
        ) : (
          <IconLoader className="h-3 w-3 animate-spin" />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Price</div>,
    cell: ({ row }) => <div className="text-right font-black text-foreground tracking-tight">₹{row.original.price}</div>,
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Stock</div>,
    cell: ({ row }) => <div className="text-right font-bold text-muted-foreground">{row.original.stock}</div>,
  },
  {
    accessorKey: "chef",
    header: () => <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Chef</div>,
    cell: ({ row }) => <span className="font-medium">{row.original.chef}</span>,
  },
]



function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 transition-colors border-border/40 hover:bg-muted/50"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-8"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit h-9 rounded-xl border-border/50 bg-muted/30 @4xl/main:hidden"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-premium">
            <SelectItem value="outline">Inventory</SelectItem>
            <SelectItem value="customers">Customers</SelectItem>
            <SelectItem value="payments">Payments</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="bg-muted/30 p-1.5 rounded-2xl border border-border/50 hidden @4xl/main:flex h-auto">
          <TabsTrigger value="outline" className="rounded-xl px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft font-bold text-xs uppercase tracking-widest">Products</TabsTrigger>
          <TabsTrigger value="past-performance" className="rounded-xl px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft font-bold text-xs uppercase tracking-widest gap-2">
            Customers <Badge className="bg-primary/20 text-primary border-none shadow-none text-[10px] h-4 min-w-4 flex items-center justify-center p-0">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="key-personnel" className="rounded-xl px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft font-bold text-xs uppercase tracking-widest gap-2">
            Payments <Badge className="bg-accent/30 text-accent-foreground border-none shadow-none text-[10px] h-4 min-w-4 flex items-center justify-center p-0">2</Badge>
          </TabsTrigger>
          <TabsTrigger value="focus-documents" className="rounded-xl px-6 py-2 data-[state=active]:bg-background data-[state=active]:shadow-soft font-bold text-xs uppercase tracking-widest">Orders</TabsTrigger>
        </TabsList>

      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-6 overflow-auto px-4 lg:px-6 m-0"
      >
        <div className="overflow-hidden rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-md shadow-soft">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10 border-b border-border/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} className="h-12">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No items found in inventory.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-2 pb-6">
          <div className="text-muted-foreground hidden flex-1 text-sm font-medium lg:flex">
            <span className="text-primary font-bold mr-1">{table.getFilteredSelectedRowModel().rows.length}</span> of{" "}
            <span className="font-bold mx-1">{table.getFilteredRowModel().rows.length}</span> items selected
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-3 lg:flex">
              <Label htmlFor="rows-per-page" className="text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                Rows
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20 h-9 rounded-xl border-border/50" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 shadow-premium">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-xs font-black uppercase tracking-widest">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden size-9 p-0 lg:flex rounded-xl border-border/50 hover:bg-muted/50"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-9 rounded-xl border-border/50 hover:bg-muted/50"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-9 rounded-xl border-border/50 hover:bg-muted/50"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden size-9 lg:flex rounded-xl border-border/50 hover:bg-muted/50"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6 m-0"
      >
        <div className="aspect-video w-full flex-1 rounded-[2rem] border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground font-bold">Customer data visualization coming soon</p>
        </div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6 m-0">
        <div className="aspect-video w-full flex-1 rounded-[2rem] border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground font-bold">Payment analytics coming soon</p>
        </div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6 m-0"
      >
        <div className="aspect-video w-full flex-1 rounded-[2rem] border-2 border-dashed border-border/50 flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground font-bold">Orders management coming soon</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}





function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground font-bold hover:text-primary p-0 h-auto no-underline transition-colors">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-[2rem] md:rounded-l-[2rem] md:rounded-t-none border-border/40 shadow-premium">
        <DrawerHeader className="gap-2 pb-8 border-b border-border/40 mb-8">
          <div className="p-3 w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <span className="text-2xl">🥐</span>
          </div>
          <DrawerTitle className="text-3xl font-black tracking-tight">{item.name}</DrawerTitle>
          <DrawerDescription className="text-sm font-medium">Detailed configuration for this bakery item</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-y-auto px-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Category</Label>
              <Input defaultValue={item.category} className="h-11 rounded-xl border-border/50 bg-muted/30 font-bold" />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Status</Label>
              <Input defaultValue={item.status} className="h-11 rounded-xl border-border/50 bg-muted/30 font-bold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Price (₹)</Label>
              <Input defaultValue={item.price} type="number" className="h-11 rounded-xl border-border/50 bg-muted/30 font-bold" />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 ml-1">In Stock</Label>
              <Input defaultValue={item.stock} type="number" className="h-11 rounded-xl border-border/50 bg-muted/30 font-bold" />
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Assigned Chef</Label>
            <Input defaultValue={item.chef} className="h-11 rounded-xl border-border/50 bg-muted/30 font-bold" />
          </div>
        </div>
        <DrawerFooter className="mt-auto pt-8 border-t border-border/40 gap-3">
          <Button className="h-12 rounded-xl font-bold text-base shadow-soft hover:shadow-premium transition-all">
            Update Product
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="h-12 rounded-xl font-bold border-border/50">
              Discard Changes
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

