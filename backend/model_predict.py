import time
import torch
import re
import emoji
import pandas as pd
from soynlp.normalizer import repeat_normalize
from transformers import AutoModelForSequenceClassification, AutoTokenizer

# 감정 인덱스를 한국어 라벨로 매핑
ID2LABEL_KOR = {
    0: '분노',
    1: '슬픔',
    2: '불안',
    3: '상처',
    4: '당황',
    5: '기쁨'
}

# 텍스트 전처리 함수
def clean(text):
    pattern = re.compile(r'[^ .,?!/@$%~％·∼()\x00-\x7Fㄱ-ㅣ가-힣]+')
    url_pattern = re.compile(r'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)')
    text = pattern.sub(' ', text)
    text = emoji.replace_emoji(text, replace='')  # 이모지 제거
    text = url_pattern.sub('', text)
    text = text.strip()
    text = repeat_normalize(text, num_repeats=2)
    return text

# 감정 점수 추론 함수
def infer_score(sentences):
    id2label = ID2LABEL_KOR
    results = []

    # 모델 경로
    ckpt_path = './10thou(6l)-4579'
    model = AutoModelForSequenceClassification.from_pretrained(ckpt_path)
    tokenizer = AutoTokenizer.from_pretrained(ckpt_path)
    model.eval()

    for sentence in sentences:
        sentence = clean(sentence)
        encoding = tokenizer(sentence, return_tensors='pt')
        outputs = model(**encoding)
        logits = outputs.logits
        preds = torch.sigmoid(logits.squeeze())

        result = {}
        for idx, label in id2label.items():
            result[label] = preds[idx].item()
        results.append(result)

    return pd.DataFrame(results)

# 긴 텍스트 분할 및 점수 계산
def predict_score(text):
    segments = [s.strip() for s in text.strip().split('\n\n') if s.strip()]
    min_len, max_len = 50, 100
    adjusted_segments, temp = [], ""

    # 짧은 문장 병합
    for seg in segments:
        if len(seg) < min_len:
            temp += " " + seg
        else:
            if temp:
                adjusted_segments.append(temp.strip() + " " + seg)
                temp = ""
            else:
                adjusted_segments.append(seg)
    if temp:
        adjusted_segments.append(temp.strip())

    # 긴 문장 자르기
    final_segments = []
    for seg in adjusted_segments:
        if len(seg) > max_len:
            parts = seg.split("\n")
            current = ""
            for part in parts:
                if len(current) + len(part) + 1 <= max_len:
                    current += part + "\n"
                else:
                    final_segments.append(current.strip())
                    current = part + "\n"
            if current:
                final_segments.append(current.strip())
        else:
            final_segments.append(seg)

    # 감정 점수 추론
    df = infer_score(final_segments)
    score_sum = df.sum().sum()
    result = df.sum() / score_sum
    return list(result)

# 테스트용 실행 코드
if __name__ == '__main__':
    sample_text = '아무리 웃어보려 해도 마음 한구석엔 지울 수 없는 그림자가 드리워져 있었다.'
    scores = predict_score(sample_text)
    print(scores)
