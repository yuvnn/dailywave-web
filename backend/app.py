from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from model_predict import predict_score
from Calculation import calculation
from flask import Response
import json

app = Flask(__name__)
CORS(app)

# MongoDB 연결
client = MongoClient("mongodb://localhost:27017/")
db = client["local"]
collection = db["dailywave_diary"]

#감정분석, 노래추천 
@app.route('/api/diary', methods=['POST'])
def save_diary():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No input data provided'}), 400

        date = data.get('date')
        content = data.get('content')

        if not date or not content or not content.strip():
            return jsonify({'error': 'Date or content missing'}), 400

        print(f"날짜: {date}, 내용: {content}")

        # 감정 점수 예측
        emotion_scores = predict_score(content)
        print("Emotion Scores:", emotion_scores)

        # 감정 점수 기반 계산 및 노래 추천
        result_data = calculation(emotion_scores, top_n=1)
        print("Result Data:", result_data)

        # MongoDB에 저장할 문서 생성
        document = {
            "date": date,
            "diary": content,
            "emotion_scores": emotion_scores,
            "result": result_data,
            "submitted": True
        }

        # 날짜 중복 시 덮어쓰기
        collection.replace_one({"date": date}, document, upsert=True)

        return jsonify({"message": "일기 저장 완료", "result": result_data}), 200

    except Exception as e:
        return jsonify({
            'error': '처리 중 오류가 발생했습니다.',
            'details': str(e)
        }), 500

# 날짜 통해 일기조회
@app.route('/api/diary/<date>', methods=['GET'])
def get_diary(date):
    try:
        document = collection.find_one({"date": date})
        if document:
            document['_id'] = str(document['_id'])  # ObjectId를 문자열로 변환
            return Response(
                json.dumps(document, ensure_ascii=False),
                content_type="application/json; charset=utf-8"
            )
        else:
            return jsonify({"message": "해당 날짜의 일기가 없습니다."}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 전체 일기 조회
@app.route('/api/diary-entries', methods=['GET'])
def get_diary_entries():
    entries = list(collection.find({}, {'_id': 0}))  # _id 제외
    return jsonify(entries)

if __name__ == '__main__':
    app.run(debug=True)
