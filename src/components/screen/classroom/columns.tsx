import { COLUMNDATA_TYPE, DAY_ARRAY, convertTimestampFirebase, convertTimestampFirebaseToDate } from "@/lib/utils"
import { IClass } from "@/typedefs/IClass"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../../button"
import ActiveAction from "./ActiveAction"
import DeleteAction from "./DeleteAction"
import EditAction from "./EditAction"

export const columns: ColumnDef<IClass>[] = [
  {
    accessorKey: "status",
    id: "Khả dụng",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Khả dụng
        </div>
      );
    },

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
    id: "Mã Lớp",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Mã Lớp
        </div>
      );
    },
    cell: ({ row }) => {
      return <EditAction id={row.original.id} data={row.original} />
    },
    enableHiding: false
  },
  {
    accessorKey: "name",
    id: "Tên lớp",
    header: ({ column }) => {
      return (
        <Button
          variant="secondary"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
            Tên lớp
          </div>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    id: "Mô tả",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Mô tả
        </div>
      );
    },
  },
  {
    id: "Lịch học",
    accessorKey: "schedule",
    enableColumnFilter: false,
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Lịch học
        </div>
      );
    },
    cell: ({ row }) => {
      return row.original.schedule?.map((item) => (
        <div key={item} className="px-2 bg-slate-100 rounded-md text-xs m-1">
          {DAY_ARRAY[item]}
        </div>
      ));
    },
  },
  {
    accessorKey: "teacher",
    id: "Giảng viên",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Giảng viên
        </div>
      );
    },
  },

  {
    accessorKey: "createAt",
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Ngày tạo
        </div>
      );
    },
    id: "Ngày tạo",
    cell: ({ row }) => {
      return convertTimestampFirebase({ date: row.original.createAt as Timestamp, format: 'DD/MM/YYYY' })
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
    header: () => {
      return (
        <div className="text-center whitespace-nowrap text-ellipsis overflow-hidden">
          Ngày cập nhật
        </div>
      );
    },
    id: "Ngày cập nhật",
    cell: ({ row }) => {
      return convertTimestampFirebase({ date: row.original.updateAt as Timestamp, format: 'DD/MM/YYYY' })
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
]
