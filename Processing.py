from model_predict import predict_score
import pandas as pd

file_path = 'melon_songs.csv'
df = pd.read_csv(file_path)

df.drop_duplicates(inplace=True) #중복 제거

# lyrics 열을 사용하여 모델 예측 수행
df['score'] = df['lyrics'].apply(predict_score)

df.to_csv(file_path, index=False, encoding="utf-8-sig")

print(f"스코어가 추가된 데이터가 {file_path}에 저장되었습니다.")
