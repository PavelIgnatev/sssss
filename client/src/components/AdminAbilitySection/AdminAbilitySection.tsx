import { useStore } from "effector-react";
import { FC, useEffect, useState } from "react";

import {
  $prevSettings,
  $state,
  fetchSettings,
  fetchStateAbility2,
  postFetchSettings,
} from "../../store/Settings";
import { Loader } from "../Loader";
import { PagerWrapper } from "../PagerWrapper";

import classes from "./AdminAbilitySection.module.scss";

export const AdminAbilitySection: FC = () => {
  const ability2 = useStore($prevSettings);
  const stateAbility2 = useStore($state);
  const loading = useStore(fetchSettings.pending);

  const [value, setValue] = useState<any>({});

  useEffect(() => {
    fetchStateAbility2();
    fetchSettings();
  }, []);

  if (loading) return <Loader />;

  return (
    <section className={classes.section}>
      <h2>Admissible networks: </h2>
      <ul>
        <li>GG</li>
        <li>888</li>
        <li>Party</li>
        <li>PS.eu</li>
        <li>WPN</li>
        <li>PS.es</li>
        <li>WNMX</li>
      </ul>
      <h2>Admissible levels: </h2>
      <ul>
        <li>7A</li>
        <li>7B</li>
      </ul>
      <h2>Admissible currency: </h2>
      <ul>
        <li>USD</li>
        <li>EUR</li>
      </ul>
      <h2>Admissible status: </h2>
      <ul>
        <li>!KONormal</li>
        <li>KONormal</li>
        <li>!KOTurbo</li>
        <li>KOTurbo</li>
        <li>
          !KOSuperTurbo <span style={{ color: "red" }}>(only WNMX)</span>
        </li>
        <li>
          KOSuperTurbo <span style={{ color: "red" }}>(only WNMX)</span>
        </li>
      </ul>

      <PagerWrapper state={stateAbility2} prevState={ability2} />
    </section>
  );
};
