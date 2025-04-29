import { twMerge } from "tailwind-merge";

export interface CardProps {
  cardId: number;
  x?: number;
  y?: number;
  /**
   * @description 360도 단위
   */
  rotate?: number;
  scale?: number;

  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

export const Card = (
  { cardId, x = 0, y = 0, rotate = 0, scale = 1, className, ref }: CardProps,
) => {
  const transitionStyle = {
    // translate: `${x}px ${y}px`,
    "--tw-translate-x": `${x}px`,
    "--tw-translate-y": `${y}px`,
  } as React.CSSProperties;

  const rotateStyle = {
    "--tw-rotate": `${rotate}deg`,
    "--tw-scale": `${scale}`,
  } as React.CSSProperties;

  return (
    <>
      <div
        style={transitionStyle}
        className={twMerge("w-16 transition-all translate-3d", className)}
        ref={ref}
      >
        <div
          style={rotateStyle}
          className={
            twMerge(
              "flex justify-center items-center -z-10 hover:z-10 rotate-(--tw-rotate) scale-(--tw-scale)",
            )
          }
        >
          <img src={`assets/saboteur/cards/${cardId}.png`} />
        </div>
      </div>
    </>
  );
};
