import { FC, useState } from "react";
import { fetchStateAbility2, postFetchSettings } from "../../../store/Settings";
import { BaseSelect } from "../../BaseSelect";

export const Page: FC<{
  state?: any;
  prevState?: {
    network: string;
    level: string;
    currency: string;
    bid: string;
    status: string;
    name: string;
    ability: string;
  };
}> = ({ state, prevState }) => {
  const step1 = Object.keys(state).map((el) => {
    return { value: el, label: el };
  });
  console.log(step1);
  const [value1, setValue1] = useState<string | undefined>(prevState?.network);
  const [value2, setValue2] = useState<string | undefined>(prevState?.level);
  const [value3, setValue3] = useState<string | undefined>(prevState?.currency);
  const [value4, setValue4] = useState<string | undefined>(prevState?.bid);
  const [value5, setValue5] = useState<string | undefined>(prevState?.status);
  const [value6, setValue6] = useState<string | undefined>(prevState?.name);
  const [value7, setValue7] = useState<string | undefined>(prevState?.ability);

  const formData = {
    network: value1,
    level: value2,
    currency: value3,
    bid: value4,
    status: value5,
    name: value6,
    ability: value7,
  };

  return (
    <div style={{ display: "flex" }}>
      <BaseSelect
        className={""}
        options={step1}
        onChange={(e) => setValue1(e?.value)}
        placeholder="Network"
        disabled={Boolean(value1?.length)}
        //@ts-ignore
        defaultValue={[value1].map((el) => {
          return { value: el, label: el };
        })}
      />
      <BaseSelect
        className={""}
        //@ts-ignore
        options={Object.keys(state[value1] ?? {}).map((el) => {
          return { value: el, label: el };
        })}
        onChange={(e) => setValue2(e?.value)}
        disabled={!value1?.length || Boolean(value2?.length)}
        placeholder="Level"
        //@ts-ignore
        defaultValue={[value2].map((el) => {
          return { value: el, label: el };
        })}
      />
      <BaseSelect
        className={""}
        //@ts-ignore
        options={Object.keys(state[value1]?.[value2] ?? {}).map((el) => {
          return { value: el, label: el };
        })}
        onChange={(e) => setValue3(e?.value)}
        disabled={!value2?.length || !value1?.length || Boolean(value3?.length)}
        placeholder="Currency"
        //@ts-ignore
        defaultValue={[value3].map((el) => {
          return { value: el, label: el };
        })}
      />
      <BaseSelect
        className={""}
        //@ts-ignore
        options={Object.keys(state[value1]?.[value2]?.[value3] ?? {}).map(
          (el) => {
            return { value: el, label: el };
          }
        )}
        onChange={(e) => setValue4(e?.value)}
        disabled={
          !value3?.length ||
          !value2?.length ||
          !value1?.length ||
          Boolean(value4?.length)
        }
        placeholder="Bid"
        //@ts-ignore
        defaultValue={[value4].map((el) => {
          return { value: el, label: el };
        })}
      />
      <BaseSelect
        className={""}
        options={Object.keys(
          //@ts-ignore
          state[value1]?.[value2]?.[value3]?.[value4] ?? {}
        ).map((el) => {
          return { value: el, label: el };
        })}
        onChange={(e) => setValue5(e?.value)}
        disabled={
          !value4?.length ||
          !value3?.length ||
          !value2?.length ||
          !value1?.length ||
          Boolean(value5?.length)
        }
        placeholder="Status"
        //@ts-ignore
        defaultValue={[value5].map((el) => {
          return { value: el, label: el };
        })}
      />
      <BaseSelect
        className={""}
        options={Object.keys(
          //@ts-ignore
          state[value1]?.[value2]?.[value3]?.[value4]?.[value5] ?? {}
        ).map((el) => {
          return { value: el, label: el };
        })}
        onChange={(e) => setValue6(e?.value)}
        disabled={
          !value5?.length ||
          !value4?.length ||
          !value3?.length ||
          !value2?.length ||
          !value1?.length ||
          Boolean(value6?.length)
        }
        placeholder="Name"
        //@ts-ignore
        defaultValue={[value6].map((el) => {
          return { value: el, label: el };
        })}
      />
      <input
        //@ts-ignore
        disabled={
          !value6?.length ||
          !value5?.length ||
          !value4?.length ||
          !value3?.length ||
          !value2?.length ||
          !value1?.length ||
          (value7?.length && prevState)
        }
        onChange={(e) => setValue7(e?.currentTarget?.value)}
        type="text"
        value={value7}
      />
      <button
        onClick={() => {
          postFetchSettings(Object.assign(formData, { method: "add" }));
          window.location.reload();
        }}
        style={{ display: prevState ? "none" : "block" }}
        placeholder="ability2 step"
      >
        Добавить правило
      </button>
      <button
        onClick={() => {
          postFetchSettings(Object.assign(formData, { method: "delete" }));
          window.location.reload();
        }}
        style={{ display: prevState ? "block" : "none" }}
      >
        Удалить правило
      </button>
    </div>
  );
};
