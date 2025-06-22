import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';

const SCALE_OPTIONS = [
  'C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B',
];

export default function ScalePractice() {
  const [selectedScales, setSelectedScales] = useState(SCALE_OPTIONS);
  const [useMajor, setUseMajor] = useState(true);
  const [useMinor, setUseMinor] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDegrees, setSelectedDegrees] = useState([1, 2, 3, 4, 5, 6, 7]);

  const [prompt, setPrompt] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [resultMsg, setResultMsg] = useState('');

  // Semitone maps
  const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const NOTE_TO_SEMITONE = {
    C: 0,
    'C#': 1,
    'Db': 1,
    D: 2,
    'D#': 3,
    'Eb': 3,
    E: 4,
    F: 5,
    'F#': 6,
    'Gb': 6,
    G: 7,
    'G#': 8,
    'Ab': 8,
    A: 9,
    'A#': 10,
    'Bb': 10,
    B: 11,
  };

  const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
  const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10]; // natural minor

  const getNoteName = (semitone, preferFlats) =>
    preferFlats ? FLAT_NOTES[semitone] : SHARP_NOTES[semitone];

  const calcNthDegree = (degree, root, mode) => {
    const rootSemi = NOTE_TO_SEMITONE[root];
    const intervals = mode === 'Major' ? MAJOR_INTERVALS : MINOR_INTERVALS;
    const idx = (degree - 1) % 7;
    const noteSemi = (rootSemi + intervals[idx]) % 12;
    const preferFlats = root.includes('b');
    return getNoteName(noteSemi, preferFlats);
  };

  const normalizeNote = (note) => {
    const trimmed = note.trim().replace(/\s+/g, '');
    if (trimmed === '') return '';
    const first = trimmed[0].toUpperCase();
    const restRaw = trimmed.slice(1).replace(/♯/g, '#').replace(/♭/g, 'b');
    let rest = '';
    if (restRaw.startsWith('#')) rest = '#';
    else if (restRaw.toLowerCase().startsWith('b')) rest = 'b';
    return first + rest;
  };

  const checkUserAnswer = () => {
    const input = normalizeNote(userAnswer);
    const correct = normalizeNote(correctAnswer);
    const inputSemi = NOTE_TO_SEMITONE[input] ?? null;
    const correctSemi = NOTE_TO_SEMITONE[correct];
    if (inputSemi !== null && inputSemi === correctSemi) {
      setResultMsg('Correct');
    } else {
      setResultMsg('Wrong');
    }
  };

  const toggleScale = (scale) => {
    setSelectedScales((prev) =>
      prev.includes(scale) ? prev.filter((s) => s !== scale) : [...prev, scale]
    );
  };

  const toggleDegree = (deg) => {
    setSelectedDegrees((prev) =>
      prev.includes(deg) ? prev.filter((d) => d !== deg) : [...prev, deg]
    );
  };

  const modesAllowed = useMemo(() => {
    const arr = [];
    if (useMajor) arr.push('Major');
    if (useMinor) arr.push('Minor');
    return arr;
  }, [useMajor, useMinor]);

  const getOrdinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const generatePrompt = () => {
    if (
      selectedScales.length === 0 ||
      modesAllowed.length === 0 ||
      selectedDegrees.length === 0
    ) {
      return { promptStr: 'No scales/modes selected', answer: '' };
    }
    const degree =
      selectedDegrees[Math.floor(Math.random() * selectedDegrees.length)];
    const root = selectedScales[Math.floor(Math.random() * selectedScales.length)];
    const mode = modesAllowed[Math.floor(Math.random() * modesAllowed.length)];
    const promptStr = `${getOrdinal(degree)} degree of ${root} ${mode}`;
    const answer = calcNthDegree(degree, root, mode);
    return { promptStr, answer };
  };

  // regenerate prompt when settings change or on initial mount
  useEffect(() => {
    const { promptStr, answer } = generatePrompt();
    setPrompt(promptStr);
    setCorrectAnswer(answer);
    setUserAnswer('');
    setResultMsg('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScales, modesAllowed, selectedDegrees]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      {/* Gear Settings Button */}
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800"
        aria-label="Settings"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      <h1 className="text-3xl font-bold">Scale Practice</h1>

      {/* Prompt Display */}
      <div className="text-xl font-semibold text-center min-h-[2rem]">
        {prompt}
      </div>
      {/* Answer Input */}
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Your answer"
        className="px-3 py-2 border rounded w-48 text-center"
      />

      {resultMsg && (
        <div className="flex flex-col items-center gap-1">
          <div
            className={`text-lg font-semibold ${
              resultMsg === 'Correct' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {resultMsg}
          </div>
          {resultMsg === 'Wrong' && (
            <div className="text-sm text-gray-500">Correct Answer: {correctAnswer}</div>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={checkUserAnswer}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          Check Answer
        </button>

        <button
          onClick={() => {
            const { promptStr, answer } = generatePrompt();
            setPrompt(promptStr);
            setCorrectAnswer(answer);
            setUserAnswer('');
            setResultMsg('');
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>

      <Link
        to="/"
        className="mt-auto px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
      >
        Back to Home
      </Link>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg p-6 bg-white rounded shadow-lg relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Settings</h2>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Scale Roots</h3>
              <div className="grid grid-cols-3 gap-2">
                {SCALE_OPTIONS.map((scale) => (
                  <label key={scale} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedScales.includes(scale)}
                      onChange={() => toggleScale(scale)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>{scale}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Modes</h3>
              <label className="flex items-center gap-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={useMajor}
                  onChange={() => setUseMajor((v) => !v)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span>Major</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useMinor}
                  onChange={() => setUseMinor((v) => !v)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span>Minor</span>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-2">Scale Degrees</h3>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((deg) => (
                  <label key={deg} className="flex items-center gap-1 text-sm justify-center">
                    <input
                      type="checkbox"
                      checked={selectedDegrees.includes(deg)}
                      onChange={() => toggleDegree(deg)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>{deg}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 