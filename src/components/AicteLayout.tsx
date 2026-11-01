import { Outlet } from "react-router-dom";
import PortalShell from "./PortalShell";

export default function AicteLayout() {
  return (
    <PortalShell role="aicte">
      <Outlet />
    </PortalShell>
  );
}
