import { Link } from "@tanstack/react-router"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import AAA from "/assets/images/johnny-automaticsphin.svg"
import BBB from "/assets/images/johnny-automaticsphin.svg"
import CC from "/assets/images/johnny-automaticsphin.svg"
import DD from "/assets/images/johnny-automaticsphin.svg"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const fullLogo = isDark ? AAA : BBB
  const iconLogo = isDark ? CC : DD

  const content =
    variant === "responsive" ? (
      <>
        <img
          src={fullLogo}
          alt="FastAPI       login"
          className={cn(
            "h-20 w-20 group-data-[collapsible=icon]:hidden",
            className,
          )}
        />
        <img
          src={iconLogo}
          alt="FastAPI idkkk"
          className={cn(
            "size-20 hidden group-data-[collapsible=icon]:block",
            className,
          )}
        />
      </>
    ) : (
      <img
        src={variant === "full" ? fullLogo : iconLogo}
        alt="FastAPI aaaaaaaaa"
        className={cn(variant === "full" ? "h-20 w-70" : "size-12", className)}
      />
    )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
