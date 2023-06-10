import { Button } from '@/components/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet'
import { API_QUERY_KEY, DATABASE_KEY } from '@/lib/utils'
import { useGetDetailDoc } from '@/services/hookBase.service'
import { EditIcon } from 'lucide-react'
import React, { useState } from 'react'
import { ClassroomForm } from '../classroom/ClassRoomForm'

type Props = { id: React.Key, className: string }

export default function DetailClassAction({ id, className }: Props) {
    const [open, setOpen] = useState(false)
    const { data } = useGetDetailDoc({ queryKey: API_QUERY_KEY.GET_LIST_CLASSROOM, dbKey: DATABASE_KEY.CLASS + '/' + id, enable: open })
    console.log(data)
    const [isEdit, setEdit] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger><div className="font-semibold text-blue-500 cursor-pointer">{className}</div></SheetTrigger>
                <SheetContent size={'lg'} className='h-screen overflow-y-auto'>
                    <SheetHeader>
                        <SheetTitle className='flex items-center gap-4'>
                            {isEdit ? 'Cập nhật thông tin lớp học' :
                                'Thông tin lớp học'}
                            <Button onClick={() => setEdit(!isEdit)} variant={isEdit ? 'default' : 'secondary'}><EditIcon /></Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className={isEdit ? 'pointer-events-auto' : 'pointer-events-none'}>
                        {data && <ClassroomForm triggerDialog={setOpen}
                            initialValue={data}
                            mode={isEdit ? 'edit' : 'view'} />}
                    </div>
                </SheetContent>
            </Sheet >
        </>
    )
}