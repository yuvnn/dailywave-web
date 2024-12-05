import pandas as pd
import numpy as np
ID2LABEL_KOR = {0: '분노',
        1: '슬픔',
        2: '불안',
        3: '상처',
        4: '당황',
        5: '기쁨'
        }

def cosine_similarity(vec1, vec2):
    """
    두 벡터의 코사인 유사도를 계산합니다.
    vec1: numpy 배열
    vec2: numpy 배열
    """
    # 벡터의 내적 계산
    dot_product = np.dot(vec1, vec2)
    # 벡터 크기 계산
    norm_vec1 = np.linalg.norm(vec1)
    norm_vec2 = np.linalg.norm(vec2)
    # 코사인 유사도 계산
    if norm_vec1 == 0 or norm_vec2 == 0:  # 벡터 크기가 0일 경우 0 반환
        return 0
    return dot_product / (norm_vec1 * norm_vec2)

def calculation(emotion_scores, top_n=5):
    """
    입력된 감정 점수와 노래 데이터를 바탕으로 유사도가 가장 높은 노래 정보를 반환합니다.
    emotion_scores: 사용자의 감정 점수 리스트
    top_n: 유사도가 높은 상위 n개 노래를 고려 (기본값 5)
    """
    # 상위 감정 추출
    sorted_emotions = sorted(
        [(ID2LABEL_KOR[i], score) for i, score in enumerate(emotion_scores)], 
        key=lambda x: x[1], 
        reverse=True
    )
    # 상위 감정 정보 3개 추출
    top_emotions = [{"감정": emo, "비율": round(ratio, 2)} for emo, ratio in sorted_emotions[:3]]
    
    # 데이터 로드
    file_path = 'melon_songs.csv'
    df = pd.read_csv(file_path)
    
    # score를 리스트로 변환
    df['score'] = df['score'].apply(eval)
    
    # similarity 계산
    df['similarity'] = df['score'].apply(lambda x: cosine_similarity(x, emotion_scores))
    
    # similarity 기준으로 상위 n개의 행 선택
    top_df = df.nlargest(top_n, 'similarity')

     # 노래 결과 리스트 생성
    song_results = []
    for _, row in top_df.iterrows():
        song_no = row['song_no']
        album_cover_path = f"/static/images/{song_no}.jpg"
        song_results.append({
            "노래제목": row['title'],
            "아티스트": row['artist'],
            "앨범표지": album_cover_path,
            "유사도": round(row['similarity'], 4)
        })
    
    # 반환 데이터 생성
    result = {
        "최상위감정1": top_emotions[0]["감정"],
        "최상위감정1비율": top_emotions[0]["비율"],
        "최상위감정2": top_emotions[1]["감정"],
        "최상위감정2비율": top_emotions[1]["비율"],
        "최상위감정3": top_emotions[2]["감정"],
        "최상위감정3비율": top_emotions[2]["비율"],
        "노래결과": song_results
    }
    
    return result
if __name__ == "__main__":
    # result 배열
    result = [0.1345, 0.25432, 0.3123234, 0.14556, 0.2223, 0.1211]
    top_n = 1
    df_with_similarity = calculation(result, top_n=top_n)
    print(df_with_similarity)