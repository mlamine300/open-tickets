
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts';

function FormNameRadarChart({data}:{data:any}) {
  return (
    <div className='flex flex-col gap-0 w-full'>
 <h3 className='w-full text-start px-8 italic font-semibold'>Motifs des réclamations</h3>
    <RadarChart
      style={{
        // width: '90%',
        // height: '100%',
        // maxWidth: '100%',
        // maxHeight: '60vh',
        aspectRatio: 1,
      }}
      responsive
      outerRadius="90%"
      data={data}
      margin={{
        top: 0,
        left: 20,
        right: 20,
        bottom: 0,
      }}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="motif"  tick={<WrappedTick />} />
      <PolarRadiusAxis />
      <Radar
        name="types de réclamations"
        dataKey="value"
        stroke="#563da4"
        fill="#567df4"
        fillOpacity={0.6}
        
      />
      <Tooltip/>
      
    </RadarChart>
    </div>
  );
  
}

const WrappedTick = (props:any) => {
  const { x, y, payload, textAnchor } = props;
  // Split label by space or use a logic to split every N characters
  const words = payload.value.split(' '); 

  return (
    <text x={x} y={y} textAnchor={textAnchor} fill="#666" fontSize={12}>
      {words.map((word:string, index:number) => (
        <tspan className='text-center min-w-96' x={x} dy={index === 0 ? 0 : '1.2em'} key={index}>
          {word}
        </tspan>
      ))}
    </text>
  );
};
export default FormNameRadarChart
