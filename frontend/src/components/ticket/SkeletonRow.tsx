

const SkeletonRow = ({ columns = 5 }: { columns?: number }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-4 py-6">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
};

export default SkeletonRow;
