import { FC } from "react";
import classes from "./ComponentCategory.module.scss";

export const ComponentCategory: FC<{
  category: string;
  gorizontal?: boolean;
}> = (props) => {
  const { category, children, gorizontal } = props;

  return (
    <div
      className={classes.wrapper}
      style={{ flexDirection: gorizontal ? "column" : "inherit" }}
    >
      <div className={classes.category}>{category}</div>
      <div>{children}</div>
    </div>
  );
};
