export {PostInterface}

declare global {
  interface PostInterface {
    id: number
    title: string
    content: string
    user_id: number
    user: UserInterface
  }
}
