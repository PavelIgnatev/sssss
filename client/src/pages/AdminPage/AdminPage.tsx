import { FC } from "react";
import { AdminAbilitySection } from "../../components/AdminAbilitySection";

export const AdminPage: FC = () => {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Admin Panel</h1>
      <AdminAbilitySection />
    </>
  );
};
