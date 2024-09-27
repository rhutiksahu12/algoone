import React, { useState } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Slider = React.forwardRef(({ className, min = 0, max = 100, step = 1, onValueChange, onRelease, ...props }, ref) => {
  const [value, setValue] = useState(props.defaultValue || [min]);

  const handleValueChange = (newValue) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  const handleMouseUp = () => {
    onRelease?.(value);
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={handleValueChange}
      onMouseUp={handleMouseUp}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{value[0]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="absolute left-0 top-6 text-sm">{min}</div>
      <div className="absolute right-0 top-6 text-sm">{max}</div>
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };