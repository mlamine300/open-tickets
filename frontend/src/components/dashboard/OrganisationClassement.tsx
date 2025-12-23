import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function OrganisationClassement({
  data,
  fill,
  fillActive,
  strokeActive,
  title
}: {
  data: any;
  fill: string;
  fillActive?: string;
  strokeActive?: string;
  title:string;
}) {
  return (
   <section className="flex flex-col gap-0 w-full h-full">
    <h3 className="text-sm font-semibold italic">{title}</h3>
     <BarChart
      className="w-full "
      style={{ aspectRatio: 1.618, width:'100%',height:'100%'  }}
      data={data}
      layout="vertical"   // ✅ vertical bars
      margin={{
        top: 0,
        right: 10,
        left: 10,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      {/* X axis = values */}
      <XAxis type="number" />

      {/* Y axis = categories */}
      <YAxis
        type="category"
        dataKey="name"
        width={250}
        
        className="text-xs text-red-500"
      />

      <Tooltip />
      <Legend className="text-xs" />

      <Bar
        dataKey="count"
        fill={fill || "#eeff55"}
        activeBar={{
          fill: fillActive || "#e4963d",
          stroke: strokeActive || "#9a5d18",
        }}
        barSize={10}
        radius={[0, 10, 10, 0]} // rounded right side
      />
    </BarChart>
   </section>
  );
}

export default OrganisationClassement;
