export {UserInterface}

declare global {
  interface UserInterface {
    id: number
    first_name: string
    last_name: string
    email: string
    name: string
  }
}
