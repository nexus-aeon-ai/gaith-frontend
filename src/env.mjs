import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {
    // NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    // NEXT_PUBLIC_IS_COOKIE_SECURE: z
    //   .enum(["true", "false"])
    //   .transform((v) => v === "true"),
  },
  runtimeEnv: {
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // NEXT_PUBLIC_API_URL: "http://40.172.156.195",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // NEXT_PUBLIC_IS_COOKIE_SECURE: process.env.NEXT_PUBLIC_IS_COOKIE_SECURE,
  },
});

export default env;
