import { FC, useState } from "react";
import { Page } from "./Page";

export const PagerWrapper: FC<{ state?: any; prevState?: any }> = ({
  state,
  prevState,
}) => {
  const [count, setCount] = useState(0);
  return (
    <>
      {prevState.map((e: any, index: any) => {
        return <Page key={index} state={state} prevState={e} />;
      })}
      {Array(count)
        .fill(null)
        .map((e, index) => {
          return <Page key={index + 1000} state={state} prevState={e} />;
        })}
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Добавить еще один слот
      </button>
    </>
  );
};
