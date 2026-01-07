// Types
import { PixelRc } from "../types";

export interface PixelConfigPort {
  read(): Promise<PixelRc | null>;
  write(rc: PixelRc): Promise<void>;
}
