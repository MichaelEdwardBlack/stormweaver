import { GlossaryText } from "@/app/characters/components/GlossaryText";
import { Attribute } from "@/lib/generated/prisma/enums";

type AttributeStatInfoProps = {
  attribute: Attribute;
};
export const AttributeStatInfo = ({ attribute }: AttributeStatInfoProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        Your <strong className="capitalize">{attribute}</strong> attribute also affects the following:
      </div>
      {attribute === "strength" && (
        <>
          <div className="font-semibold text-lg">Lifting and Carrying Capacity</div>
          <div className="table-container">
            <table className="readonly">
              <thead>
                <tr>
                  <th>Strength</th>
                  <th>Lifting Capacity</th>
                  <th>Carrying Capacity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>100 lb.</td>
                  <td>50 lb.</td>
                </tr>
                <tr>
                  <td>1-2</td>
                  <td>200 lb.</td>
                  <td>100 lb.</td>
                </tr>
                <tr>
                  <td>3-4</td>
                  <td>500 lb.</td>
                  <td>250 lb.</td>
                </tr>
                <tr>
                  <td>5-6</td>
                  <td>1,000 lb.</td>
                  <td>500 lb.</td>
                </tr>
                <tr>
                  <td>7-8</td>
                  <td>5,000 lb.</td>
                  <td>2,500 lb.</td>
                </tr>
                <tr>
                  <td>9+</td>
                  <td>10,000 lb.</td>
                  <td>5,000 lb.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="font-semibold text-lg">Lifting and Moving Characters</div>
          <GlossaryText
            text={
              "At your GM's discretion, you might be able to lift and move an unwilling character who you Grapple or similarly have Restrained. However, depending on the character, their nearby allies, and the environment, you might take damage, need to succeed on a test to move them, or experience other effects."
            }
          />
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Physical Defense</li>
            <li>Health</li>
            <li>Lifting Capacity</li>
            <li>Unarmed Attack Damage Die</li>
            <li>
              Strength-based skill modifiers <strong>(Athletics, Heavy Weaponry, Tension surge)</strong>
            </li>
          </ul>
        </>
      )}
      {attribute === "speed" && (
        <>
          <div className="font-semibold text-lg">Movement Rate</div>
          <GlossaryText
            text={
              "Your Speed determines how quickly you can move in combat and other tense situations. When you use the Move action (described in chapter 10), you can move up to your movement rate, as shown on the Movement Rate table. When other abilities allow you to move, they specify what rate you can use to move."
            }
          />
          <div className="table-container">
            <table className="readonly">
              <thead>
                <tr>
                  <th>Speed</th>
                  <th>Movement</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>20 feet per action</td>
                </tr>
                <tr>
                  <td>1-2</td>
                  <td>25 feet per action</td>
                </tr>
                <tr>
                  <td>3-4</td>
                  <td>30 feet per action</td>
                </tr>
                <tr>
                  <td>5-6</td>
                  <td>40 feet per action</td>
                </tr>
                <tr>
                  <td>7-8</td>
                  <td>60 feet per action</td>
                </tr>
                <tr>
                  <td>9+</td>
                  <td>80 feet per action</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Physical Defense</li>
            <li>Movement Rate</li>
            <li>
              Speed-based skill modifiers <strong>(Agility, Light Weaponry, Thievery, Abrasion surge)</strong>
            </li>
          </ul>
        </>
      )}
      {attribute === "intellect" && (
        <>
          <div className="font-semibold text-lg">Additional Expertises</div>
          <div>
            During character creation, all characters can choose two cultural expertises. If your Intellect score is 1
            or higher, you can choose additional expertises equal to that score (see the "Expertises" section).
          </div>
          <div>
            If your Intellect increases as you gain levels, you can choose a new expertise for each Intellect point you
            gain.
          </div>
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Number of Expertises</li>
            <li>Cognitive Defense</li>
            <li>
              Intellect-based skill modifiers{" "}
              <strong>(Crafting, Deduction, Lore, Medicine, Division surge, Transportation surge)</strong>
            </li>
          </ul>
        </>
      )}
      {attribute === "willpower" && (
        <>
          <div className="font-semibold text-lg">Recovery Die</div>
          <GlossaryText
            text={
              "Your recovery die determines how efficiently you recover health and focus when you take a break (see the “Resting” section of chapter 9). Your Willpower determines the size of your recovery die, as shown on the Recovery Die table."
            }
          />
          <div className="table-container">
            <table className="readonly">
              <thead>
                <tr>
                  <th>Willpower</th>
                  <th>Recovery Die</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>1d4</td>
                </tr>
                <tr>
                  <td>1-2</td>
                  <td>1d6</td>
                </tr>
                <tr>
                  <td>3-4</td>
                  <td>1d8</td>
                </tr>
                <tr>
                  <td>5-6</td>
                  <td>1d10</td>
                </tr>
                <tr>
                  <td>7-8</td>
                  <td>1d12</td>
                </tr>
                <tr>
                  <td>9+</td>
                  <td>1d20</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Cognitive Defense</li>
            <li>Focus</li>
            <li>Recovery Die</li>
            <li>
              Willpower-based skill modifiers{" "}
              <strong>(Discipline, Intimidation, Cohesion surge, Transformation surge)</strong>
            </li>
          </ul>
        </>
      )}
      {attribute === "awareness" && (
        <>
          <div className="font-semibold text-lg">Senses</div>
          <div>
            Your senses encompass not only sight and hearing, but any other ways you might perceive the world. The
            higher your Awareness, the farther you can sense while darkness, noise, or other distractions obscure your
            senses. Use the Senses Range table to determine your senses range, then see the “Senses” section for details
            on how to use this range.
          </div>
          <div className="table-container">
            <table className="readonly">
              <thead>
                <tr>
                  <th>Awareness</th>
                  <th>Senses Range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>5 ft.</td>
                </tr>
                <tr>
                  <td>1-2</td>
                  <td>10 ft.</td>
                </tr>
                <tr>
                  <td>3-4</td>
                  <td>20 ft.</td>
                </tr>
                <tr>
                  <td>5-6</td>
                  <td>50 ft.</td>
                </tr>
                <tr>
                  <td>7-8</td>
                  <td>100 ft.</td>
                </tr>
                <tr>
                  <td>9+</td>
                  <td>Unaffected by obscured senses</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Spiritual Defense</li>
            <li>Investiture (unless you use Presence)</li>
            <li>Senses Range</li>
            <li>
              Awareness-based skill modifiers{" "}
              <strong>(Insight, Perception, Survival, Gravitation surge, Progression surge)</strong>
            </li>
          </ul>
        </>
      )}
      {attribute === "presence" && (
        <>
          <div className="font-semibold text-lg">Establishing Connections</div>
          <div>
            When your adventures bring you to cities and other inhabited areas, you'll often want to determine whether
            your character knows someone in the area. Your Presence score can help the GM decide whether you previously
            spent enough time in that region to have an existing connection to call on. The Establishing Connections
            table provides guidance on how long it takes you to establish these connections, but this varies with the
            situation and is up to the GM's discretion.
          </div>
          <div className="table-container">
            <table className="readonly">
              <thead>
                <tr>
                  <th>Presence</th>
                  <th>Time to Establish Connections</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>1 year</td>
                </tr>
                <tr>
                  <td>1-2</td>
                  <td>50 days</td>
                </tr>
                <tr>
                  <td>3-4</td>
                  <td>5 days</td>
                </tr>
                <tr>
                  <td>5-6</td>
                  <td>1 day</td>
                </tr>
                <tr>
                  <td>7-8</td>
                  <td>1 hour</td>
                </tr>
                <tr>
                  <td>9+</td>
                  <td>Your reputation precedes you. You have connections in places you haven't even visited.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="font-semibold text-lg">Affected Statistics</div>
          <ul>
            <li>Spiritual Defense</li>
            <li>Investiture (unless you use Awareness)</li>
            <li>Established Connections</li>
            <li>
              Presence-based skill modifiers{" "}
              <strong>(Deception, Leadership, Persuasion, Adhesion surge, Illumination surge)</strong>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};
