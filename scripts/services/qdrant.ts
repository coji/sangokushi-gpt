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
  id: number | string
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

  const deleteCollection = async (collection: string) => {
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    )
    if (!ret.ok) {
      throw new Error(`Failed to create collection: ${ret.statusText}`)
    }
    return (await ret.json()) as object
  }

  /**
   * コレクションにポイントを追加する
   */
  const addPoints = async ({ collection, points }: QdrantAddPointsParams) => {
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}/points`, // ?wait=true
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points }),
      },
    )
    if (!ret.ok) {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Failed to add points: ${ret.statusText} ${JSON.stringify(
          await ret.json(),
        )}`,
      )
    }
    return (await ret.json()) as QdrantAddPointsResult
  }

  /**
   *
   */
  const search = async <T>({
    collection,
    params,
  }: {
    collection: string
    params: {
      vector: number[]
      limit: number
      filter?: any
      with_vector?: boolean
    }
  }) => {
    //    console.log('search', JSON.stringify({ ...params, with_payload: true }))
    const ret = await fetch(
      `http://${server}:${port}/collections/${collection}/points/search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          with_payload: true,
          with_vector: params.with_vector ?? false,
        }),
      },
    )
    if (!ret.ok) {
      throw new Error(`Failed to search: ${ret.statusText}`)
    }
    return (await ret.json()) as {
      result: { id: number; score: number; payload: T }[]
      status: 'ok'
      time: number
    }
  }

  return {
    createCollection,
    deleteCollection,
    addPoints,
    search,
  }
}
