import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog'
import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { AbsenceForm } from './AbsenceForm'


export default function CreateModal() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon /> Thêm mới đơn nghỉ phép
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[700px] sm:max-w-[425px] h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm mới đơn nghỉ phép</DialogTitle>
          <DialogDescription>
            Điền thông tin nghỉ phép
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <AbsenceForm triggerDialog={setOpen} />
        </div>

      </DialogContent>
    </Dialog>
  )
}