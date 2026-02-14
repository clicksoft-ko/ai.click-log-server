# Linux Backup API

## 엔드포인트

### 1. 백업 기록 생성

`POST /api/clicksoft/linux-back`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000", // optional (미전달 시 자동 생성)
  "ykiho": "12345678",
  "key": "daily-backup",
  "backupPath": "/backup/2026/02",
  "startedAt": "2026-02-03T09:00:00Z"
}
```

### 2. 백업 종료 시간 업데이트

`PATCH /api/clicksoft/linux-back/:id`

```json
{
  "endedAt": "2026-02-03T09:30:00Z"
}
```

### 3. 최신 백업 조회

`GET /api/clicksoft/linux-back/latest`

(ykiho, key) 조합별 가장 최근 백업 1건을 DB 정보와 함께 배열로 반환합니다.
테이블 백업 중 에러가 있으면 해당 DB 객체에만 `errorLogs`가 추가됩니다.

**응답 예시:**

```json
[
  {
    "id": "550e8400-...",
    "ykiho": "12345678",
    "key": "daily-backup",
    "backupPath": "/backup/2026/02",
    "startedAt": "2026-02-03T09:00:00.000Z",
    "endedAt": "2026-02-03T09:30:00.000Z",
    "dbs": [
      {
        "id": "660e8400-...",
        "backId": "550e8400-...",
        "dbName": "click_main",
        "elapsedMs": 1500,
        "createdAt": "2026-02-03T09:05:00.000Z",
        "errorLogs": [
          {
            "tblName": "users",
            "errorMessage": "permission denied",
            "createdAt": "2026-02-03T09:05:01.000Z"
          }
        ]
      }
    ]
  }
]
```

### 3-1. 특정 요양기호 최신 백업 조회

`GET /api/clicksoft/linux-back/latest/:ykiho`

전달한 `ykiho`에서 key별 가장 최근 백업 1건을 DB 정보와 함께 배열로 반환합니다.
테이블 백업 중 에러가 있으면 해당 DB 객체에만 `errorLogs`가 추가됩니다.

**응답 예시:**

```json
[
  {
    "id": "550e8400-...",
    "ykiho": "12345678",
    "key": "daily-backup",
    "backupPath": "/backup/2026/02",
    "startedAt": "2026-02-03T09:00:00.000Z",
    "endedAt": "2026-02-03T09:30:00.000Z",
    "dbs": [
      {
        "id": "660e8400-...",
        "backId": "550e8400-...",
        "dbName": "click_main",
        "elapsedMs": 1500,
        "createdAt": "2026-02-03T09:05:00.000Z",
        "errorLogs": [
          {
            "tblName": "users",
            "errorMessage": "permission denied",
            "createdAt": "2026-02-03T09:05:01.000Z"
          }
        ]
      }
    ]
  }
]
```

### 4. DB 백업 기록 생성

`POST /api/clicksoft/linux-back/db`

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000", // optional (미전달 시 자동 생성)
  "backId": "550e8400-e29b-41d4-a716-446655440000",
  "dbName": "click_main",
  "elapsedMs": 1500
}
```

### 5. 테이블 백업 기록 생성

`POST /api/clicksoft/linux-back/tbl`

```json
{
  "backDbId": "660e8400-e29b-41d4-a716-446655440000",
  "tblName": "users",
  "elapsedMs": 250,
  "errorMessage": "optional error message" // optional
}
```

## 호출 순서

```
1. POST /linux-back          → 백업 시작 기록 (id 반환)
2. POST /linux-back/db       → DB별 백업 기록 (backId에 1번 id 사용)
3. POST /linux-back/tbl      → 테이블별 백업 기록 (backDbId에 2번 id 사용)
4. PATCH /linux-back/:id     → 백업 완료 시 ended_at 기록
```
