import { type INodeProperties } from 'n8n-workflow';
import type { QdrantLibArgs } from '@langchain/qdrant';
import { QdrantVectorStore } from "@langchain/qdrant";
import type { Schemas as QdrantSchemas } from '@qdrant/js-client-rest';
import { createVectorStoreNode } from '../shared/createVectorStoreNode';
import { xCollectionRLC } from '../shared/descriptions';
import { qdrantCollectionsSearch } from '../shared/methods/listSearch';

const sharedFields: INodeProperties[] = [xCollectionRLC];

const insertFields: INodeProperties[] = [
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Collection Config',
				name: 'collectionConfig',
				type: 'json',
				default: '',
				description:
					'JSON options for creating a collection. <a href="https://qdrant.tech/documentation/concepts/collections">Learn more</a>.',
			},
		],
	},
];

const loadFields: INodeProperties[] = [
    {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'json',
				default: '',
				description: 'JSON filter to apply when searching the collection.'
			},
		],
    },
];

const retrieveFields: INodeProperties[] = [
    {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'json',
				default: '',
				description: 'JSON filter to apply when searching the collection.'
			},
		],
    },
];

export const VectorStoreQdrant = createVectorStoreNode({
	meta: {
		displayName: 'Qdrant Store Vector',
		name: 'vectorStoreQdrant',
		description: 'Work with your data in a Qdrant collection',
		icon: 'file:qdrant.svg',
		docsUrl:
			'https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreqdrant/',
		credentials: [
			{
				name: 'qdrantApi',
				required: true,
			},
		],
	},
	methods: { listSearch: { qdrantCollectionsSearch } },
	insertFields,
	sharedFields,
	loadFields,
	retrieveFields,
	async getVectorStoreClient(context, filter, embeddings, itemIndex) {
		const collection = context.getNodeParameter('qdrantCollection', itemIndex, '', {
			extractValue: true,
		}) as string;

		const credentials = await context.getCredentials('qdrantApi');

		const config: QdrantLibArgs = {
			url: credentials.qdrantUrl as string,
			apiKey: credentials.apiKey as string,
			collectionName: collection,
			customPayload: filter ? [ { filter } ] : [],
		};

		return await QdrantVectorStore.fromExistingCollection(embeddings, config);
	},
	async populateVectorStore(context, embeddings, documents, itemIndex) {
		const collectionName = context.getNodeParameter('qdrantCollection', itemIndex, '', {
			extractValue: true,
		}) as string;

		// If collection config is not provided, the collection will be created with default settings
		// i.e. with the size of the passed embeddings and "Cosine" distance metric
		const { collectionConfig } = context.getNodeParameter('options', itemIndex, {}) as {
			collectionConfig?: QdrantSchemas['CreateCollection'];
		};
		const credentials = await context.getCredentials('qdrantApi');

		const config: QdrantLibArgs = {
			url: credentials.qdrantUrl as string,
			apiKey: credentials.apiKey as string,
			collectionName,
			collectionConfig,
		};

		await QdrantVectorStore.fromDocuments(documents, embeddings, config);
	},
});