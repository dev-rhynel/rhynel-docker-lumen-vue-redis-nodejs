export {HeaderInterface, ResponseInterface, TypePagination}

declare global {
  interface HeaderInterface {
    Authorization: string
  }

  interface ResponseInterface {
    data?: {
      value?: {
        data?: {
          token?: string
        }
      }
    }
    error: {
      value?: {
        data?: {
          errors?: KeyValueInterface
        }
      }
    }
  }

  interface TypePagination {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}
