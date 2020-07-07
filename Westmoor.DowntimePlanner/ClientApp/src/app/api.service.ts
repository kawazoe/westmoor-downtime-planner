import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ActivityResponse {
  id: string;
  name: string;
  descriptionMarkdown: string;
  complicationMarkdown: string;
  costs: ActivityCostResponse[];
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
}

export interface CreateActivityCostRequest {
  kind: string;
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
}

export interface UpdateActivityCostRequest {
  kind: string;
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
}

export interface CreateCharacterRequest {
  playerFullName: string;
  characterFullName: string;
}

export interface UpdateCharacterRequest {
  playerFullName: string;
  characterFullName: string;
  accruedDowntimeDays: number;
}

export interface DowntimeResponse {
  id: string;
  character: CharacterResponse;
  activity: ActivityResponse;
  progresses: DowntimeProgressResponse[];
}

export interface DowntimeProgressResponse {
  activityCostKind: string;
  value: number;
}

export interface CreateDowntimeRequest {
  characterId: string;
  activityId: string;
  progresses: CreateDowntimeProgressRequest[];
}

export interface CreateDowntimeProgressRequest {
  activityCostKind: string;
  value: number;
}

export interface UpdateDowntimeRequest {
  characterId: string;
  activityId: string;
  progresses: UpdateDowntimeProgressRequest[];
}

export interface UpdateDowntimeProgressRequest {
  activityCostKind: string;
  value: number;
}

export interface UserResponse {
  key: string;
  owner: string;
  roles: string[];
  createdOn: string;
}

export interface CreateUserRequest {
  owner: string;
  roles: string[];
}

export interface UpdateUserRequest {
  owner: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private endpoint = '/api/v1';

  constructor(
    private http: HttpClient
  ) { }

  public getAllActivities(): Observable<ActivityResponse[]> {
    return this.http.get<ActivityResponse[]>(`${this.endpoint}/activity`);
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

  public createCharacter(request: CreateCharacterRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/character`, request);
  }

  public updateCharacter(id: string, request: UpdateCharacterRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/character/${id}`, request);
  }

  public deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/character/${id}`);
  }

  public getAllDowntimes(): Observable<DowntimeResponse[]> {
    return this.http.get<DowntimeResponse[]>(`${this.endpoint}/downtime`);
  }

  public createDowntime(request: CreateDowntimeRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/downtime`, request);
  }

  public updateDowntime(id: string, request: UpdateDowntimeRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/downtime/${id}`, request);
  }

  public deleteDowntime(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/downtime/${id}`);
  }

  public getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.endpoint}/user`);
  }

  public getUserByKey(key: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.endpoint}/user/${key}`);
  }

  public createUser(request: CreateUserRequest): Observable<void> {
    return this.http.post<void>(`${this.endpoint}/user`, request);
  }

  public updateUser(id: string, request: UpdateUserRequest): Observable<void> {
    return this.http.put<void>(`${this.endpoint}/user/${id}`, request);
  }

  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/user/${id}`);
  }
}
