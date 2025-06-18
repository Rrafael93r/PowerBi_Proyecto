import { defineConfig } from "@adonisjs/auth"
import { tokensUserProvider, tokensGuard } from "@adonisjs/auth/access_tokens"

const authConfig = defineConfig({
  default: "api",
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: "accessTokens",
        model: () => import("#models/usuario"),
      }),
    }),
  },
})

export default authConfig
