import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import * as dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import weekend from 'dayjs/plugin/weekday'
import { DAYS, DAY_ARRAY } from './util'

dayjs.extend(calendar)
dayjs.extend(weekend)

function App() {
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs())
  const [money, setmoney] = useState(0)
  const [moneyPerLesson, setmoneyPerLesson] = useState(0)
  const [schedule, setSchedule] = useState<number[]>()
  const [endDate, setEndDate] = useState()
  // Asssign Sunday is start of week
  dayjs().weekday(0)

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

  const dayStartOnWeek = useMemo(() => {
    return { value: dayjs(startDate).date(), label: DAY_ARRAY[dayjs(startDate).date()] }
  }, [startDate])

  const nextPayDate = useMemo(() => {
    dayjs(startDate).day()
  }, [
    startDate, schedule
  ])
  function warningStartDate() {
    alert(`Ngày bắt đầu lệch lịch học`)
  }
  function findFinishDate() {
    if (schedule?.length) {
      const numberWeek = Math.floor(numberLesson / schedule?.length)
      const oddlessson = numberLesson - numberWeek * schedule.length
      console.log(dayjs().weekday(7 * numberLesson).toString())

    }
  }

  // console.log(dayjs().weekday(7).toString())

  useEffect(() => {
    findFinishDate()
    if (schedule && !schedule?.includes(dayStartOnWeek.value)) {
      // warningStartDate()
    }
  }, [schedule])
  return (
    <>
      <p className="text-3xl font-bold mb-4">
        RegisterForm
      </p>
      <div className='flex flex-col gap-4'>
        <label htmlFor='class' className='font-semibold text-left'>Tên lớp</label>
        <input name='class' id='class' className="form-input px-4 py-3 rounded-full" placeholder='Tên lớp' />

        <label htmlFor='studentName' className='font-semibold text-left'>Tên học sinh</label>
        <input name='studentName' id='studentName' className="form-input px-4 py-3 rounded-full" placeholder='Tên học sinh' />

        <label htmlFor='payDate' className='font-semibold text-left'>Ngày nộp tiền</label>
        <input type="date" name='payDate' id='payDate' className="form-input px-4 py-3 rounded-full" placeholder='Ngày học dự kiến' />

        <label htmlFor='startDate' className='font-semibold text-left'>Ngày bắt đầu dự kiến</label>
        <input type="date" name='startDate' defaultValue={dayjs().format('YYYY-MM-DD')} id='startDate' className="form-input px-4 py-3 rounded-full" placeholder='Ngày học dự kiến' onChange={(e) => {
          console.log(dayjs(e.target.valueAsDate).day())
          setStartDate(dayjs(e.target.valueAsDate))
        }} />


        <label htmlFor='totalCost' className='font-semibold text-left'>Sô tiền nộp (vnđ)</label>
        <input type="number" name='totalCost' id='totalCost' className="form-input px-4 py-3 rounded-full" placeholder='Giá khóa học' prefix='vnd' onChange={e => setmoney(e.target.valueAsNumber)} />

        <label htmlFor='numberLesson' className='font-semibold text-left'>Đơn giá (1 buổi)</label>
        <input type="number" name='numberLesson' defaultValue={100_000} id='numberLesson' className="form-input px-4 py-3 rounded-full" placeholder='Đơn giá (1 buổi)' prefix='vnd' onChange={e => setmoneyPerLesson(e.target.valueAsNumber)} />
        <div className='text-left font-xs text-slate-500'>Số buổi học :  {numberLesson ? numberLesson : 0} </div>
        <label htmlFor='numberLesson' className='font-semibold text-left'>Lịch học</label>
        <div className='flex gap-4'>
          {DAYS.map(item => renderButtonSchedule(item))}
        </div>
        {/* {
          schedule && !schedule?.includes(dayStartOnWeek.value) &&
          <div className='text-red-500 text-left font-bold'>Ngày bắt đầu dự kiến là: {dayStartOnWeek.label}</div>
        } */}
        <div className='font-xs text-slate-500 text-left font-semibold'>Ngày đóng tiền tiếp theo : 12 </div>

      </div>
    </>
  )
}

export default App
