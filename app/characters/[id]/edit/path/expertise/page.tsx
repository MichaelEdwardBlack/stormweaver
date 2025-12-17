import { ExpertiseTable } from "./components/ExpertiseTable";

export default function ExpertisePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Select Additional Expertises</h1>
      <div className="scrollbar-thin">
        <ExpertiseTable />
      </div>
    </div>
  );
}
