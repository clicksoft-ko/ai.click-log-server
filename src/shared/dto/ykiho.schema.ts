import { z } from "zod";

export const YkihoSchema =  z.string().length(8).regex(/^\d+$/);