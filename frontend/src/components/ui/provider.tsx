"use client"

import { ChakraProvider,createSystem,defineConfig,defaultConfig } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"


const config = defineConfig({
  // THIS IS CRITICAL: Disables Chakra's reset so Tailwind can survive
  preflight: false, 
})

export const system = createSystem(defaultConfig, config)


export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}

