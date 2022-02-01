import classNames from "classnames";
import { FC, useState } from "react";

import { getOptions } from "../../../helpers/getOptions";
import { postFetchSettings } from "../../../store/Settings";
import { BaseInputNumber } from "../../BaseInputNumber";
import { BaseSelect } from "../../BaseSelect";
import { PagerModel } from "../types";

import classes from "./Page.module.scss";

type PageProps = {
  state: any;
  prevState: any;
  level: string;
};

export const Page: FC<PageProps> = ({ state, prevState, level }) => {
  const [value1, setValue1] = useState<string>(prevState?.network ?? "");
  const [value2, setValue2] = useState<string>(level);
  const [value3, setValue3] = useState<string>(prevState?.currency ?? "");
  const [value4, setValue4] = useState<string>(prevState?.bid ?? "");
  const [value5, setValue5] = useState<string>(prevState?.status ?? "");
  const [value6, setValue6] = useState<string>(prevState?.name ?? "");
  const [value7, setValue7] = useState<string>(prevState?.ability ?? "");

  const isValue1 = value1?.length;
  const isValue3 = value3?.length;
  const isValue4 = value4?.length;
  const isValue5 = value5?.length;
  const isValue6 = value6?.length;
  const isValue7 = value7?.length;

  const ability2 =
    state[value1]?.[value2]?.[value3]?.[value4]?.[value5]?.[
      Object.keys(
        state[value1]?.[value2]?.[value3]?.[value4]?.[value5] ?? []
      )[0]
    ] ?? 0;

  const formData = {
    network: value1,
    level: value2,
    currency: value3,
    bid: value4,
    status: value5,
    name: value6,
    ability: value7,
    ability2,
  };

  const allObj: any = {};
  allObj[`all (A2: ${ability2})`] = null;

  return (
    <div className={classes.Page}>
      <BaseSelect
        placeholder="Network"
        options={getOptions(state)}
        onChange={(e) => setValue1(e?.value ?? "")}
        disabled={Boolean(isValue1)}
        defaultValue={value1 ? { value: value1, label: value1 } : null}
      />
      <BaseSelect
        placeholder="Currency"
        options={getOptions(state[value1]?.[value2])}
        onChange={(e) => setValue3(e?.value ?? "")}
        disabled={Boolean(isValue3)}
        defaultValue={value3 ? { value: value3, label: value3 } : null}
      />
      <BaseSelect
        placeholder="Bid"
        options={getOptions(state[value1]?.[value2]?.[value3])}
        onChange={(e) => setValue4(e?.value ?? "")}
        disabled={!isValue3 || !isValue1 || Boolean(isValue4)}
        defaultValue={value4 ? { value: value4, label: value4 } : null}
      />
      <BaseSelect
        placeholder="Status"
        options={getOptions(state[value1]?.[value2]?.[value3]?.[value4])}
        onChange={(e) => setValue5(e?.value ?? "")}
        defaultValue={value5 ? { value: value5, label: value5 } : null}
        disabled={!isValue4 || !isValue3 || !isValue1 || Boolean(isValue5)}
      />
      <BaseSelect
        placeholder="Name"
        className={classes.name}
        options={getOptions({
          ...allObj,
          ...state[value1]?.[value2]?.[value3]?.[value4]?.[value5],
        })}
        onChange={(e) => setValue6(e?.value ?? "")}
        defaultValue={value6 ? { value: value6, label: value6 } : null}
        disabled={
          !isValue5 || !isValue4 || !isValue3 || !isValue1 || Boolean(isValue6)
        }
      />
      <BaseInputNumber
        placeholder="Ability2"
        value={value7 ?? ""}
        handleChange={(value) => {
          setValue7(value);
        }}
        disabled={
          !isValue6 ||
          !isValue5 ||
          !isValue4 ||
          !isValue3 ||
          !isValue1 ||
          Boolean(isValue7 && prevState)
        }
      />
      <button
        onClick={() => {
          postFetchSettings({ method: "add", ...formData });
          window.location.reload();
        }}
        className={classNames(classes.button, {
          [classes.inactive]: prevState,
          [classes.disabled]:
            !isValue6 || !isValue5 || !isValue4 || !isValue3 || !isValue1,
        })}
      >
        Apply
      </button>
      <button
        onClick={() => {
          postFetchSettings({ method: "delete", ...formData });
          window.location.reload();
        }}
        className={classNames(classes.button, {
          [classes.inactive]: !prevState,
        })}
      >
        Сancel
      </button>
    </div>
  );
};
