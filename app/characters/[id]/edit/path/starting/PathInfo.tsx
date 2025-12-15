import { Path } from "@/lib/generated/prisma/enums";
import { PathInfo as Info } from "@/lib/data/paths";
import { Card } from "@/components/ui/cards/Card";
import { Pill } from "@/components/ui/Pill";

export function PathInfo({ path }: { path: Path }) {
  const pathInfo = Info[path];

  return (
    <>
      {/* Header */}
      <div className="sticky top-15 ml-0 z-20 backdrop-blur-lg border-b border-accent-500">
        <div className="flex flex-col gap-1">
          <h2 className="text-neutral-900 dark:text-neutral-100">{pathInfo.name}</h2>
          {pathInfo.startingPathSkill && (
            <p className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
              Starting Path Skill: <span className="font-medium">{pathInfo.startingPathSkill}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Description */}
        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">{pathInfo.description}</p>

        <hr />

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              Recommended Attributes
            </div>
            <div className="flex flex-wrap gap-2">
              {pathInfo.recommendedAttributes.map((attr, index) => (
                <Pill key={index} variant="primary" className="capitalize">
                  {attr}
                </Pill>
              ))}
            </div>
          </Card>

          {pathInfo.recommendedSkills && (
            <Card className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                Recommended Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {pathInfo.recommendedSkills.map((skill, index) => (
                  <Pill key={index} variant="accent" className="capitalize">
                    {skill}
                  </Pill>
                ))}
              </div>
            </Card>
          )}
        </div>

        <hr />

        {/* Subclasses */}
        <div className="space-y-4">
          <div className="text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
            Subclasses
          </div>
          <div className="grid gap-4">
            {pathInfo.subclasses.map((subclass, index) => (
              <Card key={index}>
                <div className="font-semibold">{subclass.name}</div>
                <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{subclass.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
