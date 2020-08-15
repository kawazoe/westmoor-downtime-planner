import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const ActivityCostKinds = ['days', 'gold'] as const;
export type ActivityCostKinds = typeof ActivityCostKinds[number];

export interface SharedWithResponse {
  ownershipId: string;
  picture: string;
  username: string;
  email: string;
  name: string;
}

export interface CampaignResponse {
  id: string;
  name: string;
  sharedWith: SharedWithResponse[];
}

export interface CreateCampaignRequest {
  name: string;
  sharedWith: string[];
}

export interface UpdateCampaignRequest {
  name: string;
  sharedWith: string[];
}

export interface ActivityResponse {
  id: string;
  name: string;
  descriptionMarkdown: string;
  complicationMarkdown: string;
  costs: ActivityCostResponse[];
  sharedWith: SharedWithResponse[];
}

export interface ActivityCostResponse {
  kind: string;
  jexlExpression: string;
  parameters: ActivityParameterResponse[];
}

export interface ActivityParameterResponse {
  variableName: string;
  description: string;
}

export interface CreateActivityRequest {
  name: string;
  descriptionMarkdown: string;
  complicationMarkdown: string;
  costs: CreateActivityCostRequest[];
  sharedWith: string[];
}

export interface CreateActivityCostRequest {
  kind: ActivityCostKinds;
  jexlExpression: string;
  parameters: CreateActivityParameterRequest[];
}

export interface CreateActivityParameterRequest {
  variableName: string;
  description: string;
}

export interface UpdateActivityRequest {
  name: string;
  descriptionMarkdown: string;
  complicationMarkdown: string;
  costs: UpdateActivityCostRequest[];
  sharedWith: string[];
}

export interface UpdateActivityCostRequest {
  kind: ActivityCostKinds;
  jexlExpression: string;
  parameters: UpdateActivityParameterRequest[];
}

export interface UpdateActivityParameterRequest {
  variableName: string;
  description: string;
}

export interface CharacterResponse {
  id: string;
  playerFullName: string;
  characterFullName: string;
  accruedDowntimeDays: number;
  sharedWith: SharedWithResponse[];
}

export interface CreateCharacterRequest {
  playerFullName: string;
  characterFullName: string;
  sharedWith: string[];
}

export interface UpdateCharacterRequest {
  playerFullName: string;
  characterFullName: string;
  accruedDowntimeDays: number;
  sharedWith: string[];
}

export interface AwardCharacterRequest {
  delta: number;
}

export interface AwardCharacterBatchRequest {
  ids: string[];
  request: AwardCharacterRequest;
}

export interface DowntimeResponse {
  id: string;
  character: CharacterResponse;
  activity: ActivityResponse;
  progresses: DowntimeCostResponse[];
  sharedWith: SharedWithResponse[];
}

export interface DowntimeCostResponse {
  activityCostKind: ActivityCostKinds;
  value: number;
  goal: number;
}

export interface CreateDowntimeRequest {
  characterId: string;
  activityId: string;
  costs: CreateDowntimeCostRequest[];
  sharedWith: string[];
}

export class CreateDowntimeBatchRequest {
  requests: CreateDowntimeRequest[];
}

export interface CreateDowntimeCostRequest {
  activityCostKind: ActivityCostKinds;
  goal: number;
}

export interface UpdateDowntimeRequest {
  costs: UpdateDowntimeCostRequest[];
  sharedWith: string[];
}

export interface UpdateDowntimeCostRequest {
  activityCostKind: ActivityCostKinds;
  value: number;
  goal: number;
}

export interface AdvanceDowntimeRequest {
  costs: AdvanceDowntimeCostRequest[];
}

export interface AdvanceDowntimeCostRequest {
  activityCostKind: ActivityCostKinds;
  delta: number;
}

export class AdvanceDowntimeBatchRequest {
  ids: string[];
  request: AdvanceDowntimeRequest;
}

export interface ApiKeyResponse {
  key: string;
  owner: string;
  permissions: string[];
  createdOn: string;
  sharedWith: SharedWithResponse[];
}

export interface CreateApiKeyRequest {
  owner: string;
  permissions: string[];
  sharedWith: string[];
}

export interface UpdateApiKeyRequest {
  owner: string;
  permissions: string[];
  sharedWith: string[];
}

export interface UserResponse {
  userId: string;
  email: string;
  username: string;
  picture: string;
  name: string;
  userMetadata: UserMetadataResponse;
}

export interface UserMetadataResponse {
  ownershipId: string;
  campaigns: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private endpoint = '/api/v1';

  constructor(
    private http: HttpClient
  ) { }

  public getAllCampaigns(): Observable<CampaignResponse[]> {
    return this.http.get<CampaignResponse[]>(`${this.endpoint}/campaign`);
  }

  public getCampaignById(id: string): Observable<CampaignResponse> {
    return this.http.get<CampaignResponse>(`${this.endpoint}/campaign/${id}`);
  }

  public createCampaign(request: CreateCampaignRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/campaign`, request);
  }

  public updateCampaign(id: string, request: UpdateCampaignRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/campaign/${id}`, request);
  }

  public deleteCampaign(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/campaign/${id}`);
  }

  public getAllActivities(): Observable<ActivityResponse[]> {
    return this.http.get<ActivityResponse[]>(`${this.endpoint}/activity`);
  }

  public getActivityById(id: string): Observable<ActivityResponse> {
    return this.http.get<ActivityResponse>(`${this.endpoint}/activity/${id}`);
  }

  public createActivity(request: CreateActivityRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/activity`, request);
  }

  public updateActivity(id: string, request: UpdateActivityRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/activity/${id}`, request);
  }

  public deleteActivity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/activity/${id}`);
  }

  public getAllCharacters(): Observable<CharacterResponse[]> {
    return this.http.get<CharacterResponse[]>(`${this.endpoint}/character`);
  }

  public getCharacterById(id: string): Observable<CharacterResponse> {
    return this.http.get<CharacterResponse>(`${this.endpoint}/character/${id}`);
  }

  public createCharacter(request: CreateCharacterRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/character`, request);
  }

  public updateCharacter(id: string, request: UpdateCharacterRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/character/${id}`, request);
  }

  public awardCharacter(id: string, request: AwardCharacterRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/character/${id}/award`, request);
  }

  public awardCharacterBatch(request: AwardCharacterBatchRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/batch/character/award`, request);
  }

  public deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/character/${id}`);
  }

  public getCurrentDowntimes(): Observable<DowntimeResponse[]> {
    return this.http.get<DowntimeResponse[]>(`${this.endpoint}/downtime/current`);
  }

  public getCompletedDowntimes(): Observable<DowntimeResponse[]> {
    return this.http.get<DowntimeResponse[]>(`${this.endpoint}/downtime/completed`);
  }

  public getDowntimeById(id: string): Observable<DowntimeResponse> {
    return this.http.get<DowntimeResponse>(`${this.endpoint}/downtime/${id}`);
  }

  public createDowntime(request: CreateDowntimeRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/downtime`, request);
  }

  public createDowntimeBatch(request: CreateDowntimeBatchRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/batch/downtime`, request);
  }

  public updateDowntime(id: string, request: UpdateDowntimeRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/downtime/${id}`, request);
  }

  public advanceDowntime(id: string, request: AdvanceDowntimeRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/downtime/${id}/advance`, request);
  }

  public advanceDowntimeBatch(request: AdvanceDowntimeBatchRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/batch/downtime/advance`, request);
  }

  public deleteDowntime(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/downtime/${id}`);
  }

  public getAllApiKeys(): Observable<ApiKeyResponse[]> {
    return this.http.get<ApiKeyResponse[]>(`${this.endpoint}/apiKey`);
  }

  public getApiKeyByKey(key: string): Observable<ApiKeyResponse> {
    return this.http.get<ApiKeyResponse>(`${this.endpoint}/apiKey/${key}`);
  }

  public createApiKey(request: CreateApiKeyRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/apiKey`, request);
  }

  public updateApiKey(id: string, request: UpdateApiKeyRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/apiKey/${id}`, request);
  }

  public deleteApiKey(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/apiKey/${id}`);
  }

  public searchUsers(query: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.endpoint}/user/${encodeURIComponent(query)}`);
  }
}
