import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export const InfoTooltip = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Info className={`size-4 ${className}`} />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
};
