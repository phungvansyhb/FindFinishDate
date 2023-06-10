import { Button } from "@/components/button"
import { Calendar } from "@/components/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form"
import { Input } from "@/components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Textarea } from "@/components/textarea"
import { API_QUERY_KEY, DATABASE_KEY, beforeCreate, cn } from "@/lib/utils"
import { useCreateDoc, useUpdateDoc } from "@/services/hookBase.service"
import { CHANNEL, GRADE, IStudent, WOM } from "@/typedefs/IStudent"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { SetStateAction } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"


const formSchema = z.object({
    email: z.string().optional(),
    phone: z.string().optional(),
    name: z.string().min(2, {
        message: "Tên học sinh phải dài tối thiểu 2 ký tự",
    }),
    parent: z.string().optional(),
    noteContact: z.string().optional(),
    grade: z.any().optional(),
    school: z.string().optional(),
    entryTest: z.any().optional(),
    social: z.string().optional(),
    wom: z.nativeEnum(WOM).optional(),
    channel: z.nativeEnum(CHANNEL).optional(),
    note: z.string().optional(),
    location: z.string().optional(),
    status: z.boolean().optional(),
    lastContactDate: z.any().optional(),
    createAt: z.any(),
    updateAt: z.any(),
    isDeleted: z.boolean()
})

type Props = {
    triggerDialog: React.Dispatch<SetStateAction<boolean>>
    initialValue?: Partial<IStudent>
    mode?: 'view' | 'edit' | 'create'
}

export function StudentForm({ triggerDialog, initialValue, mode = 'create' }: Props) {
    const queryClient = useQueryClient()
    const createStudentMutation = useCreateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.STUDENT, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_STUDENT] })
    const updateStudentMutation = useUpdateDoc({ queryClient, successHandler: () => triggerDialog(false), dbKey: DATABASE_KEY.STUDENT, invalidateQueryKey: [API_QUERY_KEY.GET_LIST_STUDENT, API_QUERY_KEY.GET_LIST_REGISTERFORM] })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValue || {
            grade: '5',
            entryTest: '5',
            channel: CHANNEL.ZALO,
            status: true,
            email: '',
            phone: '',
            parent: '',
            noteContact: '',
            location: '',
            note: '',
            school: 'Vin',
            lastContactDate: new Date(),
            wom: WOM.A,
            createAt: new Date(),
            updateAt: new Date(),
            isDeleted: false
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        values.status = true;
        beforeCreate(values)
        if (mode === 'create') {
            createStudentMutation.mutate(values)
        } else {
            updateStudentMutation.mutate({ ...values, id: initialValue?.id })
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
                            <FormLabel>Tên học sinh</FormLabel>
                            <FormControl>
                                <Input placeholder="Tên học sinh" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="grade"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lớp </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn lớp" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(GRADE).map(item =>
                                            <SelectItem value={item} key={item}>{item}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="entryTest"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Điểm đầu vào </FormLabel>
                                <FormControl>
                                    <Input placeholder="entryTest " {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ghi chú </FormLabel>
                            <FormControl>
                                <Textarea
                                    className="resize"
                                    placeholder="Ghi chú cho học sinh"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* -===============Contact ========================== */}
                <div>Contact</div>
                <div className="border p-2 rounded-lg flex gap-2 flex-col">
                    <div className="grid grid-cols-2 justify-between gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email </FormLabel>
                                    <FormControl>
                                        <Input placeholder="email " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone </FormLabel>
                                    <FormControl>
                                        <Input placeholder="phone " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="parent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bố mẹ </FormLabel>
                                <FormControl>
                                    <Input placeholder="Bố mẹ " {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Địa điểm </FormLabel>
                                <FormControl>
                                    <Input placeholder="Địa điểm " {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastContactDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="block">Ngày gọi điện cuối : </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
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
                        name="noteContact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ghi chú nội dung chăm sóc</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ghi chú nội dung chăm sóc"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* -===============Source ========================== */}

                <div>Source</div>
                <div className="border p-2 rounded-lg gap-2 flex flex-col">
                    <FormField
                        control={form.control}
                        name="school"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trường học </FormLabel>
                                <FormControl>
                                    <Input placeholder="School " {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>WOM </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn lớp" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(WOM).map(item =>
                                                <SelectItem value={item} key={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="channel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kênh </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn lớp" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(CHANNEL).map(item =>
                                                <SelectItem value={item} key={item}>{item}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {
                    mode === 'create' &&
                    <Button type="submit" > {createStudentMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu</Button>
                }
                {
                    mode === 'edit' &&
                    <Button type="submit" > {updateStudentMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Cập nhật</Button>
                }
            </form>
        </Form>
    )
}
