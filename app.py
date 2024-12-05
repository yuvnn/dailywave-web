from flask import Flask, render_template, request, jsonify
from model_predict import predict_score
from Calculation import calculation

app = Flask(__name__, static_folder='static')

# 홈 페이지 라우트
@app.route('/')
def index():
    return render_template('index.html')

# 감정 분석 및 처리 라우트
@app.route('/process', methods=['POST'])
def process_text():
    try:
        # JSON 데이터 받기
        data = request.json
        text = data.get('text', '')  # 입력 텍스트 (없으면 기본값 '')

        if not text.strip():
            return jsonify({'error': '입력된 텍스트가 없습니다.'}), 400

        # 감정 점수 예측 및 결과 계산
        emotion_scores = predict_score(text)
        result_data = calculation(emotion_scores,1)

        print("Result Data:", result_data)  # 디버깅 로그 출력

        # 결과를 JSON 형태로 반환
        return jsonify(result_data)

    except Exception as e:
        # 에러 발생 시 디버깅 정보와 함께 반환
        return jsonify({'error': '처리 중 오류가 발생했습니다.', 'details': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
