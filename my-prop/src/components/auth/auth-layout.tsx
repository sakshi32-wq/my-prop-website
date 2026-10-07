import { Logo } from "@/components/logo"
import { unsplash } from "@/lib/mock-data"

export function AuthLayout({
  photo,
  asideTitle,
  asideDescription,
  title,
  description,
  children,
}: {
  photo: string
  asideTitle: string
  asideDescription: string
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-muted lg:block">
        <img
          src={unsplash(photo, 1200, 1600)}
          alt="Real estate"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
          <div className="flex max-w-md flex-col gap-3 rounded-xl bg-background/85 p-6 backdrop-blur-sm">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              {asideTitle}
            </h2>
            <p className="text-lg text-muted-foreground">{asideDescription}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:p-8">
        <div className="flex w-full max-w-md flex-col gap-8">
          <Logo />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
