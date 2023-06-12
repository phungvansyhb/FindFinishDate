import { COLUMNDATA_TYPE, convertTimestampFirebase, convertTimestampFirebaseToDate } from "@/lib/utils"
import { IStudentDTO } from "@/typedefs/IStudent"
import { ColumnDef } from "@tanstack/react-table"
import { Timestamp } from "firebase/firestore"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../../button"
import ActiveAction from "./ActiveAction"
import DeleteAction from "./DeleteAction"
import EditAction from "./EditAction"
import dayjs from "dayjs"

export const columns: ColumnDef<IStudentDTO>[] = [
    {
        accessorKey: "status",
        header: "Khả dụng",
        id: "Khả dụng",
        cell: ({ row }) => <ActiveAction row={row.original} />,
        meta: { type: COLUMNDATA_TYPE.BOOLEAN },
        filterFn: (row, _y, value) => {
            let tmp = false;
            if (value === 'true') tmp = true;
            if (tmp === row.original.status) return true;
            else return false
        },
    },
    {
        accessorKey: "id",
        header: "Mã Học Sinh",
        id: "Mã Học Sinh",
        cell: ({ row }) => {
            return <EditAction id={row.original.id} data={row.original} />
        },
        enableHiding: false
    },
    {
        id: "Tên học sinh",
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
        id: "Lớp",
        accessorFn: (row) => row.grade?.name,
        cell: ({ row }) => {
            return row.original.grade ? row.original.grade.name : ""
        }
    },
    {
        accessorKey: "email",
        header: "Email",
        id: "Email"
    },
    {
        accessorKey: "phone",
        header: "Số điện thoại",
        id: "Số điện thoại"
    },
    {
        accessorKey: "location",
        header: "Địa chỉ",
        id: "Địa chỉ",
    },
    {
        accessorKey: "lastContactDate",
        id: "Liên lạc gần nhất",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Liên lạc gần nhất
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({ date: row.original.lastContactDate as Timestamp, format: 'DD/MM/YYYY' })
        },
        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.lastContactDate as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },

    {
        accessorKey: "school",
        id: "Phân loại trường",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Phân loại trường
                </div>
            );
        },
    },
    {
        accessorKey: "entryTest",
        id: "Điểm đầu vào",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Điểm đầu vào
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "social",
        id: "Social",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Social
                </div>
            );
        },
    },
    {
        accessorKey: "wom",
        id: "WOM",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    WOM
                </div>
            );
        },
    },

    {
        accessorKey: "channel",
        id: "Channel",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Channel
                </div>
            );
        },
    },
    {
        accessorKey: "note",
        id: "Ghi chú",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Ghi chú
                </div>
            );
        },
    },
    {
        accessorKey: "createAt",
        id: "Ngày tạo",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Ngày tạo
                </div>
            );
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({
                date: row.original.createAt as Timestamp,
                format: "DD/MM/YYYY",
            });
        },
        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.createAt as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },
    {
        accessorKey: "uppateAt",
        id: "Ngày cập nhật",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Ngày cập nhật
                </div>
            );
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({
                date: row.original.updateAt as Timestamp,
                format: "DD/MM/YYYY",
            });
        },
        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.updateAt as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },

    {
        id: "thao tác",
        cell: ({ row }) => {
            const student = row.original;
            return (<div className="flex items-center">
                <DeleteAction id={student.id} />
                <EditAction data={student} />
            </div>)
        },
    },
];
