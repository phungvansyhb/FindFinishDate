import { useMemo, useState } from 'react'
import './App.css'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { DAYS } from './util'
import CurrencyInput from './CurrencyInput'



function App() {
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [money, setmoney] = useState(0)
  const [moneyPerLesson, setmoneyPerLesson] = useState(0)
  const [schedule, setSchedule] = useState<number[]>()

  function handleAddSchedule(date: number) {
    const temp = new Set(schedule);
    if (temp.has(date)) {
      temp.delete(date)
    } else {
      temp.add(date)
    }
    setSchedule(Array.from(temp))
  }
  function renderButtonSchedule(dayName: { value: number, label: string }) {
    return <button type='button' className={schedule?.includes(dayName.value) ? 'bg-blue-600 text-white font-bold' : ''} onClick={() => handleAddSchedule(dayName.value)}>{dayName.label}</button>

  }
  const numberLesson = useMemo(() => {
    return Math.floor(money / moneyPerLesson)
  }, [money, moneyPerLesson])



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
  const endDate = useMemo(() => findCourseEndDate, [schedule, startDate, numberLesson])


  return (
    <section>

      <div className='flex flex-col gap-4 py-8'>
        <p className="text-4xl font-bold mb-4">
          Đơn đăng ký học
        </p>
        <label htmlFor='class' className='font-semibold text-left'>Tên lớp</label>
        <input name='class' id='class' className="form-input px-4 py-3 rounded-full dark:text-black" placeholder='Tên lớp' />

        <label htmlFor='studentName' className='font-semibold text-left'>Tên học sinh</label>
        <input name='studentName' id='studentName' className="form-input px-4 py-3 rounded-full dark:text-black" placeholder='Tên học sinh' />

        <label htmlFor='payDate' className='font-semibold text-left'>Ngày nộp tiền (ngày/tháng/năm)</label>
        <input type="date" name='payDate' id='payDate' className="form-input px-4 py-3 rounded-full dark:text-black" placeholder='Ngày học dự kiến' />

        <label htmlFor='startDate' className='font-semibold text-left'>Ngày bắt đầu dự kiến (ngày/tháng/năm)</label>
        <input type="date" name='startDate' defaultValue={dayjs().format('YYYY-MM-DD')} id='startDate' className="form-input px-4 py-3 rounded-full dark:text-black" placeholder='Ngày học dự kiến' onChange={(e) => {
          console.log(dayjs(e.target.valueAsDate).day())
          setStartDate(dayjs(e.target.valueAsDate))
        }} />


        <label htmlFor='totalCost' className='font-semibold text-left'>Sô tiền nộp (vnđ)</label>

        <CurrencyInput value={money} setValue={setmoney} />

        <label htmlFor='numberLesson' className='font-semibold text-left'>Đơn giá (vnđ/1 buổi)</label>

        <CurrencyInput value={moneyPerLesson} setValue={setmoneyPerLesson} />
        <div className='text-left font-xs text-slate-500'>Số buổi học :  {numberLesson ? numberLesson : 0} </div>
        <label htmlFor='numberLesson' className='font-semibold text-left'>Lịch học</label>
        <div className='flex gap-4 flex-wrap'>
          {DAYS.map(item => <div key={item.value}>
            {renderButtonSchedule(item)}
          </div>)}
        </div>
        <div className='text-xl text-slate-500 mt-4 font-semibold'>
          Ngày hoàn thành khóa học : {endDate() !== false ? (endDate() as dayjs.Dayjs).locale('vi').format('dddd, DD-MMMM-YYYY') : 'Chưa xác định'} </div>

      </div>
    </section>
  )
}

export default App
