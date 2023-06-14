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
import { IAbsenceForm } from "@/typedefs/IAbsenceForm"

export const columns: ColumnDef<IAbsenceForm>[] = [
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
        header: "Mã đơn xin nghỉ",
        id: "Mã đơn xin nghỉ",
        cell: ({ row }) => {
            return <EditAction id={row.original.id} data={row.original} />
        },
        enableHiding: false
    },
    {
        id: "Lí do nghỉ",
        accessorKey: "reason",
        header: "Lí do"

    },
    {
        id: "Lớp",
        accessorFn: (row) => row.classRoom.name,
        header: "Lớp "
    },
    {
        id: "Giáo viên",
        accessorFn: (row) => row.classRoom.teacher,
        header: "Giáo viên "
    },
    {
        id: "Ngày nghỉ",
        accessorFn: (row) => row.absenceDate,
        header: "Ngày nghỉ",
        cell: ({ row }) => {
            return convertTimestampFirebase({
                date: row.original.absenceDate as Timestamp,
                format: "DD/MM/YYYY",
            });
        },
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
        id: "Thao tác",
        cell: ({ row }) => {
            const student = row.original;
            return (<div className="flex items-center">
                <DeleteAction id={student.id} />
                <EditAction data={student} />
            </div>)
        },
    },
];
