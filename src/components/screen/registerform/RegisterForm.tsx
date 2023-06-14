import { CurrencyInput } from "@/components/CurrencyInput"
import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/form"
import { Input } from "@/components/input"
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
import { useFieldArray, useForm } from "react-hook-form"
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
    nextPaymentDate: z.any(),
    teacherAbsents: z.any()
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
            isDeleted: false,
            teacherAbsents: []
        },
    })
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "teacherAbsents"
    });
    function findCourseEndDate() {
        if (schedule && schedule?.length !== 0) {
            let currentDate = startDate;
            let remainSessions = numberLesson + fields.length;
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
    const endDate = useMemo(() => findCourseEndDate, [schedule, startDate, numberLesson, fields])
    const { data: listStudent } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_STUDENT, dbKey: DATABASE_KEY.STUDENT, whereClause: [["status", '==', true] , ["classId" , "==","1u263871623"]] })
    const { data: listClassRoom } = useGetListDoc({ queryKey: API_QUERY_KEY.GET_LIST_CLASSROOM, dbKey: DATABASE_KEY.CLASS, whereClause: [["status", '==', true]] })
    const createRegisterMutation = useCreateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_REGISTERFORM] })
    const updateRegisterMutation = useUpdateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.REGISTER_FORM, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_REGISTERFORM] })



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
        values.nextPaymentDate = (endDate() as dayjs.Dayjs).toDate()
        beforeCreate(values)
        console.log(values)
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
                                                        (std) => std.name?.toLowerCase() === field.value?.toLowerCase()
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
                                                Not found ...
                                            </CommandEmpty>
                                            <CommandGroup >
                                                {listStudent?.map((student) => (
                                                    <CommandItem
                                                        value={student.name}
                                                        key={student.id}
                                                        onSelect={(value: any) => {
                                                            form.setValue("studentName", value)
                                                            form.setValue("studentId", student.id)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                student.name?.toLowerCase() === field.value?.toLowerCase()
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
                            <FormItem

                                className="flex-1">
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
                                            onSelect={e => {
                                                // console.log(e)
                                                setStartDate(dayjs(e))
                                                field.onChange(e)
                                            }
                                            }
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
                <br />
                <FormLabel>Lịch học</FormLabel>
                <div className="flex flex-wrap gap-2"  >
                    {DAYS.map(item => <div key={item.value}>
                        {renderButtonSchedule(item)}
                    </div>)}
                </div>
                <div>
                    <FormLabel className="flex justify-between items-center">
                        Giáo viên nghỉ:
                        <Button variant={'secondary'} className="text-right" onClick={() => append({ reason: "", date: "" })} type="button">Thêm</Button>
                    </FormLabel>
                    {fields.map((item, index) => (
                        <li key={item.id} className="border p-3 rounded-lg mt-2 relative">
                            <FormField
                                control={form.control}
                                name={`teacherAbsents.${index}.date`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="block">Ngày nghỉ: </FormLabel>
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
                            <FormField
                                control={form.control}
                                name={`teacherAbsents.${index}.reason`}
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Lý do nghỉ dạy</FormLabel>
                                        <FormControl>
                                            <Input placeholder="li do nghi" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <button type="button" className="absolute top-0 right-0" onClick={() => remove(index)}>Xóa</button>
                        </li>
                    ))}

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


