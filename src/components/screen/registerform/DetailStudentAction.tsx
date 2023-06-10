import { Button } from '@/components/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet'
import { API_QUERY_KEY, DATABASE_KEY, convertTimestampFirebaseToDate } from '@/lib/utils'
import { useGetDetailDoc } from '@/services/hookBase.service'
import { EditIcon } from 'lucide-react'
import React, { useState } from 'react'
import { StudentForm } from '../students/StudentForm'

type Props = { id: React.Key, studentName: string }

export default function DetailStudentAction({ id, studentName }: Props) {
    const [open, setOpen] = useState(false)
    const { data } = useGetDetailDoc({ queryKey: API_QUERY_KEY.GET_DETAIL_STUDENT, dbKey: DATABASE_KEY.STUDENT + '/' + id, enable: open })
    console.log(data)
    const [isEdit, setEdit] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger><div className="font-semibold text-blue-500 cursor-pointer">{studentName}</div></SheetTrigger>
                <SheetContent size={'lg'} className='h-screen overflow-y-auto'>
                    <SheetHeader>
                        <SheetTitle className='flex items-center gap-4'>
                            {isEdit ? 'Cập nhật thông tin sinh viên' :
                                'Thông tin sinh viên'}
                            <Button onClick={() => setEdit(!isEdit)} variant={isEdit ? 'default' : 'secondary'}><EditIcon /></Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className={isEdit ? 'pointer-events-auto' : 'pointer-events-none'}>
                        {data && <StudentForm triggerDialog={setOpen}
                            initialValue={{ ...data, lastContactDate: convertTimestampFirebaseToDate({ date: data?.lastContactDate }) }}
                            mode={isEdit ? 'edit' : 'view'} />}
                    </div>
                </SheetContent>
            </Sheet >
        </>
    )
}