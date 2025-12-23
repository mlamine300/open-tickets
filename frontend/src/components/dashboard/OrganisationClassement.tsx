import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"


function OrganisationClassement({data,fill,fillActive,strokeActive}:{data:any,fill:string,fillActive?:string,strokeActive?:string}) {
  return (
     <BarChart
     
      style={{ width: '100%', maxWidth: '80dvw', maxHeight: '70vh', aspectRatio: 1.618 }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" width={"auto"} className="" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend className="text-xs" />
      <Bar dataKey="count" fill={fill||"#eeff55"} activeBar={{ fill: fillActive||'#e4963d', stroke: strokeActive||'#9a5d18' }} radius={[10, 10, 0, 0]} />
      
    </BarChart>
  )
}

export default OrganisationClassement
