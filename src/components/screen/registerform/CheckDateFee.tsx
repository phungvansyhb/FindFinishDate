import { useEffect, useState } from "react";

export default function CheckDateFee({ targetDateStr }: any) {
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);
  const currentDate = new Date();
  const targetDateParts = targetDateStr.split('/');
  const targetDate = new Date(
    parseInt(targetDateParts[2]),
    parseInt(targetDateParts[1]) - 1,
    parseInt(targetDateParts[0])
  );
  console.log(targetDate)
  const differenceInDays = Math.floor(
    (targetDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );

  console.log(differenceInDays)
  useEffect(() => {
    if (differenceInDays === 0) {
      setError(true);
      setWarning(false);
    } else if (differenceInDays <= 7) {
      setError(false);
      setWarning(true);
    } else {
      setError(false);
      setWarning(false);
    }
  }, [differenceInDays]);

  return <div>{error ? <p className="text-red-400 font-bold">{targetDateStr}</p> : warning ? <p className="text-yellow-400 font-bold">{targetDateStr}</p> : <p className="text-emerald-400 font-bold">{targetDateStr}</p>}</div>;
}
