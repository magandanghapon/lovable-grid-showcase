import { Moon, Sun } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/ThemeProvider"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground transition-colors data-[state=checked]:text-foreground" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-primary"
      />
      <Moon className="h-4 w-4 text-muted-foreground transition-colors data-[state=unchecked]:text-foreground" />
    </div>
  )
}