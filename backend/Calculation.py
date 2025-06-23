import pandas as pd
import numpy as np
import json
from pymongo import MongoClient
import time

ID2LABEL_KOR = {0: '분노',
        1: '슬픔',
        2: '불안',
        3: '상처',
        4: '당황',
        5: '기쁨'
        }

def cosine_similarity(vec1, vec2):
    """
    두 벡터 간의 코사인 유사도를 계산
    벡터의 크기가 0이면 0을 반환
    """
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot_product / (norm1 * norm2)


def get_database_connection():
    """
    MongoDB에서 dailywave_molon_songs 컬렉션 객체를 반환합니다.
    """
    client = MongoClient("mongodb://localhost:27017/")  # 연결 URI 필요시 수정
    db = client["local"]  # 데이터베이스 이름
    collection = db["dailywave_molon_songs"]  # 컬렉션 이름
    return collection

def return_result(top_emotions, song_results):
    top1, top2, top3 = top_emotions[:3]
    return {
        "최상위감정1": top1["감정"],
        "최상위감정1비율": top1["비율"],
        "최상위감정2": top2["감정"],
        "최상위감정2비율": top2["비율"],
        "최상위감정3": top3["감정"],
        "최상위감정3비율": top3["비율"],
        "노래결과": song_results,
    }

def calculation(emotion_scores, top_n=5):
    # 1. 감정 벡터 유효성 검사
    if not isinstance(emotion_scores, (list, np.ndarray)) or len(emotion_scores) != 6:
        raise ValueError("emotion_scores must be a list or array of length 6.")

    # 2. 상위 3개 감정 추출
    sorted_emotions = sorted(
        [(ID2LABEL_KOR[i], score) for i, score in enumerate(emotion_scores)],
        key=lambda x: x[1],
        reverse=True
    )
    top_emotions = [
        {"감정": emo, "비율": round(ratio, 2)}
        for emo, ratio in sorted_emotions[:3]
    ]

    # 3. MongoDB에서 데이터 불러오기
    collection = get_database_connection()
    cursor = collection.find({}, {"song_no": 1, "title": 1, "artist": 1, "score": 1})
    data = list(cursor)

    if not data:
        return return_result(top_emotions, [])

    # 4. DataFrame으로 변환
    df = pd.DataFrame(data)

    # 5. score 필드 유효성 필터링
    df = df[df["score"].apply(lambda x: isinstance(x, list) and len(x) == 6)]

    if df.empty:
        return return_result(top_emotions, [])

    # 6. 유사도 계산
    input_vector = np.array(emotion_scores)
    input_vector = input_vector / np.linalg.norm(input_vector)

    score_matrix = np.array(df["score"].tolist())
    similarity = score_matrix @ input_vector
    df["similarity"] = similarity

    # 7. 유사도 상위 N개 추출
    top_df = df.nlargest(top_n, "similarity")

    song_results = [
        {
            "노래제목": row["title"],
            "아티스트": row["artist"],
            "앨범표지": f"/assets/album_images/{int(row['song_no'])}.jpg",
            "유사도": round(row["similarity"], 4),
        }
        for _, row in top_df.iterrows()
    ]

    # 8. 결과 반환
    return return_result(top_emotions, song_results)


if __name__ == "__main__":
    # result 배열
    result = [0.1345, 0.25432, 0.3123234, 0.14556, 0.2223, 0.1211]
    top_n = 1
    start_time = time.time()
    df_with_similarity = calculation(result, top_n=top_n)
    end_time = time.time()
    print(df_with_similarity)
    print(f"수행시간: {end_time - start_time:.4f}초")