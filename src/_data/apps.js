import { ladeApps } from "../../lib/apps.js";
import site from "./site.js";

export default () => ladeApps({ quelle: "src", adressen: site });
