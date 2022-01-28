import { FC, useState } from "react";
import classNames from "classnames";

import { Page } from "./Page";
import { PagerModel } from "./types";

import classes from "./Page/Page.module.scss";

export const PagerWrapper: FC<PagerModel> = ({ state, prevState }) => {
  const [count, setCount] = useState<any>({});

  console.log(prevState);

  return (
    <div className={classes.pager}>
      {["7A", "7B"].map((level) => {
        return (
          <div className={classes.wrapper}>
            <input type="checkbox" id={level} className={classes.hide} />
            <label htmlFor={level}>Rules for level{level}</label>
            <div>
              {(prevState?.[level] ?? []).map((e: any, index: any) => {
                return (
                  <Page key={index} state={state} prevState={e} level={level} />
                );
              })}
              {Array(count[level] ?? 0)
                .fill(null)
                .map((e, index) => {
                  return (
                    <Page
                      key={index + 1000}
                      state={state}
                      prevState={e}
                      level={level}
                    />
                  );
                })}
              <button
                onClick={() => {
                  const d: any = {};
                  d[level] = 1;

                  setCount({ ...count, ...d });
                }}
                disabled={count[level] === 1}
                className={classNames(classes.button, classes.maxButton)}
              >
                Add new rules
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
