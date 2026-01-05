import { Card } from "@/components/ui/cards/Card";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  marks: number;
};
export const CurrentMarks = ({ marks, ...props }: Props) => {
  return (
    <Card {...props}>
      <span className="text-xl font-semibold">
        Current Marks: <span className="text-accent-500">{marks}</span>
      </span>
    </Card>
  );
};
