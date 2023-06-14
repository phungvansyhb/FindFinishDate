import { Button } from "@/components/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { API_QUERY_KEY, DATABASE_KEY, DAYS, beforeCreate } from "@/lib/utils"
import { useCreateDoc, useUpdateDoc } from "@/services/hookBase.service"
import { IClass } from "@/typedefs/IClass"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const formSchema = z.object({

    name: z.string().min(2, {
        message: "Tên học sinh phải dài tối thiểu 2 ký tự",
    }),
    description: z.string().optional(),
    teacher: z.string().optional(),
    status: z.boolean().optional(),
    createAt: z.any(),
    updateAt: z.any(),
    isDeleted: z.boolean(),
    schedule : z.any()
})

type Props = {
    triggerDialog: React.Dispatch<SetStateAction<boolean>>
    initialValue?: Partial<IClass>
    mode?: 'view' | 'edit' | 'create'
}

export function ClassroomForm({ triggerDialog, initialValue, mode = 'create' }: Props) {
    const queryClient = useQueryClient()
    const createClassMutation = useCreateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.CLASS, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_CLASSROOM] })
    const updateClassMutation = useUpdateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.CLASS, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_CLASSROOM] })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue || {
            status: true,
            description: '',
            teacher: '',
            createAt: new Date(),
            updateAt: new Date(),
            isDeleted: false,

        },
    })
    const [schedule, setSchedule] = useState<number[]>(initialValue?.schedule ?? [])

    function handleAddSchedule(date: number) {
        const temp = new Set(schedule);
        if (temp.has(date)) {
            temp.delete(date)
        } else {
            temp.add(date)
        }
        setSchedule(Array.from(temp))
        form.setValue("schedule", Array.from(temp))
    }
    function renderButtonSchedule(dayName: { value: number, label: string }) {
        return <button type='button' className={schedule?.includes(dayName.value) ? 'bg-black text-white font-bold' : ''}
            onClick={() => handleAddSchedule(dayName.value)}>{dayName.label}</button>

    }
    function onSubmit(values: z.infer<typeof formSchema>) {
        values.status = true;
        beforeCreate(values)
        if (mode === 'create') {
            createClassMutation.mutate(values)
        } else {
            updateClassMutation.mutate({ ...values, id: initialValue?.id })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên lớp</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên lớp" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="teacher"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên giáo viên</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên giáo viên" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <br />
                <FormLabel>Lịch học</FormLabel>
                <div className="flex flex-wrap gap-2"  >
                    {DAYS.map(item => <div key={item.value}>
                        {renderButtonSchedule(item)}
                    </div>)}
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Mô tả lớp họp"
                                    className="resize-y"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {
                    mode === 'create' &&
                    <Button type="submit" > {createClassMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu</Button>
                }
                {
                    mode === 'edit' &&
                    <Button type="submit" > {updateClassMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cập nhật</Button>
                }
            </form>
        </Form>
    )
}
