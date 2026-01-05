const SkeletonCell = ({ width = "w-full" }: { width?: string }) => (
  <div className={`h-4 ${width} rounded bg-neutral-700 animate-pulse`} />
);

const SkeletonButton = () => <div className="h-8 w-20 rounded bg-neutral-700 animate-pulse" />;

export const LoadingTable = ({ rows = 6 }: { rows?: number }) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Name</th>
          <th>Damage</th>
          <th>Range</th>
          <th>Traits</th>
          <th>Expert Traits</th>
          <th>Weight</th>
          <th>Price</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="opacity-80">
            <td>
              <SkeletonCell width="w-32" />
            </td>
            <td>
              <SkeletonCell width="w-24" />
            </td>
            <td>
              <SkeletonCell width="w-28" />
            </td>
            <td>
              <SkeletonCell width="w-40" />
            </td>
            <td>
              <SkeletonCell width="w-40" />
            </td>
            <td>
              <SkeletonCell width="w-12" />
            </td>
            <td>
              <SkeletonCell width="w-16" />
            </td>
            <td>
              <SkeletonButton />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
