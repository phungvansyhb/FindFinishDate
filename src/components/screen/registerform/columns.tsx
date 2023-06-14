import { COLUMNDATA_TYPE, DAY_ARRAY, VNCurrencyFormatter, convertTimestampFirebase, convertTimestampFirebaseToDate } from "@/lib/utils";
import { IRegisterFormDTO } from "@/typedefs/IRegisterForm";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../button";
import ActiveAction from "./ActiveAction";
import CheckDateFee from "./CheckDateFee";
import DeleteAction from "./DeleteAction";
import DetailClassAction from "./DetailClassAction";
import DetailStudentAction from "./DetailStudentAction";
import EditAction from "./EditAction";

export const columns: ColumnDef<IRegisterFormDTO>[] = [
    {
        id: "Khả dụng",
        accessorKey: "status",
        cell: ({ row }) => <ActiveAction row={row.original} />,
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Khả dụng
                </div>
            );
        },
        meta: { type: COLUMNDATA_TYPE.BOOLEAN },
        filterFn: (row, _y, value) => {
            let tmp = false;
            if (value === 'true') tmp = true;
            if (tmp === row.original.status) return true;
            else return false
        },
    },
    {
        id: "Mã phiếu đăng ký",
        accessorKey: "id",
        cell: ({ row }) => {
            return <EditAction id={row.original.id} data={row.original} />;
        },
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Mã phiếu đăng ký
                </div>
            );
        },
        enableHiding: false,
    },
    {
        id: "Tên lớp học",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Lớp học
                </div>
            );
        },
        accessorFn: (row) => row.classRoom?.name,
        cell: ({ row }) => {
            return row.original.classId ? (
                <DetailClassAction
                    id={row.original.classId}
                    classRoomName={row.original.classRoom?.name}
                />
            ) : (
                row.original.classRoom.name
            );
            // return row.original.class?.name
        },
    },
    {
        id: "Tên học sinh",
        accessorFn: (row) => row.student?.name,
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Học sinh
                </div>
            );
        },
        cell: ({ row }) => {
            return row.original.studentId ? (
                <DetailStudentAction
                    id={row.original.studentId}
                    studentName={row.original.student?.name}
                />
            ) : (
                row.original.student.name
            );
        },
    },
    {
        id: "Ngày đóng tiền",
        accessorKey: "paymentDate",
        header: () => {
            return (
                <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                    Ngày đóng tiền
                </div>
            );
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({
                date: row.original.paymentDate as Timestamp,
                format: "DD/MM/YYYY",
            });
        },

        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.paymentDate as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },
    {
        id: "Số tiền đã đóng",
        accessorKey: "receiveMoney",
        cell: ({ row }) => {
            return VNCurrencyFormatter.format(parseInt(row.original.receiveMoney));
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Số tiền đã đóng
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        id: "Ngày bắt đầu học",
        accessorKey: "startDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Ngày bắt đầu học
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return convertTimestampFirebase({
                date: row.original.startDate as Timestamp,
                format: "DD/MM/YYYY",
            });
        },
        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.startDate as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },
    {
        id: "Giá tiền 1 buổi học",
        accessorKey: "lessonCost",
        cell: ({ row }) => {
            return VNCurrencyFormatter.format(parseInt(row.original.lessonCost));
        },
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Giá tiền 1 buổi học
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    // {
    //     id: "Lịch học",
    //     accessorKey: "schedule",
    //     enableColumnFilter: false,
    //     header: () => {
    //         return (
    //             <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
    //                 Lịch học
    //             </div>
    //         );
    //     },
    //     cell: ({ row }) => {
    //         return row.original.schedule.map((item) => (
    //             <div key={item} className="px-2 bg-slate-100 rounded-md text-xs m-1">
    //                 {DAY_ARRAY[item]}
    //             </div>
    //         ));
    //     },
    // },
    /*  {
         id: "Số ngày nghỉ giáo viên",
         accessorKey: "teacherAbsents",
         enableColumnFilter: false,
         header: () => {
             return (
                 <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                     Số ngày nghỉ giáo viên
                 </div>
             );
         },
         cell: ({ row }) => {
             return row.original.schedule.map((item) => (
                 <div key={item} className="px-2 bg-slate-100 rounded-md text-xs m-1">
                     {DAY_ARRAY[item]}
                 </div>
             ));
         },
     }, */
    {
        id: "Ngày đóng tiền tiếp theo",
        accessorKey: "nextPaymentDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="secondary"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
                        Ngày đóng tiền tiếp theo
                    </div>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const nextPaymentDate = convertTimestampFirebase({
                date: row.original.nextPaymentDate as Timestamp,
                format: "DD/MM/YYYY",
            })
            if (!nextPaymentDate) return
            return <CheckDateFee targetDateStr={String(nextPaymentDate)} />
        },
        meta: { type: COLUMNDATA_TYPE.DATE },
        filterFn: (row, _y, value) => {
            if (dayjs(value).isSame(convertTimestampFirebaseToDate({ date: row.original.nextPaymentDate as Timestamp }), 'date')) {
                return true
            } else return false
        }
    },
    {
        id: "Ngày tạo",
        accessorKey: "createAt",
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
        id: "Ngày cập nhật",
        accessorKey: "uppateAt",
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
