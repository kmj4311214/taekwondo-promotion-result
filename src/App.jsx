import { useMemo, useState } from 'react';
import { Award, Camera, Check, ChevronRight, Medal, RotateCcw, ShieldCheck, Sparkles, Trophy, X } from 'lucide-react';
import laurel from './assets/laurel.svg';

const initialForm = {
  name: '',
  level: '',
  result: 'pass',
  photoDataUrl: '',
  photoName: '',
};

const levelOptions = ['1품', '2품', '3품', '4품'];

function App() {
  const [form, setForm] = useState(initialForm);
  const [photoError, setPhotoError] = useState('');
  const [status, setStatus] = useState('form');
  const [saveState, setSaveState] = useState('idle');

  const isComplete = useMemo(
    () => form.name.trim() && form.level && form.result && form.photoDataUrl,
    [form],
  );

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    setPhotoError('');

    if (!file) {
      setForm((current) => ({ ...current, photoDataUrl: '', photoName: '' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setPhotoError('사진 파일만 등록할 수 있습니다.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('2MB 이하의 사진을 등록해 주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        photoDataUrl: reader.result,
        photoName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const saveReview = async () => {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      student_name: form.name.trim(),
      promotion_level: form.level,
      result: form.result,
      photo_data_url: form.photoDataUrl,
      photo_filename: form.photoName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save review');
    }

    return 'saved';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isComplete) return;

    setStatus('checking');
    setSaveState('saving');

    const wait = new Promise((resolve) => setTimeout(resolve, 1800));

    try {
      const [saved] = await Promise.all([saveReview(), wait]);
      setSaveState(saved);
    } catch {
      setSaveState('failed');
      await wait;
    }

    setStatus('result');
  };

  const reset = () => {
    setForm(initialForm);
    setPhotoError('');
    setSaveState('idle');
    setStatus('form');
  };

  const isPass = form.result === 'pass';

  return (
    <main className="app-shell">
      <section className={`stage ${status !== 'form' ? 'stage-result' : ''}`}>
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />

        {status === 'form' && (
          <div className="panel intake-panel">
            <div className="title-zone">
              <div className="crest">
                <img src={laurel} alt="" />
                <Trophy aria-hidden="true" />
              </div>
              <p className="eyebrow">TAEKWONDO AWARDS</p>
              <h1>승품단 심사 결과 안내</h1>
            </div>

            <form className="intake-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>이름</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="아이 이름"
                  autoComplete="name"
                />
              </label>

              <div className="field">
                <span>승품단</span>
                <div className="option-grid" role="radiogroup" aria-label="승품단 선택">
                  {levelOptions.map((level) => (
                    <button
                      type="button"
                      className={form.level === level ? 'choice active' : 'choice'}
                      key={level}
                      onClick={() => setForm((current) => ({ ...current, level }))}
                    >
                      <Medal aria-hidden="true" />
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>사진</span>
                <label className={form.photoDataUrl ? 'photo-drop has-photo' : 'photo-drop'}>
                  {form.photoDataUrl ? (
                    <img src={form.photoDataUrl} alt={`${form.name || '아이'} 사진 미리보기`} />
                  ) : (
                    <>
                      <Camera aria-hidden="true" />
                      <strong>사진 등록</strong>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhoto} />
                </label>
                {photoError && <p className="input-note error">{photoError}</p>}
              </div>

              <div className="field">
                <span>심사 결과</span>
                <div className="result-toggle">
                  <button
                    type="button"
                    className={form.result === 'pass' ? 'result-button pass active' : 'result-button pass'}
                    onClick={() => setForm((current) => ({ ...current, result: 'pass' }))}
                  >
                    <Check aria-hidden="true" />
                    합격
                  </button>
                  <button
                    type="button"
                    className={form.result === 'fail' ? 'result-button fail active' : 'result-button fail'}
                    onClick={() => setForm((current) => ({ ...current, result: 'fail' }))}
                  >
                    <X aria-hidden="true" />
                    불합격
                  </button>
                </div>
              </div>

              <button className="primary-action" type="submit" disabled={!isComplete}>
                결과 조회
                <ChevronRight aria-hidden="true" />
              </button>
            </form>
          </div>
        )}

        {status === 'checking' && (
          <div className="panel checking-panel">
            <div className="spinner-ring">
              <img src={laurel} alt="" />
              <ShieldCheck aria-hidden="true" />
            </div>
            <p className="eyebrow">RESULT CONFIRMATION</p>
            <h2>합격여부를 조회중입니다</h2>
            <div className="progress-line">
              <span />
            </div>
          </div>
        )}

        {status === 'result' && (
          <div className="panel result-panel">
            <div className="award-portrait">
              <img className="laurel-frame" src={laurel} alt="" />
              <div className="portrait-ring">
                <img src={form.photoDataUrl} alt={`${form.name} 사진`} />
              </div>
            </div>

            <p className="eyebrow">{form.level} 심사 결과</p>
            <h2>
              {isPass ? '축하합니다.' : '결과 안내'}
              <span>{isPass ? '승품단 심사에 합격을 했습니다.' : '이번 심사는 불합격입니다.'}</span>
            </h2>
            <p className="message">
              {isPass
                ? `${form.name} 학생의 멋진 도전과 성장을 진심으로 축하합니다. 오늘의 품격 있는 순간을 오래 기억해 주세요.`
                : `${form.name} 학생의 노력은 다음 도전을 위한 소중한 발판입니다. 다시 빛날 순간을 응원합니다.`}
            </p>

            <div className="result-meta">
              <div>
                <span>이름</span>
                <strong>{form.name}</strong>
              </div>
              <div>
                <span>승품단</span>
                <strong>{form.level}</strong>
              </div>
              <div>
                <span>기록</span>
                <strong>{saveState === 'saved' ? '저장 완료' : saveState === 'failed' ? '저장 확인 필요' : '준비 완료'}</strong>
              </div>
            </div>

            <div className="result-actions">
              <Sparkles aria-hidden="true" />
              <button type="button" onClick={reset}>
                <RotateCcw aria-hidden="true" />
                다시 입력
              </button>
            </div>
          </div>
        )}

        <Award className="corner-mark corner-left" aria-hidden="true" />
        <Award className="corner-mark corner-right" aria-hidden="true" />
      </section>
    </main>
  );
}

export default App;
