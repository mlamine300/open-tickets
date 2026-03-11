import {  Legend, Pie, PieChart, Tooltip } from 'recharts';

// Custom label renderer for Pie slices
const renderLabel = (entry: any) => `${entry.name}: ${entry.value}`;

function PriorityStatusChart({statusData,priorityData, isAnimationActive = true }: {statusData:any;priorityData:any; isAnimationActive?: boolean }) {
  return (
    <div className='flex flex-col gap-0 w-full max-h-200'>
 <h3 className='w-full text-start px-8 italic font-semibold'>Statuts & Priorités </h3>
    <PieChart className='mx-4' style={{width:'100%', height:'100%'}}   responsive>
    
      <Pie
        data={priorityData}
        innerRadius="20%"
        outerRadius="25%"
        cornerRadius="10%"
        label={renderLabel}
        paddingAngle={5}
        dataKey="value"
        isAnimationActive={isAnimationActive}
      />
      <Pie
        data={statusData}
        innerRadius="60%"
        outerRadius="70%"
        cornerRadius="10%"
        label={renderLabel}
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
