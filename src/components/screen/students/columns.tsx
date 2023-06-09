import { convertTimestampFirebase } from "@/lib/utils"
import { IStudent } from "@/typedefs/IStudent"
import { ColumnDef } from "@tanstack/react-table"
import { Timestamp } from "firebase/firestore"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../../button"
import EditAction from "./EditAction"
import ActiveAction from "./ActiveAction"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/dropdown-menu"
import DeleteAction from "./DeleteAction"

export const columns: ColumnDef<IStudent>[] = [
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <ActiveAction row={row.original} />
    },
    {
        accessorKey: "id",
        header: "Mã Học Sinh",
        cell: ({ row }) => {
            return <EditAction id={row.original.id} data={row.original} />
        },
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "grade",
        // header: "Email",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    grade
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: "phone",
        header: "Số điện thoại"
    },
    {
        accessorKey: "location",
        header: "Địa chỉ"
    },
    {
        accessorKey: "lastContactDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Liên lạc gần nhất
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.lastContactDate as Timestamp, format: 'DD/MM/YYYY' })
        }
    },

    {
        accessorKey: "school",
        header: "Phân loại trường"
    },
    {
        accessorKey: "entryTest",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Điểm đầu vào
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "social",
        header: "Social"
    },
    {
        accessorKey: "wom",
        header: "WOM"
    },

    {
        accessorKey: "channel",
        header: "channel"
    },
    {
        accessorKey: "note",
        header: "Ghi chú"
    },
    {
        accessorKey: "createAt",
        header: "Ngày tạo",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.lastContactDate as Timestamp, format: 'DD/MM/YYYY' })
        }
    },
    {
        accessorKey: "uppateAt",
        header: "Ngày câp nhật",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.lastContactDate as Timestamp, format: 'DD/MM/YYYY' })
        }
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DeleteAction id={student.id} />
                        {/* <DropdownMenuSeparator /> */}
                        {/* <EditAction id={student.id} /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
