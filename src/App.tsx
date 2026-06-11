import { useState } from 'react'
function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-8">
      {/* Tailwind test */}
      <h1 className="text-4xl font-bold text-blue-400">Metrico</h1>
      <p className="text-gray-400 text-sm">Vite + React + TypeScript + Tailwind</p>

      {/* State test */}
      <button
        type="button"
        onClick={() => setCount(c => c + 1)}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
      >
        Count: {count}
      </button>

      {/* Checklist */}
      <ul className="text-sm text-gray-400 space-y-1 text-left">
        <li>✅ Vite dev server</li>
        <li>✅ React + TypeScript</li>
        <li>✅ Tailwind CSS</li>
        <li>✅ @/ alias configured</li>
        <li>✅ ESLint + Prettier</li>
      </ul>
    </div>
  )
}

export default App
