import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { convertTimestampFirebase } from "@/lib/utils"
import { IRegisterForm } from "@/typedefs/IRegisterForm"
import { ColumnDef } from "@tanstack/react-table"
import { Timestamp } from "firebase/firestore"
import { MoreHorizontal, StickyNoteIcon } from "lucide-react"
import { Button } from "../../button"
import ActiveAction from "./ActiveAction"
import DeleteAction from "./DeleteAction"
import EditAction from "./EditAction"
import DetailStudentAction from "./DetailStudentAction"
import DetailClassAction from "./DetailClassAction"

export const columns: ColumnDef<IRegisterForm>[] = [
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <ActiveAction row={row.original} />
    },
    {
        accessorKey: "id",
        header: "Mã phiếu đăng ký",
        cell: ({ row }) => {
            return <EditAction id={row.original.id} data={row.original} />
        },
        enableHiding: false
    },
    {
        accessorKey: "className",
        header: "Lớp học",
        cell: ({ row }) => {
            return row.original.classId ? <DetailClassAction id={row.original.classId} className={row.original.className} /> : row.original.className
        },
    },
    {
        accessorKey: "studentName",
        header: "Học sinh",
        cell: ({ row }) => {
            return row.original.studentId ? <DetailStudentAction id={row.original.studentId} studentName={row.original.studentName} /> : row.original.studentName
        },
    },
    {
        accessorKey: "paymentDate",
        header: "Ngày đóng tiền",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.paymentDate as Timestamp, format: 'DD/MM/YYYY' })
        }
    },
    {
        accessorKey: "receiveMoney",
        header: "Số tiền đã đóng"
    },
    {
        accessorKey: "startDate",
        header: "Ngày bắt đầu học",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.startDate as Timestamp, format: 'DD/MM/YYYY' })
        }
    },
    {
        accessorKey: "lessonCost",
        header: "Giá tiền 1 buổi"
    },
    {
        accessorKey: "schedule",
        header: "Lịch học"
    },
    {
        accessorKey: "nextPaymentDate",
        header: "Ngày đóng tiền tiếp theo",
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.nextPaymentDate as Timestamp, format: 'DD/MM/YYYY' })
        }
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="flex gap-2"
                        ><StickyNoteIcon size={18} /> Thêm phiếu nghỉ</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
