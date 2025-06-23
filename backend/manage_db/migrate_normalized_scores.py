import numpy as np
from pymongo import MongoClient

def normalize_vector(vec):
    """입력 리스트를 정규화된 벡터로 변환"""
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec  # 정규화 불가 → 원본 유지
    return (np.array(vec) / norm).tolist()

def migrate_normalized_scores():
    # MongoDB 연결
    client = MongoClient("mongodb://localhost:27017/")
    db = client["local"]
    collection = db["dailywave_molon_songs"]

    # 리스트 타입(score) 필드만 필터링
    query = {
        "score": {"$type": "array"},
        "$expr": {"$eq": [{"$size": "$score"}, 6]}  # 길이 6 필터링
    }

    docs = list(collection.find(query))
    print(f"총 {len(docs)}개의 문서 정규화 중...")

    updated_count = 0
    for doc in docs:
        score = doc["score"]
        try:
            normed_score = normalize_vector(score)
            collection.update_one(
                {"_id": doc["_id"]},
                {"$set": {"score": normed_score}}
            )
            updated_count += 1
        except Exception as e:
            print(f"[오류] _id={doc['_id']} 처리 중 문제 발생: {e}")

    print(f"정규화 완료: {updated_count}개 문서 업데이트됨.")

if __name__ == "__main__":
    migrate_normalized_scores()
