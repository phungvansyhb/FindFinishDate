import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs'
import RegisterForm from './components/screen/RegisterForm'
import { TABS } from './lib/utils'
import Students from './components/screen/students/Students'
import { Toaster } from './components/Toaster'


function App() {
  return (
    <>
      <Tabs defaultValue={TABS.REGISTER} className="w-full ">
        <TabsList className="grid  grid-cols-2 ">
          <TabsTrigger value={TABS.REGISTER}>Register</TabsTrigger>
          <TabsTrigger value={TABS.STUDENTS}>Student</TabsTrigger>
        </TabsList>
        <TabsContent value={TABS.REGISTER}>
          <RegisterForm />
        </TabsContent>
        <TabsContent value={TABS.STUDENTS}>
          <Students />
        </TabsContent>
      </Tabs>
      <Toaster />
    </>
  )
}

export default App
