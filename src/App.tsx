import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs'

import { Toaster } from './components/Toaster'
import ClassRoom from './components/screen/classroom/ClassRoom'
import RegisterManage from './components/screen/registerform/RegisterManage'
import Students from './components/screen/students/Students'
import { TABS } from './lib/utils'
import { useLocalStorage } from 'usehooks-ts'
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription } from './components/dialog'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from './components/form'
import { Input } from './components/input'
import { Button } from './components/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from './components/use-toast'


function App() {
  const [credential, setCredential] = useLocalStorage('findFinishDate::credential', { uname: '', pw: '' })
  const formSchema = z.object({
    userName: z.string(),
    password: z.string()

  })
  function checkCredential(uname: string, pw: string) {
    return uname === import.meta.env.VITE_USERNAME && pw === import.meta.env.VITE_USERPASS
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (checkCredential(values.userName, values.password)) {
      setCredential({ uname: values.userName, pw: values.password })
      toast({ title: 'Xin chào bạn đã quay trở lại', variant: 'success' })
    } else {
      toast({ description: "Đăng nhập thất bại. Vui lòng thử lại!", variant: 'destructive', })
    }
  }

  if (checkCredential(credential.uname, credential.pw))
    return (
      <>
        <Tabs defaultValue={TABS.REGISTER} className="w-full ">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value={TABS.REGISTER}>Register</TabsTrigger>
            <TabsTrigger value={TABS.STUDENTS}>Student</TabsTrigger>
            <TabsTrigger value={TABS.CLASSROOM}>ClassRoom</TabsTrigger>
          </TabsList>
          <TabsContent value={TABS.REGISTER}>
            <RegisterManage />
          </TabsContent>
          <TabsContent value={TABS.STUDENTS}>
            <Students />
          </TabsContent>
          <TabsContent value={TABS.CLASSROOM}>
            <ClassRoom />
          </TabsContent>
        </Tabs>
        <Toaster />
      </>
    )
  else {
    return <Dialog open={true} >
      <DialogContent>
        <DialogHeader >
          <DialogTitle>Đăng nhập để sử dụng</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên đăng nhập" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input placeholder="Mật khẩu" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" >
                {/* {createClassMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}  */}
                Đăng nhập</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
      <Toaster />
    </Dialog>
  }
}

export default App
