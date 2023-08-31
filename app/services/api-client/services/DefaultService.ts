/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Doc } from '../models/Doc';
import type { DocListItem } from '../models/DocListItem';
import type { EmbeddingParams } from '../models/EmbeddingParams';
import type { EmbeddingResponse } from '../models/EmbeddingResponse';
import type { SearchResponse } from '../models/SearchResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

  /**
   * Embedding
   * 文章を受け取り、ベクトル化した結果を返すAPI
   * @param requestBody
   * @returns EmbeddingResponse Successful Response
   * @throws ApiError
   */
  public static embeddingEmbeddingPost(
    requestBody: EmbeddingParams,
  ): CancelablePromise<EmbeddingResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/embedding',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Documents
   * ドキュメントの一覧
   * @returns DocListItem Successful Response
   * @throws ApiError
   */
  public static documentsDocGet(): CancelablePromise<Array<DocListItem>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doc',
    });
  }

  /**
   * Document
   * ドキュメントを1つ返す
   * @param id
   * @returns Doc Successful Response
   * @throws ApiError
   */
  public static documentDocIdGet(
    id: number,
  ): CancelablePromise<Doc> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/doc/{id}',
      path: {
        'id': id,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Cluster
   * クラスターの一覧
   * @returns any Successful Response
   * @throws ApiError
   */
  public static clusterClusterGet(): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/cluster',
    });
  }

  /**
   * Cluster
   * クラスタに属するドキュメントを返す
   * @param cluster
   * @returns any Successful Response
   * @throws ApiError
   */
  public static clusterClusterClusterGet(
    cluster: string,
  ): CancelablePromise<any> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/cluster/{cluster}',
      path: {
        'cluster': cluster,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Search
   * 文章を受け取り、類似度の高い文章を返す
   * @param q
   * @param topK
   * @returns SearchResponse Successful Response
   * @throws ApiError
   */
  public static searchSearchGet(
    q: string,
    topK: number = 10,
  ): CancelablePromise<SearchResponse> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/search',
      query: {
        'q': q,
        'top_k': topK,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
