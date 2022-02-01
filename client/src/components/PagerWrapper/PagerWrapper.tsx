import { FC, useState } from "react";
import classNames from "classnames";

import { Page } from "./Page";
import { PagerModel } from "./types";

import classes from "./Page/Page.module.scss";

export const PagerWrapper: FC<PagerModel> = ({ state, prevState }) => {
  const [count, setCount] = useState<any>({});
  const levels = Array(15)
    .fill(null)
    .map((e, i) => String(i + 1));
  const EffMu = ["A", "B"];

  return (
    <div className={classes.pager}>
      {levels.map((level) => {
        return (
          <div className={classes.wrapper} key={level}>
            <input type="checkbox" id={level} className={classes.hide} />
            <label htmlFor={level}>Rules for level {level}</label>
            <div>
              {EffMu.map((id) => (
                <div className={classes.effmu} key={level + id}>
                  <input
                    type="checkbox"
                    id={level + id}
                    className={classes.hide}
                  />
                  <label htmlFor={level + id}>Rules for Eff.mu - {id}</label>
                  <div>
                    {(prevState?.[level + id] ?? []).map(
                      (e: any, index: any) => {
                        return (
                          <Page
                            key={String(Math.random()).substr(2, 12)}
                            state={state}
                            prevState={e}
                            level={level + id}
                            minus={() => {
                              const d: any = {};
                              d[level + id] = 0;

                              setCount({ ...count, ...d });
                            }}
                          />
                        );
                      }
                    )}
                    {Array(count[level + id] ?? 0)
                      .fill(null)
                      .map((e, index) => {
                        return (
                          <Page
                            key={String(Math.random()).substr(2, 12)}
                            state={state}
                            prevState={e}
                            level={level + id}
                            minus={() => {
                              const d: any = {};
                              d[level + id] = 0;

                              setCount({ ...count, ...d });
                            }}
                          />
                        );
                      })}
                    <button
                      onClick={() => {
                        const d: any = {};
                        d[level + id] = 1;

                        setCount({ ...count, ...d });
                      }}
                      disabled={count[level + id] === 1}
                      className={classNames(classes.button, classes.maxButton)}
                    >
                      Add new rules
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
