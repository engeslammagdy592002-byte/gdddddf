import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { SearchInput } from './ui/search-input';
import { ResultCard } from './result-card'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'

interface Result {
  name: string
  grade: number
  category?: number
  rank?: number
}

export function SearchSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    try {
      // البحث في جدول reciters أولاً
      const { data: recitersData, error: recitersError } = await supabase
        .from('reciters')
        .select('*')
        .ilike('name', `%${searchQuery.trim()}%`)
        .limit(1)
        .maybeSingle()
      
      if (recitersData && !recitersError) {
        setResult({
          name: recitersData.name,
          grade: recitersData.grade || 0,
          category: recitersData.category || undefined,
          rank: recitersData.rank || undefined
        })
        return
      }
      
      // إذا لم نجد في reciters، نبحث في results
      const { data: resultsData, error: resultsError } = await supabase
        .from('results')
        .select('*')
        .ilike('name', `%${searchQuery.trim()}%`)
        .limit(1)
        .maybeSingle()
      
      if (resultsData && !resultsError) {
        setResult({
          name: resultsData.name || '',
          grade: resultsData.grade || 0,
          category: resultsData.category || undefined,
          rank: resultsData.rank || undefined
        })
        return
      }
      
      // إذا لم نجد أي نتائج
      setError('لم يتم العثور على نتائج لهذا الاسم. تأكد من كتابة الاسم بشكل صحيح.')
      
    } catch (err) {
      console.error('Search error:', err)
      setError('حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <SearchInput
        onSearch={handleSearch}
        placeholder="اكتب اسمك الأول والأخير للبحث عن نتيجتك..."
        isLoading={isLoading}
      />
      
      {isLoading && (
        <div className="flex items-center justify-center gap-3 p-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-muted-foreground">
            جاري البحث عن نتيجتك...
          </span>
        </div>
      )}
      
      {error && (
        <Alert className="border-destructive/30 bg-destructive/5">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <AlertDescription className="text-destructive font-medium text-base">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {result && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <ResultCard
            name={result.name}
            grade={result.grade}
            category={result.category}
            rank={result.rank}
          />
        </div>
      )}
    </div>
  )
}