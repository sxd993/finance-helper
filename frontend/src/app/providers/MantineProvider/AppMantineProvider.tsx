import { MantineProvider } from "@mantine/core"

export const AppMantineProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <MantineProvider>
      {children}
    </MantineProvider>
  )
}
