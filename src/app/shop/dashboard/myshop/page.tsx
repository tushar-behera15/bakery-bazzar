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
  IconDotsVertical,
  IconGripVertical,
  IconLoader,
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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


// 🧾 Schema updated for Shop Field
export const schema = z.object({
  id: z.number(),
  section: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  manager: z.string(),
})

// 🧁 Indian Dummy Data for BakeryBazzar
const shopData: z.infer<typeof schema>[] = [
  {
    id: 1,
    section: "Cakes & Pastries",
    type: "Food Category",
    status: "Active",
    target: "₹25,000",
    limit: "₹30,000",
    manager: "Rohit Sharma",
  },
  {
    id: 2,
    section: "Snacks & Namkeen",
    type: "Food Category",
    status: "Active",
    target: "₹12,000",
    limit: "₹15,000",
    manager: "Neha Patel",
  },
  {
    id: 3,
    section: "Breads & Buns",
    type: "Food Category",
    status: "In Stock",
    target: "₹10,000",
    limit: "₹12,000",
    manager: "Amit Yadav",
  },
  {
    id: 4,
    section: "Beverages",
    type: "Drink Section",
    status: "Low Stock",
    target: "₹8,000",
    limit: "₹10,000",
    manager: "Kiran Mehta",
  },
  {
    id: 5,
    section: "Custom Orders",
    type: "Service",
    status: "Pending",
    target: "₹5,000",
    limit: "₹8,000",
    manager: "Priya Nair",
  },
  {
    id: 6,
    section: "Gift Hampers",
    type: "Special Section",
    status: "Active",
    target: "₹6,000",
    limit: "₹10,000",
    manager: "Aarav Kapoor",
  },
]

// Drag handle for each row
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })

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

// 🧮 Table Columns Definition
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  { id: "drag", header: () => null, cell: ({ row }) => <DragHandle id={row.original.id} /> },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      </div>
    ),
  },
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Active" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconLoader />
        )}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: "Target (₹)",
    cell: ({ row }) => (
      <Input
        className="h-8 w-20 border-transparent bg-transparent text-right shadow-none"
        defaultValue={row.original.target}
      />
    ),
  },
  {
    accessorKey: "limit",
    header: "Limit (₹)",
    cell: ({ row }) => (
      <Input
        className="h-8 w-20 border-transparent bg-transparent text-right shadow-none"
        defaultValue={row.original.limit}
      />
    ),
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-2">
        {row.original.manager}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-muted-foreground size-8">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Mark as Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// 🧱 Draggable Table Row
function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef } = useSortable({ id: row.original.id })
  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

// 📊 Chart Data for Drawer
const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Online Orders", color: "var(--primary)" },
  mobile: { label: "In-Store Sales", color: "var(--primary)" },
} satisfies ChartConfig

// 🪟 Drawer for Section Details
function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.section}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.section}</DrawerTitle>
          <DrawerDescription>
            Showing sales trends for this section over the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ChartContainer config={chartConfig}>
            <AreaChart data={chartData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="mobile" type="natural" fill="var(--color-mobile)" fillOpacity={0.5} stroke="var(--color-mobile)" />
              <Area dataKey="desktop" type="natural" fill="var(--color-desktop)" fillOpacity={0.4} stroke="var(--color-desktop)" />
            </AreaChart>
          </ChartContainer>
          <Separator className="my-4" />
          <div className="text-sm">
            This section shows product performance and sales overview.
          </div>
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

// 🚀 Main DataTable Component
export function DataTable({ data }: { data: z.infer<typeof schema>[] }) {
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
      setRows((rows) => {
        const oldIndex = rows.findIndex((r) => r.id === active.id)
        const newIndex = rows.findIndex((r) => r.id === over.id)
        return arrayMove(rows, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shop Sections Overview</h2>
        <Button variant="outline" size="sm">
          <IconPlus /> Add Section
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]} sensors={sensors}>
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}

// 🏁 Export Ready-to-Use Component
export default function ShopDataTable() {
  return <DataTable data={shopData} />
}
