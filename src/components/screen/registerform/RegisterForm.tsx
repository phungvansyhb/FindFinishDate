import { CurrencyInput } from "@/components/CurrencyInput"
import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { API_QUERY_KEY, DATABASE_KEY, DAYS, beforeCreate, cn } from "@/lib/utils"
import { useCreateDoc, useGetListDoc, useUpdateDoc } from "@/services/hookBase.service"
import { IRegisterForm } from "@/typedefs/IRegisterForm"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import dayjs from "dayjs"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { SetStateAction, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const formSchema = z.object({
    className: z.string(),
    classId: z.any(),
    studentName: z.string(),
    studentId: z.any(),
    paymentDate: z.any().optional(),
    startDate: z.any().optional(),
    receiveMoney: z.string().optional(),
    lessonCost: z.string(),
    schedule: z.number().array(),
    createAt: z.any(),
    updateAt: z.any(),
    isDeleted: z.boolean(),
    status: z.boolean(),
    nextPaymentDate: z.any()
})

type Props = {
    triggerDialog: React.Dispatch<SetStateAction<boolean>>
    initialValue?: Partial<IRegisterForm>
    mode?: 'view' | 'edit' | 'create'
}

export function RegisterForm({ triggerDialog, initialValue, mode = 'create' }: Props) {
    const queryClient = useQueryClient()
    const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
    const [money, setmoney] = useState(() => {
        if (initialValue) {
            return parseInt(initialValue.receiveMoney as string)
        } else return 0
    })
    const [moneyPerLesson, setmoneyPerLesson] = useState(() => {
        if (initialValue) {
            return parseInt(initialValue.lessonCost as string)
        } else return 0
    })
    const [schedule, setSchedule] = useState<number[]>(initialValue?.schedule ?? [])

    const numberLesson = useMemo(() => {
        return Math.floor(money / moneyPerLesson)
    }, [money, moneyPerLesson])
    const endDate = useMemo(() => findCourseEndDate, [schedule, startDate, numberLesson])
    const { data: listStudent } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_STUDENT, dbKey: DATABASE_KEY.STUDENT })
    const { data: listClass } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_CLASSROOM, dbKey: DATABASE_KEY.CLASS })
    const createRegisterMutation = useCreateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_REGISTERFORM] })
    const updateRegisterMutation = useUpdateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_REGISTERFORM] })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue || {
            classId: '',
            studentId: '',
            paymentDate: new Date(),
            startDate: new Date(),
            receiveMoney: "0",
            lessonCost: "0",
            // schedule: [DAY_ARRAY[dayjs().day()]],
            status: true,
            createAt: new Date(),
            updateAt: new Date(),
            isDeleted: false
        },
    })

    function findCourseEndDate() {
        if (schedule && schedule?.length !== 0) {
            let currentDate = startDate;
            let remainSessions = numberLesson;
            while (remainSessions > 0) {
                if (schedule.includes(currentDate.day())) {
                    remainSessions--;
                }
                currentDate = currentDate.add(1, 'day');
            }
            return currentDate;
        }
        else return false
    }
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
        return <button type='button' className={schedule?.includes(dayName.value) ? 'bg-blue-600 text-white font-bold' : ''}
            onClick={() => handleAddSchedule(dayName.value)}>{dayName.label}</button>

    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        values.status = true;
        values.nextPaymentDate = (endDate() as dayjs.Dayjs).toDate()
        console.log(values)
        beforeCreate(values)
        if (mode === 'create') {
            createRegisterMutation.mutate(values)
        } else {
            updateRegisterMutation.mutate({ ...values, id: initialValue?.id })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4 justify-between self-stretch">
                    {listStudent && <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                            <FormItem className="flex flex-col flex-1">
                                <FormLabel>Học sinh</FormLabel>
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
                                                    ? listStudent?.find(
                                                        (std) => std.name?.toLowerCase() === field.value
                                                    )?.name
                                                    : "Chọn học sinh"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command >
                                            <CommandInput placeholder="Tìm kiếm học sinh..."
                                            />
                                            <CommandEmpty >
                                                <Button onClick={(value: any) => {
                                                    form.setValue("studentName", value)
                                                }}>Add</Button>
                                            </CommandEmpty>
                                            <CommandGroup >
                                                {listStudent?.map((student) => (
                                                    <CommandItem
                                                        value={student.name}
                                                        key={student.id}
                                                        onSelect={(value: any) => {
                                                            console.log(student)
                                                            form.setValue("studentName", value)
                                                            form.setValue("studentId", student.id)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                student.name?.toLowerCase() === field.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                        {student.name}
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
                    {listClass && <FormField
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
                                                    ? listClass?.find(
                                                        (classroom) => classroom.name?.toLowerCase() === field.value
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
                                                Not found
                                            </CommandEmpty>
                                            <CommandGroup >
                                                {listClass?.map((classroom) => (
                                                    <CommandItem
                                                        value={classroom.name}
                                                        key={classroom.id}
                                                        onSelect={(value: any) => {
                                                            console.log(classroom)
                                                            form.setValue("className", value)
                                                            form.setValue("classId", classroom.id)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                classroom.name?.toLowerCase() === field.value
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
                </div>
                <div className="flex gap-4 justify-between">
                    <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel className="block">Ngày nộp tiền : </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
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
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startDate"

                        render={({ field }) => (
                            <FormItem onChange={e => setStartDate(dayjs(e.timeStamp))} className="flex-1">
                                <FormLabel className="block">Ngày bắt đầu dự kiến : </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
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
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                            }
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
                    name="receiveMoney"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số tiền nộp</FormLabel>
                            <FormControl>
                                <CurrencyInput {...field} value={money} setValue={(value) => {
                                    setmoney(value)
                                    field.onChange(value)

                                }} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lessonCost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Giá mỗi buổi học</FormLabel>
                            <FormControl>
                                <CurrencyInput {...field} value={moneyPerLesson} setValue={(value) => {
                                    setmoneyPerLesson(value)
                                    field.onChange(value)
                                }} />
                            </FormControl>
                            <FormDescription>Số buổi học : {isNaN(numberLesson) ? 'Không xác định' : numberLesson}</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-wrap gap-2"  >
                    {DAYS.map(item => <div key={item.value}>
                        {renderButtonSchedule(item)}
                    </div>)}
                </div>
                <FormDescription>Ngày đóng tiến tiếp theo : {endDate() !== false ? (endDate() as dayjs.Dayjs).locale('vi').format('dddd, DD-MMMM-YYYY') : 'Chưa xác định'} </FormDescription>
                {
                    mode === 'create' &&
                    <Button type="submit" > {createRegisterMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu</Button>
                }
                {
                    mode === 'edit' &&
                    <Button type="submit" > {updateRegisterMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cập nhật</Button>
                }
            </form>
        </Form >
    )
}


