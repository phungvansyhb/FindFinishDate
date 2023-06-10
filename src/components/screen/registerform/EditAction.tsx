import { Button } from '@/components/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet'
import { convertTimestampFirebaseToDate } from '@/lib/utils'
import { IRegisterForm, IRegisterFormDTO } from '@/typedefs/IRegisterForm'
import { Timestamp } from 'firebase/firestore'
import { EditIcon } from 'lucide-react'
import React, { useState } from 'react'
import { RegisterForm } from './RegisterForm'

type Props = { id: React.Key, data: IRegisterFormDTO }

export default function EditAction({ id, data }: Props) {
    const [open, setOpen] = useState(false)
    const initValue: IRegisterForm = {
        ...data,
        studentName: data.student.name,
        className: data.class.name,
        nextPaymentDate: convertTimestampFirebaseToDate({ date: data.nextPaymentDate as Timestamp }),
        paymentDate: convertTimestampFirebaseToDate({ date: data.paymentDate as Timestamp }),
        startDate: convertTimestampFirebaseToDate({ date: data.startDate as Timestamp }),
        updateAt: convertTimestampFirebaseToDate({ date: data.updateAt as Timestamp }),
        createAt: convertTimestampFirebaseToDate({ date: data.createAt as Timestamp }),
    }
    const [isEdit, setEdit] = useState(false)
    return (
        <>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger><div className="font-semibold text-blue-500 cursor-pointer">{id}</div></SheetTrigger>
                <SheetContent size={'full'} className='h-screen overflow-y-auto pb-20'>
                    <SheetHeader>
                        <SheetTitle className='flex items-center gap-4'>
                            {isEdit ? 'Cập nhật thông tin phiếu đăng ký' :
                                'Thông tin phiếu đăng ký'}
                            <Button onClick={() => setEdit(!isEdit)} variant={isEdit ? 'default' : 'secondary'}><EditIcon /></Button>
                        </SheetTitle>
                    </SheetHeader>
                    <div className={isEdit ? 'pointer-events-auto' : 'pointer-events-none'}>
                        <RegisterForm triggerDialog={setOpen} initialValue={initValue} mode={isEdit ? 'edit' : 'view'} />
                    </div>
                </SheetContent>
            </Sheet >
        </>
    )
}