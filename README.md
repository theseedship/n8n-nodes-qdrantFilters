# n8n-nodes-qdrantFilters

This is an n8n community node that introduces a new Qdrant node for your n8n workflows.

The new Qdrant node includes the filter functionality, which is used to refine and specify the conditions for retrieving points from the vector database.
(https://www.npmjs.com/package/@seed-ship/n8n-nodes-qdrant_filters)

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node does the same thing as the previous one, but it adds the filter functionality. The functionality is not implemented at all currently, and we encourage you to help us fix the bug we have with it.

## Credentials

You will need your credential on [qdrant website](https://qdrant.tech/) to use the node.

## Compatibility

_State the minimum n8n version, as well as which versions you test against. You can also include any known version incompatibility issues._

## Usage

You need to provide a JSON filter specifying the criteria for documents you want to include or exclude. Here is an example:

```json
{
  "must": [
    {
      "key": "metadata.rand_number",
      "match": {
        "value": 5
      }
    }
  ],
  "should": [
    {
      "key": "metadata.color",
      "match": {
        "value": "red"
      }
    }
  ],
  "must_not": [
    {
      "key": "metadata.author",
      "match": {
        "value": "John Doe"
      }
    }
  ]
}
```

You have three options:

- `must`: Only documents that meet these conditions will be included.
- `should`: Documents that meet these conditions will be preferred, but it's not mandatory.
- `must_not`: Documents that meet these conditions will be excluded.

### Contributors
[@Alexis-Arduca](https://github.com/Alexis-Arduca) [@Muvikx](https://github.com/Muvikx) [@nicolas-geysse](https://github.com/nicolas-geysse)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* _Link to app/service documentation._
