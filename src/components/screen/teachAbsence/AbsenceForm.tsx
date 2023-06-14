import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Textarea } from "@/components/textarea"
import { API_QUERY_KEY, DATABASE_KEY, beforeCreate, cn } from "@/lib/utils"
import { useCreateDoc, useGetListDoc, useUpdateBatchDoc, useUpdateDoc } from "@/services/hookBase.service"
import { IAbsenceForm } from "@/typedefs/IAbsenceForm"
import { IClass } from "@/typedefs/IClass"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { SetStateAction, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const formSchema = z.object({
    absenceDate: z.any(),
    reason: z.string(),
    classId: z.string(),
    className: z.string(),
    status: z.boolean().optional(),
    createAt: z.any(),
    updateAt: z.any(),
    isDeleted: z.boolean()
})

type Props = {
    triggerDialog: React.Dispatch<SetStateAction<boolean>>
    initialValue?: Partial<IAbsenceForm>
    mode?: 'view' | 'edit' | 'create'
}

export function AbsenceForm({ triggerDialog, initialValue, mode = 'create' }: Props) {

    const [seletedClass, setSelectedClass] = useState<IClass>()

    const queryClient = useQueryClient()
    const updateRegisterForm = useUpdateBatchDoc({ dbKey: DATABASE_KEY.REGISTER_FORM, amount: 1 })

    const createAbsenceMutation = useCreateDoc({
        queryClient, successHandler: () => {
            updateRegisterForm.mutate([['classId', '==', form.watch('classId')], ['status', '==', true], ['isDeleted', '==', false], ['startDate', '>=', form.watch('absenceDate')]],)
            triggerDialog(false)
        }, dbKey: DATABASE_KEY.ABSENCE_FORM, invalidateQueryKey: [API_QUERY_KEY.GETLIST_ABSENCEFORM]
    })
    const updateAbsenceMutation = useUpdateDoc({
        queryClient, successHandler: () => {
            updateRegisterForm.mutate([['classId', '==', form.watch('classId')], ['status', '==', true], ['isDeleted', '==', false]])
            triggerDialog(false)
        }, dbKey: DATABASE_KEY.ABSENCE_FORM, invalidateQueryKey: [API_QUERY_KEY.GETLIST_ABSENCEFORM]
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue || {
            // absenceDate: new Date(),
            status: true,
            createAt: new Date(),
            updateAt: new Date(),
            isDeleted: false
        },
    })

    const { data: listClassRoom } = useGetListDoc({ dbKey: DATABASE_KEY.CLASS, queryKey: API_QUERY_KEY.GET_LIST_CLASSROOM, whereClause: [['status', '==', true]] })

    function onSubmit(values: z.infer<typeof formSchema>) {
        values.status = true;
        beforeCreate(values)
        if (mode === 'create') {
            createAbsenceMutation.mutate(values)
        } else {
            updateAbsenceMutation.mutate({ ...values, id: initialValue?.id })
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
                    {listClassRoom && <FormField
                        control={form.control}
                        name="className"
                        render={({ field }) => (
                            <FormItem className="flex flex-col flex-1">
                                <FormLabel>Lớp học</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? listClassRoom?.find(
                                                        (classroom) => classroom.name?.toLowerCase() === field.value?.toLowerCase()
                                                    )?.name
                                                    : "Chọn lớp học"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command >
                                            <CommandInput placeholder="Tìm kiếm lớp học..."
                                            />
                                            <CommandEmpty >
                                                Not found...
                                            </CommandEmpty>
                                            <CommandGroup >
                                                {listClassRoom?.map((classroom) => (
                                                    <CommandItem
                                                        value={classroom.name}
                                                        key={classroom.id}
                                                        onSelect={(value: any) => {
                                                            form.setValue("className", value)
                                                            form.setValue("classId", classroom.id)
                                                            setSelectedClass(classroom as IClass)
                                                            form.resetField('absenceDate')
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                classroom.name?.toLowerCase() === field.value?.toLowerCase()
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {classroom.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}
                    <FormField

                        control={form.control}
                        name="absenceDate"
                        render={({ field }) => (
                            <FormItem className="flex-1" >
                                <FormLabel className="block">Ngày nghỉ : </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl >
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            disabled={(date) =>
                                                date < new Date() ||
                                                !(seletedClass && seletedClass?.schedule ? seletedClass.schedule.includes(date.getDay()) : false)
                                            }
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel className="block">Ngày nghỉ : </FormLabel>
                            <FormItem>
                                <Textarea placeholder="Lý do nghỉ học ..." {...field} className="resize-y" />
                            </FormItem>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {
                    mode === 'create' &&
                    <Button type="submit" > {createAbsenceMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu</Button>
                }
                {
                    mode === 'edit' &&
                    <Button type="submit" > {updateAbsenceMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cập nhật</Button>
                }
            </form>
        </Form>
    )
}
