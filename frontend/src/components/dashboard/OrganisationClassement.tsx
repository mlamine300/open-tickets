import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"


function OrganisationClassement({data}:{data:any}) {
  return (
     <BarChart
      style={{ width: '100%', maxWidth: '700px', maxHeight: '70vh', aspectRatio: 1.618 }}
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
      <XAxis dataKey="name" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#eeff55" activeBar={{ fill: '#e4963d', stroke: '#9a5d18' }} radius={[10, 10, 0, 0]} />
      
    </BarChart>
  )
}

export default OrganisationClassement
