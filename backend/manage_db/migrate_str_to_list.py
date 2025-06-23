import json
from pymongo import MongoClient

def migrate_score_string_to_list():
    # 1. MongoDB 연결
    client = MongoClient("mongodb://localhost:27017/")
    db = client["local"]
    collection = db["dailywave_molon_songs"]

    # 2. score가 문자열(string)인 문서만 찾기
    query = {"score": {"$type": "string"}}
    documents = list(collection.find(query))

    print(f"총 {len(documents)}개의 문서를 변환합니다...")

    updated_count = 0

    for doc in documents:
        try:
            score_str = doc["score"]
            score_list = json.loads(score_str)  # 문자열 → 리스트
            if isinstance(score_list, list) and all(isinstance(x, (int, float)) for x in score_list):
                # _id 기준으로 업데이트
                collection.update_one(
                    {"_id": doc["_id"]},
                    {"$set": {"score": score_list}}
                )
                updated_count += 1
        except (json.JSONDecodeError, TypeError):
            print(f"[오류] 잘못된 JSON 형식: _id = {doc['_id']}")

    print(f"변환 완료: {updated_count}개 문서 업데이트됨.")

if __name__ == "__main__":
    migrate_score_string_to_list()
