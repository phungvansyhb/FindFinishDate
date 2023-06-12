import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import { VNCurrencyFormatter, convertTimestampFirebase } from "@/lib/utils";
import { IRegisterForm, IRegisterFormDTO } from "@/typedefs/IRegisterForm";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { MoreHorizontal, StickyNoteIcon } from "lucide-react";
import { Button } from "../../button";
import ActiveAction from "./ActiveAction";
import DeleteAction from "./DeleteAction";
import EditAction from "./EditAction";
import DetailStudentAction from "./DetailStudentAction";
import DetailClassAction from "./DetailClassAction";
import { ArrowUpDown } from "lucide-react";
import { DAY_ARRAY } from "@/lib/utils";
import { useState } from "react";
import CheckDateFee from "./CheckDateFee";

export const columns: ColumnDef<IRegisterFormDTO>[] = [
  {
    id: "Trạng thái",
    accessorKey: "status",
    // header: "Trạng thái",
    cell: ({ row }) => <ActiveAction row={row.original} />,
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Trạng thái
        </div>
      );
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
          Mã phiếu đăng ký - Chỉnh sửa
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
    accessorFn: (row) => row.class?.name,
    cell: ({ row }) => {
      return row.original.classId ? (
        <DetailClassAction
          id={row.original.classId}
          classRoomName={row.original.class?.name}
        />
      ) : (
        row.original.class.name
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
          studentName={row.original.student.name}
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
  {
    id: "Lịch học",
    accessorKey: "schedule",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Lịch học
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
  },
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
      if(!nextPaymentDate) return
      return <CheckDateFee targetDateStr={String(nextPaymentDate)}/>
    },
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
  },

  {
    id: "Thao tác",
    // id: "actions",
    cell: ({ row }) => {
      const student = row.original;
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
            <DropdownMenuItem disabled className="flex gap-2">
              <StickyNoteIcon size={18} /> Thêm phiếu nghỉ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
