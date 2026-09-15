import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const retroButtonVariants = cva(
  "relative inline-flex items-center justify-center w-full border-2 border-transparent rounded-[12px] bg-[#010101] shadow-[1px_1px_1px_rgba(255,255,255,0.6)] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: [
          "text-white",
          "[--bg-color:#f97316]",
          "[--bg-color-active:#ea580c]",
          "[--shadow-light:#fdba74]",
          "[--shadow-dark:#c2410c]",
        ],
        darkGray: [
          "text-white",
          "[--bg-color:#404040]",
          "[--bg-color-active:#525252]",
          "[--shadow-light:#a3a3a3]",
          "[--shadow-dark:#171717]",
        ],
        white: [
          "text-black",
          "[--bg-color:#e5e5e5]",
          "[--bg-color-active:#d4d4d4]",
          "[--shadow-light:#ffffff]",
          "[--shadow-dark:#737373]",
        ],
        lightGray: [
          "text-white",
          "[--bg-color:#a3a3a3]",
          "[--bg-color-active:#737373]",
          "[--shadow-light:#d4d4d4]",
          "[--shadow-dark:#525252]",
        ],
        gray: [
          "text-white",
          "[--bg-color:#525252]",
          "[--bg-color-active:#404040]",
          "[--shadow-light:#a3a3a3]",
          "[--shadow-dark:#262626]",
        ],
        green: [
          "text-white",
          "[--bg-color:#173124]",
          "[--bg-color-active:#2d4739]",
          "[--shadow-light:#2d4739]",
          "[--shadow-dark:#0a120e]",
        ],
        greenBorder: [
          "text-[#173124]",
          "[--bg-color:#ffffff]",
          "[--bg-color-active:#f4f4f0]",
          "[--shadow-light:#ffffff]",
          "[--shadow-dark:#e3e2df]",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const retroButtonInnerVariants = cva(
  [
    "flex w-full items-center justify-center gap-2.5 rounded-[10px] px-5 py-3.5 h-full",
    "font-['Manrope',sans-serif] text-center font-bold text-[17px] sm:text-[18px] leading-none tracking-wide",
    "bg-[var(--bg-color)] transition-all duration-200",
    "shadow-[inset_1px_1px_1px_var(--shadow-light),inset_-1px_-1px_1px_var(--shadow-dark),2px_2px_4px_#000]",
    "active:scale-[0.98] active:bg-[var(--bg-color-active)]",
    "active:shadow-[inset_0_0_4px_#000,inset_1px_1px_1px_transparent,inset_-1px_-1px_1px_transparent,2px_2px_4px_transparent]",
  ]
)

export interface RetroButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof retroButtonVariants> {
  children: React.ReactNode
  icon?: React.ReactNode
}

const RetroButton = React.forwardRef<HTMLButtonElement, RetroButtonProps>(
  ({ className, variant, children, icon, ...props }, ref) => {
    return (
      <button
        className={cn(retroButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <span className={retroButtonInnerVariants()}>
          {icon && <span className="shrink-0 flex items-center justify-center self-center leading-none">{icon}</span>}
          <span className="flex items-center justify-center self-center leading-none pt-[1px]">{children}</span>
        </span>
      </button>
    )
  }
)
RetroButton.displayName = "RetroButton"

export { RetroButton }