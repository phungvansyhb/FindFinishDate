import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"

import { CalendarIcon, FilterIcon, TableIcon } from "lucide-react"
import React from "react"
import { useLocalStorage } from 'usehooks-ts'
import { Button } from "../button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../dropdown-menu"
import { Input } from "../input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../table"
import { COLUMNDATA_TYPE, cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "../popover"
import { Calendar } from "../calendar"
import dayjs from "dayjs"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    tableName: 'register' | 'student' | 'classroom' | 'absence'
}

export function DataTable<TData, TValue>({
    columns,
    data,
    tableName,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useLocalStorage(`findFinishDate::${tableName}::columnVisibility`, {})
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnVisibility,
            columnFilters
        }
    })

    return (
        <div className="">
            <div className="flex items-center py-4 gap-1 flex-wrap justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button variant="outline" className="ml-auto">
                            <TableIcon /> Cột
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu >
                    <DropdownMenuTrigger className="border-none">
                        <Button className="ml-auto">
                            <FilterIcon />Lọc
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-4" align="end">
                        <div className="grid grid-cols-4 py-4 gap-4 ">
                            {table.getVisibleLeafColumns().map(column => {
                                const dataType = (column.columnDef.meta as { type: string })?.type;
                                if (column.getCanFilter()) {
                                    switch (dataType) {
                                        case COLUMNDATA_TYPE.BOOLEAN:
                                            return (
                                                <div className="flex flex-col gap-2" key={column.id}>
                                                    <Label>{column.id}</Label>
                                                    <Select onValueChange={(e) => {
                                                        column?.setFilterValue(e)
                                                    }} value={column?.getFilterValue() as string}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn giá trị" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={"true"}>Có</SelectItem>
                                                            <SelectItem value={"false"}>Không</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                            )
                                        case COLUMNDATA_TYPE.DATE:
                                            return (
                                                <div className="flex flex-col gap-2" key={column.id}>
                                                    <Label>{column.id}</Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !column?.getFilterValue() && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {column?.getFilterValue() ? (
                                                                    dayjs(column?.getFilterValue() as Date).format('DD/MM/YYYY')
                                                                ) : (
                                                                    <span>Chọn ngày</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={column?.getFilterValue() as Date}
                                                                onSelect={column?.setFilterValue}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>

                                            )

                                        default:
                                            return (
                                                <div className="flex flex-col gap-2" key={column.id}>
                                                    <Label>{column.id}</Label>
                                                    <Input
                                                        key={column.id}
                                                        placeholder={"Filter " + column.id}
                                                        value={(column?.getFilterValue() as string) ?? ""}
                                                        onChange={(event) =>
                                                            column?.setFilterValue(event.target.value)
                                                        }
                                                        className="max-w-sm"
                                                    />
                                                </div>
                                            );
                                    }
                                } else return <></>
                            })
                            }
                        </div>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setColumnFilters([])}>Clear</Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <div className="rounded-md border w-full">
                <Table >
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                    <TableBody >
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-wrap items-center justify-end space-x-2 py-4">
                <Button
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Trước
                </Button>
                <Button
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Sau
                </Button>
            </div>
        </div>
    )
}