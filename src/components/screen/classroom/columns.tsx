import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { convertTimestampFirebase } from "@/lib/utils"
import { IClass } from "@/typedefs/IClass"
import { ColumnDef } from "@tanstack/react-table"
import { Timestamp } from "firebase/firestore"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "../../button"
import ActiveAction from "./ActiveAction"
import DeleteAction from "./DeleteAction"
import EditAction from "./EditAction"

export const columns: ColumnDef<IClass>[] = [
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <ActiveAction row={row.original} />
    },
    {
        accessorKey: "id",
        header: "Mã Lớp",
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
        accessorKey: "description",
        header: "Mô tả",
    },
    {
        accessorKey: "teacher",
        header: "Giảng viên"
    },
    {
        accessorKey: "createAt",
        header: "Ngày tạo",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.createAt as Timestamp, format: 'DD/MM/YYYY' })
        }
    },
    {
        accessorKey: "uppateAt",
        header: "Ngày cập nhật",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.updateAt as Timestamp, format: 'DD/MM/YYYY' })
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
                      
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]