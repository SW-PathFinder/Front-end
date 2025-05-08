import { twMerge } from "tailwind-merge";

export interface CardProps {
  cardId: number;

  /**
   * @default false
   */
  draggable?: boolean;

  top?: number;
  left?: number;

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

export const Card = ({
  cardId,
  top = 0,
  left = 0,
  x = 0,
  y = 0,
  rotate = 0,
  scale = 1,
  className,
  ref,
}: CardProps) => {
  const transitionStyle = {
    "--tw-top": `${top}px`,
    "--tw-left": `${left}px`,
    "--tw-translate-x": `${x}px`,
    "--tw-translate-y": `${y}px`,
    "--tw-scale-x": scale,
    "--tw-scale-y": scale,
    "--tw-rotate": `${rotate}deg`,
  } as React.CSSProperties;

  return (
    <div
      style={{
        ...transitionStyle,
        backgroundImage: `url(assets/saboteur/cards/${cardId}.png)`,
      }}
      className={twMerge(
        "relative aspect-[2/3] w-16 bg-cover bg-center bg-no-repeat",
        "top-(--tw-top) left-(--tw-left) translate-3d",
        "scale-0 rotate-(--tw-rotate)",
        className,
      )}
      ref={ref}
    >
      <img src={`assets/saboteur/cards/${cardId}.png`} />
    </div>
  );
};
