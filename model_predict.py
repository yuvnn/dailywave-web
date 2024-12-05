import time
import torch
import re
import emoji
import pandas as pd
import numpy as np
from soynlp.normalizer import repeat_normalize
from transformers import AutoModelForSequenceClassification, AutoTokenizer
ID2LABEL_KOR = {0: '분노',
        1: '슬픔',
        2: '불안',
        3: '상처',
        4: '당황',
        5: '기쁨'
        }
def clean(text):
    pattern = re.compile(f'[^ .,?!/@$%~％·∼()\x00-\x7Fㄱ-ㅣ가-힣]+')
    url_pattern = re.compile(
        r'https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)')
    text = pattern.sub(' ', text)
    text = emoji.replace_emoji(text, replace='') #emoji 삭제
    text = url_pattern.sub('', text)
    text = text.strip()
    text = repeat_normalize(text, num_repeats=2)

    return text

def infer(sentences):
    global model
    global tokenizer
    id2label = ID2LABEL_KOR
    results = []
    
    ckpt_path = './10thou(6l)-4579'
    model = AutoModelForSequenceClassification.from_pretrained(ckpt_path)
    tokenizer = AutoTokenizer.from_pretrained(ckpt_path)

    model.eval()
    for sentence in sentences:
        sentence = clean(sentence)

        infer_stime = time.time()
        encoding = tokenizer(sentence, return_tensors='pt')
        outputs = model(**encoding)
        logits = outputs.logits
        sigmoid = torch.nn.Sigmoid()
        preds = sigmoid(logits.squeeze())
        infer_etime = time.time()

        result = {'문장': sentence,
                  '추론시간': infer_etime - infer_stime
                  }

        # 가장 높은 수치를 가진 라벨 찾기
        max_prob_idx = torch.argmax(preds).item()
        result['추론 감정'] = id2label[max_prob_idx]  # 해당 인덱스의 라벨을 가져옴

        for id, label in id2label.items():
            prob = preds[id].item()
            result[label] = prob

        results.append(result)

    results = pd.DataFrame(results)

    return results

def predict(sentences):
    list_sentences = [sentences]
    ret = infer(list_sentences)
    
    return ret

def infer_score(sentences):
    global model
    global tokenizer
    id2label = ID2LABEL_KOR
    results = []
    
    ckpt_path = './DVforEC(a_6l)-001'
    model = AutoModelForSequenceClassification.from_pretrained(ckpt_path)
    tokenizer = AutoTokenizer.from_pretrained(ckpt_path)

    model.eval()
    for sentence in sentences:
        sentence = clean(sentence)

        infer_stime = time.time()
        encoding = tokenizer(sentence, return_tensors='pt')
        outputs = model(**encoding)
        logits = outputs.logits
        sigmoid = torch.nn.Sigmoid()
        preds = sigmoid(logits.squeeze())
        infer_etime = time.time()

        result = {'문장': sentence
                  }

        for id, label in id2label.items():
            prob = preds[id].item()
            result[label] = prob

        results.append(result)

    results = pd.DataFrame(results)

    return results

def predict_score(sentences):
    # \n 기준으로 문장 나누기
    list_sentences = sentences.strip().split('\n\n')
    cleaned_segments = [segment.strip() for segment in list_sentences if segment.strip()]
    min_length=50
    max_length=100
    
    adjusted_segments = []
    temp_segment = ""
    
    for segment in cleaned_segments:
        # 현재 구절이 너무 짧은 경우 임시 저장
        if len(segment) < min_length:
            temp_segment += " " + segment  # 임시 구절에 병합
        else:
            # 임시 구절이 있으면 현재 구절과 병합하여 추가
            if temp_segment:
                adjusted_segments.append(temp_segment.strip() + " " + segment.strip())
                temp_segment = ""  # 임시 구절 초기화
            else:
                adjusted_segments.append(segment.strip())
    
    # 남아있는 임시 구절 추가
    if temp_segment:
        adjusted_segments.append(temp_segment.strip())
    
    # 3. 너무 긴 구절을 잘라내기
    final_segments = []
    for segment in adjusted_segments:
        if len(segment) > max_length:
            # 긴 구절은 문장 단위로 쪼갠 뒤 적절히 나누기
            sen = segment.split("\n")  # 문장 단위로 나누기
            current_part = ""
            for sentence in sen:
                if len(current_part) + len(sentence) + 1 <= max_length:
                    current_part += sentence + "\n"
                else:
                    final_segments.append(current_part.strip())
                    current_part = sentence + "\n"
            if current_part:
                final_segments.append(current_part.strip())
        else:
            final_segments.append(segment.strip())
            
    
    # 예측 결과 반환
    ret = infer(final_segments)
    ret = ret.drop(columns=["문장", "추론시간", "추론 감정"])
    sum = ret.sum()
    sumsum = sum.sum()
    result=sum/sumsum
    return list(result)

if __name__ == '__main__':
    ckpt_path = './DVforEC(a_6l)-001'
    model = AutoModelForSequenceClassification.from_pretrained(ckpt_path)
    tokenizer = AutoTokenizer.from_pretrained(ckpt_path)

    sentences = '아무리 웃어보려 해도 마음 한구석엔 지울 수 없는 그림자가 드리워져 있었다.'
    
    model.eval()
    ret = predict_score(sentences)
    print(ret)