/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/IDuxFE/idux/blob/main/LICENSE
 */

import type { SpinProviderRef } from './types'

import { inject } from 'vue'

import { throwError } from '@idux/cdk/utils'

import { spinProviderToken } from './token'

export const useSpin = (): SpinProviderRef => {
  const spinProviderRef = inject(spinProviderToken, null)
  if (spinProviderRef === null) {
    return throwError('components/spin', '<IxSpinProvider> not found.')
  }
  return spinProviderRef
}
