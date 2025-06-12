// 절세 계산기 로직

// 1) 총원가  = Σ(단가 × 수량 × 1.00015)
// 2) 총수량  = 잔존 수량
// 3) 평단    = 총원가 / 총수량
// 4) 평가손익 = (종가 − 평단) × 잔존수량
//    실현손익 = (매도가 × 수량 − 매도수수료) − (평단 × 수량)

// 5) taxableGain (과세 대상 손익만)
//    = 평가손익 + 실현손익(국내 '과세형' ETF만) + grossDividend

// 6) isaLimit   = 2 000 000 (or 4 000 000)
// 7) isaRawTax  = max(0, taxableGain − isaLimit) × 0.099

// 8) withheldTax = grossDividend × 0.154      // 선납 배당세
//    isaFinalTax = isaRawTax − withheldTax     // 양수=추가납부, 음수=환급

// 9) normalTax  = (과세형 ETF 손익 + grossDividend) × 0.154

// 10) 절세액 = normalTax − max(isaFinalTax, 0)
//     savingRate = normalTax == 0 ? 0 : 절세액 / normalTax × 100

export function taxSavingCaculate() {}
