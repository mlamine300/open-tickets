import  { useEffect, useState } from "react";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  //disabled?: boolean;
}

export function TimePicker({
  value = "",
  onChange,
  label = "Time",
  //disabled = false,
}: TimePickerProps) {

    const propsHour=value.split(":")?.at(0)||0;
    const propsMinut=value.split(":")?.at(1)||0;
    const [hour, setHour] = useState(Number(propsHour));
    const [minute, setMinute] = useState(Number(propsMinut));
    const addHour=()=>{
    setHour(h=>h>22?0:h+1)
    }
    const reduceHour=()=>{
        setHour(h=>h<1?23:h-1)
    }

    const addMinute=()=>{
    setMinute(m=>m>=55?0:m+5)
    }
    const reduceMinute=()=>{
        setMinute(m=>m<=5?23:m-5)
    }
useEffect(()=>{
    onChange(`${hour}:${minute}`)
},
[hour,minute])
const buttonClassName="flex text-xs items-center justify-center rounded font-bold active:bg-primary shadow-2xl hover:bg-primary/60 h-8 w-8 p-1 bg-primary/20"
  return (
    <div className="flex flex-col items-start gap-1">
      <label className="text-sm font-medium italic underline">{label}</label>
    <div className="flex items-center gap-px">
        <button className={buttonClassName} onClick={()=>reduceHour()}>-H</button>
        <button className={buttonClassName} onClick={()=>reduceMinute()}>-M</button>
        <div className="flex items-center border-gray-300 border justify-between">
            <input className="peer w-fit px-1 max-w-8 justify-center items-center focus:outline-none"  value={hour} onChange={(e)=>{
            const h=e.target.value;
            if(Number(h)&&Number(h)>0&&Number(h)<24)setHour(Number(h))
                else setHour(0)
        }} />
        <p>:</p>
         <input className="w-fit px-1 max-w-8 justify-center items-center focus:outline-none"  value={minute} onChange={(e)=>{
            const m=e.target.value;
            if(Number(m)&&Number(m)>0&&Number(m)<60)setMinute(Number(m))
                else setMinute(0)
        }} />
        </div>
         <button className={buttonClassName} onClick={()=>addHour()}>+H</button>
        <button className={buttonClassName} onClick={()=>addMinute()}>+M</button>
    </div>
    </div>
  );
}