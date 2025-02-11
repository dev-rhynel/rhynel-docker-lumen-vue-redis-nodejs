import type {StringNullableChain} from 'lodash'
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase {
    persist?:
      | boolean
      | {
          paths?: string[]
          storage?: Storage
          key?: StringNullableChain
        }
  }
}
