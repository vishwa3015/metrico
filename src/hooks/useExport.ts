import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { resultsService } from '@/services/results.service'

export interface UseExportReturn {
    exporting: boolean
    exportSelected: (resultIds: string[], onSuccess?: () => void) => Promise<void>
    exportById: (resultId: string) => Promise<void>
}

export function useExport(): UseExportReturn {
    const [exporting, setExporting] = useState(false)

    const exportSelected = useCallback(async (resultIds: string[], onSuccess?: () => void) => {
        if (resultIds.length === 0) return
        setExporting(true)
        try {
            await resultsService.exportSelected(resultIds)
            onSuccess?.()
            toast.success(`${resultIds.length} result${resultIds.length > 1 ? 's' : ''} exported successfully`)
        } catch (err) {
            console.error('[useExport] exportSelected failed', err)
            toast.error('Export failed. Please try again.')
        } finally {
            setExporting(false)
        }
    }, [])

    const exportById = useCallback(async (resultId: string) => {
        setExporting(true)
        try {
            await resultsService.exportById(resultId)
            toast.success('Result exported successfully')
        } catch (err) {
            console.error('[useExport] exportById failed', err)
            toast.error('Export failed. Please try again.')
        } finally {
            setExporting(false)
        }
    }, [])

    return { exporting, exportSelected, exportById }
}