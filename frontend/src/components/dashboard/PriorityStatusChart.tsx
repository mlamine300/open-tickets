import {  Legend, Pie, PieChart, Tooltip } from 'recharts';

function PriorityStatusChart({statusData,priorityData, isAnimationActive = true }: {statusData:any;priorityData:any; isAnimationActive?: boolean }) {
  return (
    <div className='flex flex-col gap-0'>
 <h3 className='w-full text-start px-8 italic font-semibold'>Status & Priority </h3>
    <PieChart className='mx-4'  style={{ width: '90%', maxWidth: '400px', maxHeight: '60vh', aspectRatio: 1 ,marginTop:0 }} responsive>
    
      <Pie
        data={statusData}
        innerRadius="20%"
        outerRadius="30%"
        // Corner radius is the rounded edge of each pie slice
        cornerRadius="50%"
        
        label
        paddingAngle={5}
        dataKey="value"
        isAnimationActive={isAnimationActive}
        />
        <Pie
        data={priorityData}
        innerRadius="60%"
        outerRadius="80%"
        // Corner radius is the rounded edge of each pie slice
        cornerRadius="50%"
        
        label
        paddingAngle={5}
        dataKey="value"
        isAnimationActive={isAnimationActive}
        />
      
       <Legend />
         <Tooltip/>
    </PieChart>
        </div>
  )
}

export default PriorityStatusChart
