/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Qdrant のコレクション作成パラメタ
 */
interface QdrantCollectionCreateParams {
  collection: string
  vectors: {
    size: number
    distance: 'Dot' | 'Cosine'
  }
}

/**
 * Qdrant のコレクション作成結果
 */
interface QdrantCollectionCreateResult {
  result: boolean
  status: 'ok'
  time: number
}

/**
 * Qdrant のポイント追加パラメタ
 */
interface QdrantAddPointsParams {
  collection: string
  points: QdrantPoint[]
}

/**
 * Qdrant のポイント追加結果
 */
interface QdrantAddPointsResult {
  result: {
    operation_id: number
    status: 'completed'
  }
  status: 'ok'
  time: number
}

interface QdrantPoint {
  id: number
  vector: number[]
  payload?: any
}

/**
 * Qdrant
 * @param server
 * @param port
 * @returns
 */
export const createQdrant = (server: string, port = 6333) => {
  /**
   * コレクションを作成する
   */
  const createCollection = async ({
    collection,
    vectors,
  }: QdrantCollectionCreateParams) => {
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vectors }),
      },
    )
    if (!ret.ok) {
      throw new Error(`Failed to create collection: ${ret.statusText}`)
    }
    return (await ret.json()) as QdrantCollectionCreateResult
  }

  /**
   * コレクションにポイントを追加する
   */
  const addPoints = async ({ collection, points }: QdrantAddPointsParams) => {
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}/points?wait=true`,
      {
        method: 'PUt',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      },
    )
    if (!ret.ok) {
      throw new Error(`Failed to add points: ${ret.statusText}`)
    }
    return (await ret.json()) as QdrantAddPointsResult
  }

  /**
   *
   */
  const search = async ({
    collection,
    params,
  }: {
    collection: string
    params: {
      vector: number[]
      limit: number
      filter?: any
    }
  }) => {
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}/points?wait=true`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params }),
      },
    )
    if (!ret.ok) {
      throw new Error(`Failed to add points: ${ret.statusText}`)
    }
    return (await ret.json()) as {
      result: [{ id: number; score: number }]
      status: 'ok'
      time: number
    }
  }

  return {
    createCollection,
    addPoints,
    search,
  }
}
