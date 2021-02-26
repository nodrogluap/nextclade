import type { Constellation, AminoacidSubstitution, AminoacidDeletion } from 'src/algorithms/types'
import { notUndefined } from 'src/helpers/notUndefined'
import { filter, isEmpty } from 'lodash'

export function satistfiesMutationCriteria(
  constellationDefinition: Constellation,
  aaSubstitutions: AminoacidSubstitution[],
) {
  let isMissingSub = false
  for (const requiredSub of constellationDefinition.substitutions) {
    if (
      isEmpty(
        filter(aaSubstitutions, { gene: requiredSub.gene, codon: requiredSub.codon, queryAA: requiredSub.queryAA }),
      )
    ) {
      isMissingSub = true
      break
    }
  }

  return !isMissingSub
}

/* TODO: implement deletions */
export function satistfiesDeletionCriteria(constellationDefinition: Constellation, aaDeletions: AminoacidDeletion[]) {
  let isMissingDel = false
  for (const requiredDeletion of constellationDefinition.deletions) {
    if (isEmpty(filter(aaDeletions, { gene: requiredDeletion.gene, codon: requiredDeletion.codon }))) {
      isMissingDel = true
      break
    }
  }

  return !isMissingDel
}

/**
 * Reduces a list of 'variant constellations' to those for which the provided mutations & deletions fulfill the criteria.
 * A constellation is one or more variants that have information associated with them, e.g. co-evolution under selective pressure.
 */
export function getConstellations(
  aaSubstitutions: AminoacidSubstitution[],
  aaDeletions: AminoacidDeletion[],
  constellations: Constellation[],
): Constellation[] {
  return constellations
    .map((constellationDefinition) => {
      if (
        !satistfiesMutationCriteria(constellationDefinition, aaSubstitutions) ||
        !satistfiesDeletionCriteria(constellationDefinition, aaDeletions)
      ) {
        return undefined
      }
      return constellationDefinition
    })
    .filter(notUndefined)
}