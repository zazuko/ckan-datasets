import { sparql } from '@tpluscode/rdf-string'
import * as ns from './namespace.js'

function datasetsQuery (organizationId) {
  return sparql`
    CONSTRUCT {
      ?dataset ?p ?o .
      ?o ?nestedP ?nestedO .
      ?copyright ${ns.schema.identifier} ?copyrightIdentifier .
      ?dataset ${ns.dcterms.accrualPeriodicity} ?accrualPeriodicityExactMatch .
    }
    WHERE {
      GRAPH ?graph {
        ?dataset ?p ?o .

        ?dataset ${ns.dcterms.creator} ${organizationId} .
        ?dataset ${ns.schema.workExample} <https://ld.admin.ch/application/opendataswiss> .
        ?dataset ${ns.schema.creativeWorkStatus} <https://ld.admin.ch/vocabulary/CreativeWorkStatus/Published> .

        FILTER ( NOT EXISTS { ?dataset ${ns.schema.validThrough} ?expiration1 . } )
        FILTER ( NOT EXISTS { ?dataset ${ns.schema.expires} ?expiration2 . } )

        OPTIONAL {
          ?o ?nestedP ?nestedO .
          FILTER( ?nestedP != <https://cube.link/observation> )
        }

        OPTIONAL {
          ?dataset ${ns.dcterms.rights} ?copyright .
          GRAPH ?copyrightGraph {
            ?copyright ${ns.schema.identifier} ?copyrightIdentifier .
          }
        }

        OPTIONAL {
          ?dataset ${ns.dcterms.accrualPeriodicity} ?accrualPeriodicity .
          GRAPH ?frequencyGraph {
            ?accrualPeriodicity ${ns.skos.exactMatch} ?accrualPeriodicityExactMatch .
          }
        }
      }
    }
  `
}

export { datasetsQuery }
