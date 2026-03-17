import { isNaN as loIsNan } from "lodash-es";
import { useState } from "react";
import type { MouseHandlerDataParam } from "recharts";

export const useStatInteraction = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMove = (params: MouseHandlerDataParam) => {
    const newActiveIndex = loIsNan(params.activeIndex)
      ? null
      : (params.activeIndex as number);

    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  };

  const handleLeave = () => setActiveIndex(null);

  return {
    activeIndex,
    props: {
      onMouseMove: handleMove,
      onTouchMove: handleMove,
      onMouseLeave: handleLeave,
      onTouchEnd: handleLeave,
    },
  };
};
