import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog'
import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { ClassroomForm } from './ClassRoomForm'


export default function CreateModal() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon /> Tạo lớp học
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[700px] sm:max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm mới lớp học</DialogTitle>
          <DialogDescription>
            Điền thông tin lớp học
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <ClassroomForm triggerDialog={setOpen} />
        </div>

      </DialogContent>
    </Dialog>
  )
}