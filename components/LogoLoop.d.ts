import type { ComponentType, CSSProperties, Key, ReactNode } from "react";

type ImageLogo = {
  src: string;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  title?: string;
  href?: string;
  hoverColor?: string;
};

type NodeLogo = {
  node: ReactNode;
  title?: string;
  ariaLabel?: string;
  href?: string;
  hoverColor?: string;
};

export type LogoItem = ImageLogo | NodeLogo;

export type LogoLoopProps = {
  logos: readonly LogoItem[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutWidth?: number;
  scaleOnHover?: boolean;
  layout?: "line" | "wave" | "arc" | "orbit";
  bend?: number;
  focus?: number;
  magnify?: number;
  tiltX?: number;
  tiltY?: number;
  step?: boolean;
  muted?: number;
  labels?: "none" | "inline" | "below" | "hover";
  draggable?: boolean;
  scrollBoost?: number;
  intro?: boolean;
  renderItem?: (item: LogoItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
};

declare const LogoLoop: ComponentType<LogoLoopProps>;

export { LogoLoop };
export default LogoLoop;
