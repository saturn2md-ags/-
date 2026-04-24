export interface UserInput {
  birthYear: number; birthMonth: number; birthDay: number
  birthHour: number; birthMinute: number
  city: string; gender: 'M' | 'F'
}
export interface ReportData {
  userInput: UserInput
  saju:   { pillars: Array<{ label: string; ganzi: string }>; daeun: Array<{ age: number; ganzi: string }> }
  ziwei:  { wuXingJu: string; mingGongZhi: string; palaces: Record<string, string> }
  natal:  { asc: string; mc: string; planets: Array<{ id: string; sign: string; degree: number; house: number; retrograde: boolean }> }
  analysis: any
}
