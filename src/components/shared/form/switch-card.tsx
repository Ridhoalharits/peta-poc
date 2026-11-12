import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SwitchCardProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Rendered below a border-t when the switch is on. */
  children?: React.ReactNode;
}

export function SwitchCard({ id, title, description, checked, onCheckedChange, children }: SwitchCardProps) {
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="font-heading text-base font-semibold">
            {title}
          </h2>
          <p id={descriptionId} className="text-[13px] text-muted-foreground">
            {description}
          </p>
        </div>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        />
      </div>
      {checked && children && <div className="border-t p-6">{children}</div>}
    </Card>
  );
}
