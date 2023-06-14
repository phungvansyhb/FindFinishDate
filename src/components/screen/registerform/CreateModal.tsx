import { Button } from '@/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/dialog'
import { PlusCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { RegisterForm } from './RegisterForm'


export default function CreateModal() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircleIcon /> Tạo học phí
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[700px] sm:max-w-[425px] h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm mới đơn học phí</DialogTitle>
          <DialogDescription>
            Điền thông tin đơn học phí
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          <RegisterForm triggerDialog={setOpen} />
        </div>

      </DialogContent>
    </Dialog>
  )
}