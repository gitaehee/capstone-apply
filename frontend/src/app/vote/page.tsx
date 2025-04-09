"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"

const LOCAL_KEY = "anonymous-rank-vote"

export default function RankVotePage() {
  const [rank, setRank] = useState<string>("")
  const [submittedRank, setSubmittedRank] = useState<string | null>(null)
  const [picks, setPicks] = useState<string[]>(["", "", "", "", ""])
  const [submitted, setSubmitted] = useState(false)
  const [allVotes, setAllVotes] = useState<Record<string, string[]>>({})
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setSubmittedRank(parsed.rank)
      setPicks(parsed.picks)
      setSubmitted(true)
    }
  }, [])

  const handleRankSubmit = () => {
    const n = parseInt(rank)
    if (!n || n < 1 || n > 43) {
      alert("1~42 사이의 등수를 입력하세요")
      return
    }
    setConfirming(true) // 확인 모드로 전환
  }

  const confirmRank = () => {
    setSubmittedRank(rank)
    setConfirming(false)
  }

  const cancelRank = () => {
    setConfirming(false)
    setRank("")
  }

  const handleFinalSubmit = () => {
    if (picks.some(p => p.trim() === "")) {
      alert("5지망을 모두 입력해주세요")
      return
    }
    const payload = {
      rank: submittedRank,
      picks,
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(payload))
    setSubmitted(true)
    const prev = JSON.parse(localStorage.getItem("allVotes") || "{}")
    prev[submittedRank!] = picks
    localStorage.setItem("allVotes", JSON.stringify(prev))
    setAllVotes(prev)
  }

  useEffect(() => {
    if (submitted) {
      const all = JSON.parse(localStorage.getItem("allVotes") || "{}")
      setAllVotes(all)
    }
  }, [submitted])

  const handleReset = () => {
    localStorage.removeItem(LOCAL_KEY)
    setSubmittedRank(null)
    setPicks(["", "", "", "", ""])
    setSubmitted(false)
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">5지망 기업 입력</h1>

      {confirming ? (
        <Card>
          <CardContent className="p-4 space-y-4">
            <p className="text-lg font-semibold">{rank}등이 맞습니까?</p>
            <div className="flex gap-4">
              <Button onClick={confirmRank}>네, 맞습니다</Button>
              <Button onClick={cancelRank}>아니오, 다시 입력할게요</Button>
            </div>
          </CardContent>
        </Card>
      ) : !submittedRank ? (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p>당신의 등수를 입력하세요 (1~42)</p>
            <Input value={rank} onChange={e => setRank(e.target.value)} placeholder="예: 1" />
            <Button onClick={handleRankSubmit}>등수 제출</Button>
          </CardContent>
        </Card>
      ) : !submitted ? (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p>{submittedRank}등의 5지망을 입력해주세요</p>
            {picks.map((pick, i) => (
              <Input
                key={i}
                value={pick}
                onChange={e => {
                  const newPicks = [...picks]
                  newPicks[i] = e.target.value
                  setPicks(newPicks)
                }}
                placeholder={`지망 ${i + 1}`}
              />
            ))}
            <Button onClick={handleFinalSubmit}>최종 제출</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 space-y-4">
            <p className="mb-2 font-semibold">전체 지망 결과</p>
            <div className="space-y-2">
              {Object.entries(allVotes)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([rank, choices]) => (
                  <div key={rank} className="border p-2 rounded">
                    <p className="font-medium">{rank}등</p>
                    <ul className="list-disc list-inside">
                      {choices.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
            <div className="mt-6">
              <Button onClick={handleReset}>지망 수정하기</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
