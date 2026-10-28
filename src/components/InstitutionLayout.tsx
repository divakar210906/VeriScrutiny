import { Outlet } from "react-router-dom";
import PortalShell from "./PortalShell";

export default function InstitutionLayout() {
  return (
    <PortalShell role="institution">
      <Outlet />
    </PortalShell>
  );
}
