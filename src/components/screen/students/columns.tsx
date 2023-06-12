import { convertTimestampFirebase } from "@/lib/utils";
import { IStudent } from "@/typedefs/IStudent";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../../button";
import EditAction from "./EditAction";
import ActiveAction from "./ActiveAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu";
import DeleteAction from "./DeleteAction";

export const columns: ColumnDef<IStudent>[] = [
  {
    accessorKey: "status",
    id: "Trạng thái",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Trạng thái
        </div>
      );
    },
    cell: ({ row }) => <ActiveAction row={row.original} />,
  },
  {
    accessorKey: "id",
    id: "Mã Học Sinh",
    cell: ({ row }) => {
      return <EditAction id={row.original.id} data={row.original} />;
    },
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Mã Học Sinh
        </div>
      );
    },
    enableHiding: false,
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
          <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
            Tên học sinh
          </div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "Khối lớp",
    accessorKey: "grade",
    // header: "Email",
    header: ({ column }) => {
      return (
        <Button
          variant="secondary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
            Khối lớp
          </div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    id: "Email",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Email
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    id: "Số điện thoại",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Số điện thoại
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    id: "Địa chỉ",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Địa chỉ
        </div>
      );
    },
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
      );
    },
    cell: ({ row }) => {
      return convertTimestampFirebase({
        date: row.original.lastContactDate as Timestamp,
        format: "DD/MM/YYYY",
      });
    },
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
  },

  {
    id: "thao tác",
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
            {/* <DropdownMenuSeparator /> */}
            {/* <EditAction id={student.id} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
