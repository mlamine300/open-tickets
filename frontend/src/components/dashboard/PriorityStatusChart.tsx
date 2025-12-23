import {  Legend, Pie, PieChart, Tooltip } from 'recharts';

function PriorityStatusChart({statusData,priorityData, isAnimationActive = true }: {statusData:any;priorityData:any; isAnimationActive?: boolean }) {
  return (
    <div className='flex flex-col gap-0 w-full'>
 <h3 className='w-full text-start px-8 italic font-semibold'>Status & Priority </h3>
    <PieChart className='mx-4' style={{width:'100%', height:'100%'}}   responsive>
    
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
