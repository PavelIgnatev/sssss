import { FC, useState } from "react";
import classNames from "classnames";

import { Page } from "./Page";
import { PagerModel } from "./types";

import classes from "./Page/Page.module.scss";

export const PagerWrapper: FC<PagerModel> = ({ state, prevState }) => {
  const [count, setCount] = useState(0);
  const newRules = Array(count).fill(null);

  return (
    <>
      <br />
      <br />
      {prevState.map((e: any, index: any) => {
        return <Page key={index} state={state} prevState={e} />;
      })}
      {newRules.map((e, index) => {
        return <Page key={index + 1000} state={state} prevState={e} />;
      })}
      <br />
      <br />
      <button
        onClick={() => {
          setCount(count + 1);
        }}
        className={classNames(classes.button, classes.maxButton)}
      >
        Add new rules
      </button>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};
