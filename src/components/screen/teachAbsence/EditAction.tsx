import { Button } from '@/components/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet'
import { convertTimestampFirebaseToDate } from '@/lib/utils'
import { IStudentDTO } from '@/typedefs/IStudent'
import { Timestamp } from 'firebase/firestore'
import { EditIcon } from 'lucide-react'
import React, { useState } from 'react'
import { AbsenceForm } from './AbsenceForm'
import { IAbsenceForm } from '@/typedefs/IAbsenceForm'

type Props = { id?: React.Key, data: IAbsenceForm }

export default function EditAction({ id, data }: Props) {
    const [open, setOpen] = useState(false)
    const initValue: IAbsenceForm = {
        ...data,
        updateAt: convertTimestampFirebaseToDate({ date: data.updateAt as Timestamp }),
        createAt: convertTimestampFirebaseToDate({ date: data.createAt as Timestamp }),
        className: data.classRoom?.name,
        absenceDate : convertTimestampFirebaseToDate({ date: data.absenceDate as Timestamp }),
    }
    const [isEdit, setEdit] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen} >
                <SheetTrigger className='border-none'>
                    {id ?
                        <div className="font-semibold text-blue-500 cursor-pointer">{id}</div>
                        :
                        <EditIcon size={18} />
                    }
                </SheetTrigger>
                <SheetContent size={'full'} className='h-screen overflow-y-auto pb-20'>
                    <SheetHeader>
                        <SheetTitle className='flex items-center gap-4'>
                            {isEdit ? 'Cập nhật thông tin sinh viên' :
                                'Thông tin học sinh'}
                            <Button onClick={() => setEdit(!isEdit)} variant={isEdit ? 'default' : 'secondary'}><EditIcon /></Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className={isEdit ? 'pointer-events-auto' : 'pointer-events-none'}>
                        <AbsenceForm triggerDialog={setOpen} initialValue={initValue} mode={isEdit ? 'edit' : 'view'} />
                    </div>
                </SheetContent>
            </Sheet >
        </>
    )
}